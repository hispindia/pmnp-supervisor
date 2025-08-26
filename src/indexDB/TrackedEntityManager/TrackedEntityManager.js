import { dataApi } from "@/api";
import { TABLE_NAME } from ".";
import db from "../db";

import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as orgUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as meManager from "@/indexDB/MeManager/MeManager";

import { chunk } from "lodash";
import { toDhis2Enrollments } from "../data/enrollment";
import { toDhis2Events } from "../data/event";
import { toDhis2TrackedEntities, toDhis2TrackedEntity } from "../data/trackedEntity";
import {
  DATA_COLLECT_ATTRIBUTE_ID,
  FAMILY_UID_ATTRIBUTE_ID,
  HOUSEHOLD_DATA_COLLECTOR_ATTR_ID,
  HOUSEHOLD_PROGRAM_ID,
  MEMBER_PROGRAM_ID,
} from "@/constants/app-config";
import { extractTeis } from "@/utils/common";

export const pull = async ({ handleDispatchCurrentOfflineLoading, offlineSelectedOrgUnits }) => {
  try {
    if (offlineSelectedOrgUnits && offlineSelectedOrgUnits.length > 0) {
      console.log("clearing TrackedEntity...");
      await db[TABLE_NAME].clear();
    }

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
                pageSize: 1000,
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

            if (!result.instances || result.instances.length === 0 || page > result.pageCount) {
              break;
            }

            console.log(`TEI = (page=${page}/${result.pageCount}, count=${result.instances.length})`);

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

export const pullNested = async ({ handleDispatchCurrentOfflineLoading, offlineSelectedOrgUnits }) => {
  try {
    if (offlineSelectedOrgUnits && offlineSelectedOrgUnits.length > 0) {
      console.log("clearing TrackedEntity...");
      await db[TABLE_NAME].clear();
    }

    let page = 1;
    const pageSize = 20;

    let pageCount = 0;
    let resultTeis = [];
    const getTeis = async (program, filter) => {
      const result = await dataApi.get(
        "/api/tracker/trackedEntities",
        { paging: true, totalPages: true, pageSize, page },
        [
          `orgUnit=${offlineSelectedOrgUnits.map((o) => o.id).join(";")}`,
          `program=${program}`,
          `ouMode=DESCENDANTS`,
          `includeDeleted=true`,
          `fields=program,trackedEntity,trackedEntityType,orgUnit,updatedAt,deleted,attributes[attribute,value,displayName,valueType],enrollments[enrollment,updatedAt,trackedEntityType,trackedEntity,program,status,orgUnit,enrolledAt,incidentDate,followup,events[event,updatedAt,dueDate,occurredAt,orgUnit,trackedEntity,program,programStage,status,enrollment,enrollmentStatus,attributeCategoryOptions,attributeOptionCombo,deleted,followup,dataValues[dataElement,providedElsewhere,value]]]`,
          filter,
        ]
      );

      pageCount = result.pageCount;
      resultTeis.push(...result.instances);
    };

    console.log("pulling nested hh tei by collector...");
    handleDispatchCurrentOfflineLoading({ id: "hh_program", percent: 0 });
    let hhFilter = "";

    const me = await meManager.getMe();
    console.log(me);
    const isSuperuser = me?.userRoles.some((role) => role.code === "Superuser");
    if (!isSuperuser) hhFilter = `filter=${HOUSEHOLD_DATA_COLLECTOR_ATTR_ID}:EQ:${me.username}`;

    await getTeis(HOUSEHOLD_PROGRAM_ID, hhFilter);
    handleDispatchCurrentOfflineLoading({ id: "hh_program", percent: Math.round((page / pageCount) * 100) });
    while (page < pageCount) {
      page++;
      await getTeis(HOUSEHOLD_PROGRAM_ID, hhFilter);
      handleDispatchCurrentOfflineLoading({ id: "hh_program", percent: Math.round((page / pageCount) * 100) });
    }

    const extractedHHResult = extractTeis(resultTeis);
    console.log("writing nested hh teis...", { extractedHHResult });
    await persist(await beforePersist({ trackedEntities: extractedHHResult.teis }));
    await enrollmentManager.persist(
      await enrollmentManager.beforePersist([{ enrollments: extractedHHResult.enrs }], HOUSEHOLD_PROGRAM_ID)
    );
    await eventManager.persist(await eventManager.beforePersist({ events: extractedHHResult.events }));

    console.log("pulling nested member tei by family ids...");
    // reset
    pageCount = 0;
    resultTeis = [];
    handleDispatchCurrentOfflineLoading({ id: "member_program", percent: 0 });
    const memberFilter = `filter=${FAMILY_UID_ATTRIBUTE_ID}:IN:${extractedHHResult.teis
      .map((t) => t.trackedEntity)
      .join(";")}`;

    await getTeis(MEMBER_PROGRAM_ID, memberFilter);
    handleDispatchCurrentOfflineLoading({ id: "member_program", percent: Math.round((page / pageCount) * 100) });
    while (page < pageCount) {
      page++;
      await getTeis(MEMBER_PROGRAM_ID, memberFilter);
    }

    const extractedMemberResult = extractTeis(resultTeis);
    console.log("writing nested member teis...", { extractedMemberResult });
    await persist(await beforePersist({ trackedEntities: extractedMemberResult.teis }));
    await enrollmentManager.persist(
      await enrollmentManager.beforePersist([{ enrollments: extractedMemberResult.enrs }], MEMBER_PROGRAM_ID)
    );
    await eventManager.persist(await eventManager.beforePersist({ events: extractedMemberResult.events }));

    handleDispatchCurrentOfflineLoading({ id: "member_program", percent: Math.round((page / pageCount) * 100) });
  } catch (error) {
    console.log("TrackedEntity:pull", error);
  }
};

export const push = async () => {
  console.time("TrackedEntity::push");

  var start = performance.now();
  const trackedEntities = await findOffline();

  if (trackedEntities?.length > 0) {
    const results = await pushAndMarkOnline(toDhis2TrackedEntities(trackedEntities));

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
    try {
      const result = await dataApi.postTrackedEntityInstances({
        trackedEntities: partition,
      });

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
  return await db[TABLE_NAME].where("trackedEntity").anyOf(trackedEntityIds).modify({ isOnline: 1 });
};

export const setTrackedEntityInstance = async ({ trackedEntity }) => {
  try {
    const tei = JSON.parse(JSON.stringify(trackedEntity));
    tei.updatedAt = new Date().toISOString().slice(0, -1);

    const updatedTeis = await beforePersist({ trackedEntities: [tei] }, 0);

    await persist(updatedTeis);

    if (trackedEntity?.enrollments?.length > 0) {
      // UPDATE ENROLLMENT
      const enrollment = JSON.parse(JSON.stringify(trackedEntity.enrollments[0]));

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
  console.log("persist trackedEntities", { trackedEntities });
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
  if (filters && filters.length > 0) {
    let queryBuilder = query;

    queryBuilder = queryBuilder.filter((teiValue) => {
      let passes = true;

      filters.forEach((filter) => {
        // example: 'attribute=gv9xX5w4kKt:EQ:EzwtyXwTVzq' => ['attribute', 'gv9xX5w4kKt', 'EQ', 'EzwtyXwTVzq']
        const [attribute, field, operator, value] = filter.split(/[:=]/);

        if (operator === "EQ") {
          passes = passes && teiValue[attribute] === field && teiValue["value"] === value;
        }

        if (operator === "LIKE") {
          passes = passes && teiValue[attribute] === field && teiValue["value"].includes(value);
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
    const tei = await db[TABLE_NAME].where("trackedEntity").equals(trackedEntity).toArray();

    return toDhis2TrackedEntity(tei);
  } catch (error) {
    console.error(`Failed to get trackedEntity`, error);
  }
};
export const findOuPattern = async ({ orgUnit }) => {
  try {
    const patternData = await db[TABLE_NAME].where("trackedEntity").equals(orgUnit).toArray();

    // return toDhis2TrackedEntity(tei);
    console.log("patternData :>> ", patternData);
  } catch (error) {
    console.error(`Failed to get trackedEntity`, error);
  }
};

export const find = async ({ paging = true, pageSize, page, orgUnit, filters, program, ouMode = "SELECTED" }) => {
  try {
    const result = {
      instances: [],
    };

    // get child orgUnits
    const selectedOrgUnit = await orgUnitManager.getOrgWithChildren(orgUnit);

    const selectedOrgUnitIds = selectedOrgUnit?.children.map((ou) => ou.id) || [];

    let query = {
      program,
    };

    // filter out undefined values
    Object.keys(query).forEach((key) => query[key] === undefined && delete query[key]);

    let queryBuilder = db.enrollment.where(query);

    if (ouMode === "DESCENDANTS" && selectedOrgUnitIds.length > 0) {
      queryBuilder = queryBuilder.and((enr) => selectedOrgUnitIds.includes(enr.orgUnit));
    } else {
      queryBuilder = queryBuilder.and((enr) => enr.orgUnit === orgUnit);
    }

    if (filters && filters.length > 0 && Boolean(filters[0])) {
      const teisMatchFilter = [];

      // loop filters
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];

        let singleQueryBuilder = await db[TABLE_NAME];
        singleQueryBuilder = filterQueryBuilder(singleQueryBuilder, [filter]);

        const recordsMatchFilter = await singleQueryBuilder.toArray();

        if (recordsMatchFilter && recordsMatchFilter.length > 0) {
          teisMatchFilter.push(recordsMatchFilter);
        }
      }

      let teisMatchFilterIds = [];

      if (teisMatchFilter.length > 1) {
        // When multiple filters, only keep trackedEntities that appear in ALL filter results (AND logic)

        // Get trackedEntity IDs from first filter result
        const firstFilterTeiIds = teisMatchFilter[0].map((tei) => tei.trackedEntity);

        // Find trackedEntities that appear in ALL filter results
        teisMatchFilterIds = firstFilterTeiIds.filter((trackedEntityId) => {
          // Check if this trackedEntity exists in all other filter results
          return teisMatchFilter.every((filterResult) =>
            filterResult.some((tei) => tei.trackedEntity === trackedEntityId)
          );
        });
      } else if (teisMatchFilter.length === 1) {
        // Single filter - use all results
        teisMatchFilterIds = teisMatchFilter[0].map((tei) => tei.trackedEntity);
      }

      if (teisMatchFilterIds.length > 0) {
        queryBuilder = queryBuilder.and((enr) => teisMatchFilterIds.includes(enr.trackedEntity));
      } else {
        // No matching results - return empty
        return result;
      }
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

    let teisQueryBuilder = await db[TABLE_NAME].where("trackedEntity").anyOf(trackedEntities);

    const teis = await teisQueryBuilder.toArray();

    result.instances = toDhis2TrackedEntities(teis);

    if (paging && pager) {
      result.page = pager.page;
      result.pageSize = pager.pageSize;
      result.pageCount = pager.pageCount;
      result.total = pager.total;
    }

    return result;
  } catch (error) {
    console.error(`Failed to get trackedEntity`, error);
  }
};

export const getTrackedEntityInstanceById = async ({ trackedEntity, program }) => {
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

  const tei = toDhis2TrackedEntity(await db[TABLE_NAME].where("trackedEntity").equals(trackedEntity).toArray());

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

export const getTrackedEntityInstancesByIDs = async ({ program, trackedEntities }) => {
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

  const teis = toDhis2TrackedEntities(await db[TABLE_NAME].where("trackedEntity").anyOf(trackedEntities).toArray());

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
        const enrollment = JSON.parse(JSON.stringify(trackedEntity.enrollments[0]));
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
