import { dataApi } from "@/api";
import { TABLE_NAME } from ".";
import db from "../db";

import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as orgUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";

import { chunk } from "lodash";
import { toDhis2Enrollments } from "../data/enrollment";
import { toDhis2Events } from "../data/event";
import {
  toDhis2TrackedEntities,
  toDhis2TrackedEntity,
} from "../data/trackedEntity";

export const pull = async ({
  handleDispatchCurrentOfflineLoading,
  offlineSelectedOrgUnits,
}) => {
  try {
    await db[TABLE_NAME].clear();
    const programs = await programManager.getPrograms();

    for (let j = 0; j < offlineSelectedOrgUnits.length; j++) {
      const org = offlineSelectedOrgUnits[j];

      for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        let totalPages = 0;

        try {
          for (let page = 1; ; page++) {
            if (totalPages && page > totalPages) {
              break;
            }

            const result = await dataApi.get(
              "/api/tracker/trackedEntities",
              {
                paging: true,
                totalPages: true,
                pageSize: 200,
                page,
              },
              [
                `orgUnit=${org.id}`,
                `program=${program.id}`,
                `ouMode=DESCENDANTS`,
                `includeDeleted=true`,
                // `lastUpdatedStartDate=${updatedAt}`, // Need to get all data
                `fields=trackedEntity,trackedEntityType,orgUnit,updatedAt,deleted,attributes[attribute,value,displayName,valueType]`,
              ]
            );

            if (
              !result.instances ||
              result.instances.length === 0 ||
              page > result.pageCount
            ) {
              break;
            }

            console.log(
              `TEI = (page=${page}/${result.pageCount}, count=${result.instances.length})`
            );

            const resultTrackEntities = {
              ...result,
              trackedEntities: result.instances,
            };

            await persist(await beforePersist(resultTrackEntities));

            // Update total pages
            totalPages = result.pageCount;
          }
        } catch (error) {
          console.log("TrackedEntity:pull", error);
          continue;
        }
      }

      if (handleDispatchCurrentOfflineLoading) {
        handleDispatchCurrentOfflineLoading({
          id: "tei",
          percent: ((j + 1) / offlineSelectedOrgUnits.length) * 100,
        });
      }
    }
  } catch (error) {
    console.log("TrackedEntity:pull", error);
  }
};

export const push = async () => {
  console.time("TrackedEntity::push");

  var start = performance.now();
  const trackedEntities = await findOffline();

  if (trackedEntities?.length > 0) {
    const results = await pushAndMarkOnline(
      toDhis2TrackedEntities(trackedEntities)
    );

    for (const result of results) {
      console.log(result.status);
    }

    return results;
  }

  console.timeEnd("TrackedEntity::push");
  var end = performance.now();
  return {
    status: "OK",
  };
  // return "TrackedEntity::push - " + (end - start);
};

export const findOffline = async () => {
  return await db[TABLE_NAME].where("isOnline").anyOf(0).toArray();
};

export const pushAndMarkOnline = async (trackedEntities) => {
  const results = [];

  if (trackedEntities.length === 0) {
    return results;
  }

  const partitions = chunk(trackedEntities, 20);

  for (const partition of partitions) {
    console.log("postTrackedEntityInstances", { partition });

    try {
      const result = await dataApi.postTrackedEntityInstances({
        trackedEntities: partition,
      });

      console.log("postTrackedEntityInstances", { result });

      if (result.status === "OK") {
        await markOnline(partition.map((te) => te.trackedEntity));
      } else {
        throw new Error("Failed to push trackedEntity");
      }

      results.push(result);
    } catch (error) {
      results.push(error);
      console.error(`Failed to push trackedEntity`, error);
    }
  }

  return results;
};

const markOnline = async (trackedEntityIds) => {
  return await db[TABLE_NAME].where("trackedEntity")
    .anyOf(trackedEntityIds)
    .modify({ isOnline: 1 });
};

export const setTrackedEntityInstance = async ({ trackedEntity }) => {
  try {
    const tei = JSON.parse(JSON.stringify(trackedEntity));

    const updatedTeis = await beforePersist({ trackedEntities: [tei] }, 0);

    await persist(updatedTeis);

    if (trackedEntity.enrollments.length > 0) {
      // UPDATE ENROLLMENT
      const enrollment = JSON.parse(
        JSON.stringify(trackedEntity.enrollments[0])
      );

      await enrollmentManager.setEnrollment({
        enrollment,
        program: enrollment.program,
      });

      // UPDATE EVENTS
      if (enrollment.events.length > 0) {
        const events = JSON.parse(JSON.stringify(enrollment.events));

        await eventManager.setEvents({
          events,
        });
      }
    }
  } catch (error) {
    console.error(`Failed to add trackedEntity`, error);
  }
};

