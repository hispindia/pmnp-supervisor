import { dataApi } from "@/api";
import * as meManager from "@/indexDB/MeManager";
import * as programManager from "@/indexDB/ProgramManager";
import db from "../db";
// import moment from 'moment';

export const TABLE_FIELDS =
  "trackedEntity, updatedAt, orgUnit, trackedEntityType, isDeleted, isOnline, attribute, valueType, displayName, value";
export const TABLE_NAME = "trackedEntity";

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
                `fields=${[
                  "trackedEntityInstance",
                  "trackedEntityType",
                  "orgUnit",
                  "updatedAt",
                  "inactive",
                  "deleted",
                  "attributes[attribute,value,displayName,valueType]",
                ].join(",")}`,
              ]
            );

            if (!result.instances || result.instances.length === 0) {
              break;
            }

            console.log(
              `TEI = (page=${page}, count=${result.instances.length})`
            );

            await persist(await beforePersist([result]));
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

const persist = async (trackedEntities) => {
  await db[TABLE_NAME].bulkPut(trackedEntities);
};

const beforePersist = async (result) => {
  const objects = [];
  const ids = [];

  for (const data of result) {
    const instances = data.instances;

    if (!instances) {
      continue;
    }

    for (const te of instances) {
      const trackedEntity = {
        trackedEntity: te.trackedEntity,
        updatedAt: te.updatedAt,
        orgUnit: te.orgUnit,
        trackedEntityType: te.trackedEntityType,
        isOnline: 1,
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

    // const partitions = chunk(ids, 200);

    // for (const partition of partitions) {
    //     await db[TABLE_NAME].where('trackedEntityInstance')
    //         .anyOf(partition)
    //         .delete();
    // }

    return objects;
  }
};

export const updateTEIByID = async (me) => {
  try {
    await db[TABLE_NAME].bulkPut(me);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

// trackedEntityInstance	INTEGER	NO	NULL
// updatedAt	date	NO	NULL
// orgUnit	varchar(11)	NO	NULL
// trackedEntityType	varchar(11)	NO	NULL
// isDeleted	boolean	NO	NULL
// isOnline	boolean	NO	NULL
// attribute	varchar(11)	YES	NULL
// valueType	varchar	YES	NULL
// displayName	varchar	YES	NULL
// value	TEXT	YES	NULL
