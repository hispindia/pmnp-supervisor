import db from "./db";
import { dataApi } from "@/api";
import * as programManager from "@/indexDB/ProgramManager";
import * as meManager from "@/indexDB/MeManager";
import moment from "moment";
import { toDhis2Enrollments } from "./data/enrollment";
import { chunk } from "lodash";

export const TABLE_FIELDS =
  "++id, enrollment, updatedAt, orgUnit, trackedEntityType, program, enrollmentStatus, trackedEntity, enrollmentDate, incidentDate, isFollowUp, isDeleted, isOnline, attribute, value";
export const TABLE_NAME = "enrollment";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();
    // const updatedAt = moment().subtract(3, 'months').format('YYYY-MM-DD');
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
              "/api/enrollments",
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
                `fields=${[
                  "enrollment",
                  "updatedAt",
                  "trackedEntityType",
                  "trackedEntity",
                  "program",
                  "status",
                  "orgUnit",
                  "enrollmentDate",
                  "incidentDate",
                  "followup",
                ].join(",")}`,
              ]
            );

            if (
              !result.enrollments ||
              result.enrollments.length === 0 ||
              page > result.pager.pageCount
            ) {
              break;
            }

            console.log(
              `ENROLLMENT = ${program.id} (page=${page}/${result.pager.pageCount}, count=${result.enrollments.length})`
            );

            await persist(await beforePersist([result], program.id));
          }
        } catch (error) {
          console.log("Enrollment:pull", error);
          continue;
        }
      }
    }
  } catch (error) {
    console.log("Enrollment:pull", error);
  }
};

export const push = async () => {
  console.time("Enrollment::push");
  var start = performance.now();

  const enrollments = await findOffline();

  if (enrollments?.length > 0) {
    const results = await pushAndMarkOnline(toDhis2Enrollments(enrollments));

    for (const result of results) {
      console.log(result.status);
    }
  }

  console.timeEnd("Enrollment::push");
  var end = performance.now();
  return "Enrollment::push - " + (end - start);
};

const persist = async (enrollments) => {
  await db[TABLE_NAME].bulkPut(enrollments);
};

const findOffline = async () => {
  return await db[TABLE_NAME].where("isOnline").anyOf(0).toArray();
};

const markOnline = async (enrollmentIds) => {
  return await db[TABLE_NAME].where("enrollment")
    .anyOf(enrollmentIds)
    .modify({ isOnline: 1 });
};

const pushAndMarkOnline = async (enrollments) => {
  const results = [];

  if (enrollments.length === 0) {
    return results;
  }

  const partitions = chunk(enrollments, 20);

  for (const partition of partitions) {
    console.log(partition);

    try {
      const result = await dataApi.pushEnrollment({
        enrollments: partition,
      });

      console.log("pushEnrollment", { result });

      results.push(result);

      if (result.httpStatusCode === 200) {
        await markOnline(partition.map((en) => en.enrollment));
      }
    } catch (error) {
      console.error(`Failed to push enrollment`, error);
      results.push(error);
    }
  }

  return results;
};

const beforePersist = async (result, program, isOnline = 1) => {
  const objects = [];
  const ids = [];

  for (const [_, data] of result.entries()) {
    const enrollments = data.enrollments;

    if (!enrollments) {
      continue;
    }

    for (const en of enrollments) {
      const enrollment = {
        enrollment: en.enrollment,
        updatedAt: en.updatedAt || moment().format("YYYY-MM-DD"),
        program: program,
        orgUnit: en.orgUnit,
        enrollmentStatus: en.status,
        trackedEntityType: en.trackedEntityType,
        trackedEntity: en.trackedEntity,
        enrollmentDate: en.enrollmentDate,
        incidentDate: en.incidentDate,
        isOnline,
        isFollowUp: en.followup ? 1 : 0,
        isDeleted: en.deleted ? 1 : 0,
      };

      ids.push(enrollment.enrollment);

      if (en.attributes && en.attributes.length > 0) {
        for (const at of en.attributes) {
          const value = Object.assign({}, enrollment, {
            attribute: at.attribute,
            value: at.value,
          });

          objects.push(value);
        }
      } else {
        objects.push(enrollment);
      }
    }
  }

  const partitions = chunk(ids, 200);

  for (const partition of partitions) {
    await db[TABLE_NAME].where("enrollment").anyOf(partition).delete();
  }

  return objects;
};

export const setEnrollment = async ({ enrollment, program }) => {
  const enr = await beforePersist([{ enrollments: [enrollment] }], program, 0);

  await persist(enr);
};

export const findOne = async (id) => {
  try {
    return await db[TABLE_NAME].get(id);
  } catch (error) {
    console.error(`Failed to get enrollment`, error);
  }
};
