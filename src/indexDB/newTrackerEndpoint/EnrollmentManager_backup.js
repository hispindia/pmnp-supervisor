import db from "./db";
import { dataApi } from "@/api";
import * as programManager from "@/indexDB/ProgramManager";
import * as meManager from "@/indexDB/MeManager";

export const TABLE_FIELDS =
  "++id, enrollment, lastUpdated, orgUnit, trackedEntityType, program, enrollmentStatus, trackedEntity, enrollmentDate, incidentDate, isFollowUp, isDeleted, isOnline, attribute, value";
export const TABLE_NAME = "enrollment";

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
                // `lastUpdatedStartDate=${lastUpdated}`, // Need to get all data
                `fields=${[
                  "enrollment",
                  "lastUpdated",
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

            // Update total pages
            totalPages = result.pager.pageCount;
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

const persist = async (enrollments) => {
  await db[TABLE_NAME].bulkPut(enrollments);
};

const beforePersist = async (result, program) => {
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
        lastUpdated: en.lastUpdated,
        program: program,
        orgUnit: en.orgUnit,
        enrollmentStatus: en.status,
        trackedEntityType: en.trackedEntityType,
        trackedEntity: en.trackedEntity,
        enrollmentDate: en.enrollmentDate,
        incidentDate: en.incidentDate,
        isOnline: 1,
        isFollowUp: en.followup ? 1 : 0,
        isDeleted: en.deleted ? 1 : 0,
      };

      ids.push(enrollment.uid);

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

  console.log({ objects });

  return objects;
};

export const findOne = async (id) => {
  try {
    return await db[TABLE_NAME].get(id);
  } catch (error) {
    console.error(`Failed to get enrollment`, error);
  }
};
