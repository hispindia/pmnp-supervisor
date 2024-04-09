import db from "../db";
import { dataApi } from "@/api";
import * as programManager from "@/indexDB/ProgramManager";
import * as meManager from "@/indexDB/MeManager";

export const TABLE_FIELDS =
  "enrollment, updatedAt, orgUnit, trackedEntityType, program, enrollmentStatus, trackedEntity, enrolledAt, occurredAt, isFollowUp, isDeleted, isOnline, attribute, value";
export const TABLE_NAME = "enrollment";

export const pull = async () => {
  try {
    // const updatedAt = moment().subtract(3, 'months').format('YYYY-MM-DD');
    const programs = await programManager.getPrograms();
    const { organisationUnits } = await meManager.getMe();

    for (const org of organisationUnits) {
      for (let program of programs) {
        try {
          for (let page = 1; ; page++) {
            const result = await dataApi.get(
              "/api/tracker/enrollments",
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
                  "enrolledAt",
                  "occurredAt",
                  "followup",
                ].join(",")}`,
              ]
            );

            if (!result.instances || result.instances.length === 0) {
              break;
            }

            console.log(
              `ENROLLMENT = ${program.id} (page=${page}, count=${result.instances.length})`
            );

            await persist(await beforePersist([result], program.id));
            break;
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
  console.log({ enrollments });
  await db[TABLE_NAME].bulkPut(enrollments);
};

const beforePersist = async (result, program) => {
  const objects = [];
  const ids = [];

  for (const [_, data] of result.entries()) {
    const enrollments = data.instances;

    if (!enrollments) {
      continue;
    }

    for (const en of enrollments) {
      const enrollment = {
        enrollment: en.enrollment,
        updatedAt: en.updatedAt,
        program: program,
        orgUnit: en.orgUnit,
        enrollmentStatus: en.status,
        trackedEntityType: en.trackedEntityType,
        trackedEntity: en.trackedEntity,
        enrolledAt: en.enrolledAt,
        occurredAt: en.occurredAt,
        isOnline: 1,
        isFollowUp: en.followup ? 1 : 0,
        isDeleted: en.deleted ? 1 : 0,
      };

      ids.push(enrollment.uid);

      if (en?.attributes && en.attributes.length > 0) {
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

  return objects;
};