export const setTrackedEntityInstances = async ({ trackedEntities }) => {
  try {
    for (const trackedEntity of trackedEntities) {
      await setTrackedEntityInstance({ trackedEntity });
    }
  } catch (error) {
    console.error(`Failed to add trackedEntity`, error);
  }
};

const persist = async (trackedEntities) => {
  await db[TABLE_NAME].bulkPut(trackedEntities);
};

const beforePersist = async (result, isOnline = 1) => {
  const objects = [];
  const ids = [];

  const trackedEntities = result.trackedEntities;

  if (!trackedEntities) {
    return objects;
  }

  for (const te of trackedEntities) {
    const trackedEntity = {
      trackedEntity: te.trackedEntity,
      updatedAt: te.updatedAt,
      orgUnit: te.orgUnit,
      trackedEntityType: te.trackedEntityType,
      isOnline,
      isDeleted: te.deleted ? 1 : 0,
      valueType: "",
      displayName: "",
    };

    ids.push(trackedEntity.trackedEntity);

    if (te.attributes) {
      for (const at of te.attributes) {
        const value = Object.assign({}, trackedEntity, {
          attribute: at.attribute,
          value: at.value,
          valueType: at.valueType,
          displayName: at.displayName,
        });

        objects.push(value);
      }
    } else {
      objects.push(trackedEntity);
    }
  }

  const partitions = chunk(ids, 200);

  for (const partition of partitions) {
    await db[TABLE_NAME].where("trackedEntity").anyOf(partition).delete();
  }

  return objects;
};

const filterQueryBuilder = (query, filters) => {
  console.log(filters);

  if (filters && filters.length > 0) {
    let queryBuilder = query;

    queryBuilder = queryBuilder.filter((teiValue) => {
      let passes = true;

      filters.forEach((filter) => {
        // example: 'attribute=gv9xX5w4kKt:EQ:EzwtyXwTVzq' => ['attribute', 'gv9xX5w4kKt', 'EQ', 'EzwtyXwTVzq']
        const [attribute, field, operator, value] = filter.split(/[:=]/);

        if (operator === "EQ") {
          passes =
            passes &&
            teiValue[attribute] === field &&
            teiValue["value"] === value;
        }

        if (operator === "LIKE") {
          passes =
            passes &&
            teiValue[attribute] === field &&
            teiValue["value"].includes(value);
        }
      });

      return passes;
    });

    return queryBuilder;
  }

  return query;
};

export const findOne = async (trackedEntity) => {
  try {
    const tei = await db[TABLE_NAME].where("trackedEntity")
      .equals(trackedEntity)
      .toArray();

    return toDhis2TrackedEntity(tei);
  } catch (error) {
    console.error(`Failed to get trackedEntity`, error);
  }
};

export const find = async ({
  paging = true,
  pageSize,
  page,
  orgUnit,
  filters,
  program,
  ouMode = "SELECTED",
}) => {
  try {
    const result = {
      instances: [],
    };

    // get child orgUnits
    const selectedOrgUnit = await orgUnitManager.getOrgWithChildren(orgUnit);

    const selectedOrgUnitIds =
      selectedOrgUnit?.children.map((ou) => ou.id) || [];

    let query = {
      program,
    };

    // filter out undefined values
    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key]
    );

    let queryBuilder = db.enrollment.where(query);

    if (ouMode === "DESCENDANTS" && selectedOrgUnitIds.length > 0) {
      queryBuilder = queryBuilder.and((enr) =>
        selectedOrgUnitIds.includes(enr.orgUnit)
      );
    } else {
      queryBuilder = queryBuilder.and((enr) => enr.orgUnit === orgUnit);
    }

    if (filters && filters.length > 0 && Boolean(filters[0])) {
      let teisFilterQueryBuilder = await db[TABLE_NAME];

      teisFilterQueryBuilder = filterQueryBuilder(
        teisFilterQueryBuilder,
        filters
      );

      const teisMatchFilter = await teisFilterQueryBuilder.toArray();
      const teisMatchFilterIds = teisMatchFilter.map(
        (tei) => tei.trackedEntity
      );

      console.log({ teisMatchFilterIds });

      queryBuilder = queryBuilder.and((enr) =>
        teisMatchFilterIds.includes(enr.trackedEntity)
      );
    }

    let pager = {};
    if (paging && pageSize && page) {
      const total = await queryBuilder.count();

      queryBuilder = queryBuilder.offset((page - 1) * pageSize).limit(pageSize);

      pager = {
        page,
        pageCount: Math.ceil(total / pageSize),
        pageSize,
        total,
      };
    }

    const enrs = await queryBuilder.toArray();

    if (!enrs || enrs.length === 0) {
      return result;
    }

    const trackedEntities = enrs.map((enr) => enr.trackedEntity);

    let teisQueryBuilder = await db[TABLE_NAME].where("trackedEntity").anyOf(
      trackedEntities
    );

    const teis = await teisQueryBuilder.toArray();

    result.instances = toDhis2TrackedEntities(teis);

    if (paging && pager) {
      result.page = pager.page;
      result.pageSize = pager.pageSize;
      result.total = pager.total;
    }

    return result;
  } catch (error) {
    console.error(`Failed to get trackedEntity`, error);
  }
};

