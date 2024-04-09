import db from "./db";

export const TABLE_NAME = "trackedEntityInstance";
export const TABLE_FIELDS =
  "++id, trackedEntityInstance, lastUpdated, orgUnit, trackedEntityType, isDeleted, isOnline, attribute, valueType, displayName, value";

import { dataApi } from "@/api";

import * as enrollmentManager from "@/indexDB/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager";
import * as meManager from "@/indexDB/MeManager";
import * as orgUnitManager from "@/indexDB/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager";

import { chunk } from "lodash";
import { toDhis2Enrollments } from "./data/enrollment";
import { toDhis2Events } from "./data/event";
import {
  toDhis2TrackedEntities,
  toDhis2TrackedEntity,
} from "./data/trackedEntity";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();
    // const lastUpdated = moment().subtract(3, 'months').format('YYYY-MM-DD');
    const programs = await programManager.getPrograms();
    const { organisationUnits } = await meManager.getMe();

    for (const org of organisationUnits) {
      for (let program of programs) {
        let totalPages = 0;

        try {
          for (let page = 1; ; page++) {
            if (totalPages && page > totalPages) {
              break;
            }

            const result = await dataApi.get(
              "/api/trackedEntityInstances",
              {
                paging: true,
                totalPages: true,
                pageSize: 200,
                page,
              },
              [
                `ou=${org.id}`,
                `program=${program.id}`,
                `ouMode=DESCENDANTS`,
                `includeDeleted=true`,
                // `lastUpdatedStartDate=${lastUpdated}`, // Need to get all data
                `fields=trackedEntityInstance,trackedEntityType,orgUnit,lastUpdated,deleted,attributes[attribute,value,displayName,valueType]`,
              ]
            );

            if (
              !result.trackedEntityInstances ||
              result.trackedEntityInstances.length === 0 ||
              page > result.pager.pageCount
            ) {
              break;
            }

            console.log(
              `TEI = (page=${page}/${result.pager.pageCount}, count=${result.trackedEntityInstances.length})`
            );

            await persist(await beforePersist(result));

            // Update total pages
            totalPages = result.pager.pageCount;
          }
        } catch (error) {
          console.log("TrackedEntity:pull", error);
          continue;
        }
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
  }

  console.timeEnd("TrackedEntity::push");
  var end = performance.now();
  return "TrackedEntity::push - " + (end - start);
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
    console.log(partition);

    try {
      const result = await dataApi.postTrackedEntityInstances({
        trackedEntityInstances: partition,
      });

      console.log("postTrackedEntityInstances", { result });

      if (result.httpStatusCode === 200) {
        await markOnline(partition.map((te) => te.trackedEntityInstance));
      }

      results.push(result);
    } catch (error) {
      results.push(error);
      console.error(`Failed to push trackedEntityInstance`, error);
    }
  }

  return results;
};

const markOnline = async (trackedEntityIds) => {
  return await db[TABLE_NAME].where("trackedEntityInstance")
    .anyOf(trackedEntityIds)
    .modify({ isOnline: 1 });
};

