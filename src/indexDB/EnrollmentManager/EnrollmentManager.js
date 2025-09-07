import db from "../db";
import { TABLE_NAME } from ".";
import { dataApi } from "@/api";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as meManager from "@/indexDB/MeManager/MeManager";
import moment from "moment";
import { toDhis2Enrollments } from "../data/enrollment";
import { chunk } from "lodash";

export const pull = async ({ handleDispatchCurrentOfflineLoading, offlineSelectedOrgUnits }) => {
  try {
    if (offlineSelectedOrgUnits && offlineSelectedOrgUnits.length > 0) {
      console.log("clearing Enrollment...");
      await db[TABLE_NAME].clear();
    }
    // const updatedAt = moment().subtract(3, 'months').format('YYYY-MM-DD');
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
              "/api/tracker/enrollments",
              {
                paging: true,
                totalPages: true,
                pageSize: 2000,
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
                  "incidentDate",
                  "followup",
                ].join(",")}`,
              ],
            );

            if (!result.instances || result.instances.length === 0 || page > result.pageCount) {
              break;
            }

            console.log(
              `ENROLLMENT = ${program.id} (page=${page}/${result.pageCount}, count=${result.instances.length})`,
            );

            const resultEnrollments = {
              ...result,
              enrollments: result.instances,
            };

            await persist(await beforePersist([resultEnrollments], program.id));
          }
        } catch (error) {
          console.log("Enrollment:pull", error);
          continue;
        }
      }

      if (handleDispatchCurrentOfflineLoading) {
        handleDispatchCurrentOfflineLoading({
          id: "enr",
          percent: ((j + 1) / offlineSelectedOrgUnits.length) * 100,
        });
      }
    }
  } catch (error) {
    console.log("Enrollment:pull", error);
  }
};

export const push = async (progressCallback) => {
  const enrollments = await findOffline();

  if (enrollments?.length > 0) {
    const results = await pushAndMarkOnline(toDhis2Enrollments(enrollments), progressCallback);

    for (const result of results) {
      console.log(result.status);
    }

    return results;
  }

  return {
    status: "OK",
  };
};

export const persist = async (enrollments) => {
  console.log("persist enrollments", { enrollments });
  await db[TABLE_NAME].bulkPut(enrollments);
};

const findOffline = async () => {
  return await db[TABLE_NAME].where("isOnline").anyOf(0).toArray();
};

const markOnline = async (enrollmentIds) => {
  return await db[TABLE_NAME].where("enrollment").anyOf(enrollmentIds).modify({ isOnline: 1 });
};

const pushAndMarkOnline = async (enrollments, progressCallback) => {
  const results = [];

  if (enrollments.length === 0) {
    return results;
  }

  let enrollmentsToProcess = [...enrollments];
  const chunkSizes = [50, 20, 10, 5, 1]; // Progressive chunk sizes for retries
  const totalOriginalEnrollments = enrollments.length;
  let processedEnrollmentsCount = 0;

  for (let attempt = 0; attempt < chunkSizes.length; attempt++) {
    if (enrollmentsToProcess.length === 0) {
      break; // No more enrollments to process
    }

    const chunkSize = chunkSizes[attempt];

    // Skip if chunk size is larger than remaining enrollments
    if (enrollmentsToProcess.length < chunkSize) {
      continue;
    }

    const partitions = chunk(enrollmentsToProcess, chunkSize);
    const failedEnrollments = [];

    console.log(
      `Enrollment push attempt ${attempt + 1} with chunk size ${chunkSize}, processing ${enrollmentsToProcess.length} enrollments`,
    );

    for (let i = 0; i < partitions.length; i++) {
      const partition = partitions[i];
      console.log("pushEnrollment", { partition });

      try {
        const result = await dataApi.pushEnrollment({
          enrollments: partition,
        });

        results.push(result);

        if (result.status === "OK") {
          await markOnline(partition.map((en) => en.enrollment));
          processedEnrollmentsCount += partition.length;

          // Call progress callback if provided only on success
          if (progressCallback) {
            // Never report 100% unless all enrollments are actually processed successfully
            const percent =
              processedEnrollmentsCount === totalOriginalEnrollments
                ? 100
                : Math.min(Math.round((processedEnrollmentsCount / totalOriginalEnrollments) * 100), 99);
            progressCallback({ id: "enr", percent });
          }
        } else {
          console.error(`Failed to push enrollment chunk - status: ${result.status}`, result);
          // Add failed enrollments back to the list for retry
          failedEnrollments.push(...partition);
        }
      } catch (error) {
        console.error(`Failed to push enrollment chunk`, error);
        results.push(error);
        // Add failed enrollments back to the list for retry
        failedEnrollments.push(...partition);
      }
    }

    // Update enrollments to process for next attempt
    enrollmentsToProcess = failedEnrollments;

    if (enrollmentsToProcess.length === 0) {
      console.log(`All enrollments processed successfully after ${attempt + 1} attempts`);
      break;
    } else if (attempt === chunkSizes.length - 1) {
      console.error(`Failed to process ${enrollmentsToProcess.length} enrollments after all retry attempts`);
    }
  }

  return results;
};

export const beforePersist = async (result, program, isOnline = 1) => {
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
        enrolledAt: en.enrolledAt,
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

export const clearTable = async () => {
  console.log("clearing Enrollment table...");
  return await db[TABLE_NAME].clear();
};