export const getTrackedEntityInstanceById = async ({
  trackedEntity,
  program,
}) => {
  const events = await db.event
    .where("trackedEntity")
    .equals(trackedEntity)
    .and((event) => event.program === program)
    .toArray();

  const enr = await db.enrollment
    .where("trackedEntity")
    .equals(trackedEntity)
    .and((enr) => enr.program === program)
    .first();

  const tei = toDhis2TrackedEntity(
    await db[TABLE_NAME].where("trackedEntity").equals(trackedEntity).toArray()
  );

  if (enr) {
    tei.enrollments = toDhis2Enrollments([enr], toDhis2Events(events));
  }
  console.log("getTrackedEntityInstanceById", { tei, trackedEntity });

  return tei;
};

export const getTrackedEntityInstances = async ({ orgUnit, filters }) => {
  let queryBuilder = db[TABLE_NAME].where("orgUnit").equals(orgUnit);

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      const [attribute, field, operator, value] = filter.split(/[:=]/);
      // example: 'attribute=gv9xX5w4kKt:EQ:EzwtyXwTVzq' => ['attribute', 'gv9xX5w4kKt', 'EQ', 'EzwtyXwTVzq']

      if (operator === "EQ") {
        queryBuilder = queryBuilder
          .and((teiValue) => teiValue[attribute] === field)
          .and((teiValue) => teiValue["value"] === value);
      }
    });
  }

  let teisMatchFilter = await queryBuilder.toArray();

  let teis = await db[TABLE_NAME].where("trackedEntity")
    .anyOf(teisMatchFilter.map((tei) => tei.trackedEntity))
    .toArray();

  return {
    instances: toDhis2TrackedEntities(teis),
  };
};

export const getTrackedEntityInstancesByIDs = async ({
  program,
  trackedEntities,
}) => {
  const enrs = await db.enrollment
    .where("trackedEntity")
    .anyOf(trackedEntities)
    .and((enr) => enr.program === program)
    .toArray();

  for (const enr of enrs) {
    const events = await db.event
      .where("enrollment")
      .equals(enr.enrollment)
      .and((event) => event.program === program)
      .toArray();

    enr.events = toDhis2Events(events);
  }

  const teis = toDhis2TrackedEntities(
    await db[TABLE_NAME].where("trackedEntity").anyOf(trackedEntities).toArray()
  );

  for (const tei of teis) {
    const teiEnr = enrs.find((enr) => enr.trackedEntity === tei.trackedEntity);

    tei.enrollments = toDhis2Enrollments([teiEnr], teiEnr.events || []);
  }

  return {
    instances: teis,
  };
};

export const updateTEIByID = async (me) => {
  try {
    await db[TABLE_NAME].bulkPut(me);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const deleteTrackedEntityInstances = async ({ trackedEntities }) => {
  try {
    for (const trackedEntity of trackedEntities) {
      const teiId = trackedEntity?.trackedEntity;

      if (!teiId) {
        return;
      }

      await db[TABLE_NAME].where("trackedEntity").anyOf(teiId).delete();

      if (trackedEntity.enrollments.length > 0) {
        // DELETE ENROLLMENT
        const enrollment = JSON.parse(
          JSON.stringify(trackedEntity.enrollments[0])
        );
        await db.enrollment.where("trackedEntity").anyOf(teiId).delete();

        // UPDATE EVENTS
        if (enrollment.events.length > 0) {
          await db.event.where("trackedEntity").anyOf(teiId).delete();
        }
      }
    }
  } catch (error) {
    console.error(`Failed to add trackedEntity`, error);
  }
};

// trackedEntity	INTEGER	NO	NULL
// updatedAt	date	NO	NULL
// orgUnit	varchar(11)	NO	NULL
// trackedEntityType	varchar(11)	NO	NULL
// isDeleted	boolean	NO	NULL
// isOnline	boolean	NO	NULL
// attribute	varchar(11)	YES	NULL
// valueType	varchar	YES	NULL
// displayName	varchar	YES	NULL
// value	TEXT	YES	NULL