export const setTrackedEntityInstance = async ({ trackedEntityInstance }) => {
  try {
    const tei = JSON.parse(JSON.stringify(trackedEntityInstance));

    const updatedTeis = await beforePersist(
      { trackedEntityInstances: [tei] },
      0
    );

    await persist(updatedTeis);

    if (trackedEntityInstance.enrollments.length > 0) {
      // UPDATE ENROLLMENT
      const enrollment = JSON.parse(
        JSON.stringify(trackedEntityInstance.enrollments[0])
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
    console.error(`Failed to add trackedEntityInstance`, error);
  }
};

export const setTrackedEntityInstances = async ({ trackedEntityInstances }) => {
  try {
    for (const trackedEntityInstance of trackedEntityInstances) {
      await setTrackedEntityInstance({ trackedEntityInstance });
    }
  } catch (error) {
    console.error(`Failed to add trackedEntityInstance`, error);
  }
};

const persist = async (trackedEntities) => {
  await db[TABLE_NAME].bulkPut(trackedEntities);
};

const beforePersist = async (result, isOnline = 1) => {
  const objects = [];
  const ids = [];

  const trackedEntityInstances = result.trackedEntityInstances;

  if (!trackedEntityInstances) {
    return objects;
  }

  for (const te of trackedEntityInstances) {
    const trackedEntity = {
      trackedEntityInstance: te.trackedEntityInstance,
      lastUpdated: te.lastUpdated,
      orgUnit: te.orgUnit,
      trackedEntityType: te.trackedEntityType,
      isOnline,
      isDeleted: te.deleted ? 1 : 0,
      valueType: "",
      displayName: "",
    };

    ids.push(trackedEntity.trackedEntityInstance);

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
    await db[TABLE_NAME].where("trackedEntityInstance")
      .anyOf(partition)
      .delete();
  }

  return objects;
};

export const findOne = async (trackedEntityInstance) => {
  try {
    const tei = await db[TABLE_NAME].where("trackedEntityInstance")
      .equals(trackedEntityInstance)
      .toArray();

    return toDhis2TrackedEntity(tei);
  } catch (error) {
    console.error(`Failed to get trackedEntityInstance`, error);
  }
};

export const find = async ({
  paging = true,
  pageSize,
  page,
  orgUnit,
  program,
  ouMode = "SELECTED",
}) => {
  try {
    const result = {
      trackedEntityInstances: [],
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

    const trackedEntityInstances = enrs.map((enr) => enr.trackedEntityInstance);

    const teis = await db[TABLE_NAME].where("trackedEntityInstance")
      .anyOf(trackedEntityInstances)
      .toArray();

    result.trackedEntityInstances = toDhis2TrackedEntities(teis);

    if (paging) {
      result.pager = pager;
    }
    return result;
  } catch (error) {
    console.error(`Failed to get trackedEntityInstance`, error);
  }
};

export const getTrackedEntityInstanceById = async ({
  trackedEntityInstance,
  program,
}) => {
  const events = await db.event
    .where("trackedEntityInstance")
    .equals(trackedEntityInstance)
    .and((event) => event.program === program)
    .toArray();

  const enr = await db.enrollment
    .where("trackedEntityInstance")
    .equals(trackedEntityInstance)
    .and((enr) => enr.program === program)
    .first();

  const tei = toDhis2TrackedEntity(
    await db[TABLE_NAME].where("trackedEntityInstance")
      .equals(trackedEntityInstance)
      .toArray()
  );

  if (enr) {
    tei.enrollments = toDhis2Enrollments([enr], toDhis2Events(events));
  }
  console.log("getTrackedEntityInstanceById", { tei });

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

  let teis = await db[TABLE_NAME].where("trackedEntityInstance")
    .anyOf(teisMatchFilter.map((tei) => tei.trackedEntityInstance))
    .toArray();

  return {
    trackedEntityInstances: toDhis2TrackedEntities(teis),
  };
};

export const getTrackedEntityInstancesByIDs = async ({
  program,
  trackedEntityInstances,
}) => {
  const enrs = await db.enrollment
    .where("trackedEntityInstance")
    .anyOf(trackedEntityInstances)
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
    await db[TABLE_NAME].where("trackedEntityInstance")
      .anyOf(trackedEntityInstances)
      .toArray()
  );

  for (const tei of teis) {
    const teiEnr = enrs.find(
      (enr) => enr.trackedEntityInstance === tei.trackedEntityInstance
    );

    tei.enrollments = toDhis2Enrollments([teiEnr], teiEnr.events || []);
  }

  return {
    trackedEntityInstances: teis,
  };
};

export const updateTEIByID = async (me) => {
  try {
    await db[TABLE_NAME].bulkPut(me);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const deleteTrackedEntityInstances = async ({
  trackedEntityInstances,
}) => {
  try {
    for (const trackedEntityInstance of trackedEntityInstances) {
      const teiId = trackedEntityInstance?.trackedEntityInstance;

      if (!teiId) {
        return;
      }

      await db[TABLE_NAME].where("trackedEntityInstance").anyOf(teiId).delete();

      if (trackedEntityInstance.enrollments.length > 0) {
        // DELETE ENROLLMENT
        const enrollment = JSON.parse(
          JSON.stringify(trackedEntityInstance.enrollments[0])
        );
        await db.enrollment
          .where("trackedEntityInstance")
          .anyOf(teiId)
          .delete();

        // UPDATE EVENTS
        if (enrollment.events.length > 0) {
          await db.event.where("trackedEntityInstance").anyOf(teiId).delete();
        }
      }
    }
  } catch (error) {
    console.error(`Failed to add trackedEntityInstance`, error);
  }
};

// trackedEntityInstance	INTEGER	NO	NULL
// lastUpdated	date	NO	NULL
// orgUnit	varchar(11)	NO	NULL
// trackedEntityType	varchar(11)	NO	NULL
// isDeleted	boolean	NO	NULL
// isOnline	boolean	NO	NULL
// attribute	varchar(11)	YES	NULL
// valueType	varchar	YES	NULL
// displayName	varchar	YES	NULL
// value	TEXT	YES	NULL
