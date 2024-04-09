import db from "./db";
import { dataApi } from "@/api";
import * as programManager from "@/indexDB/ProgramManager";
import * as meManager from "@/indexDB/MeManager";

export const TABLE_FIELDS =
  "event, lastUpdated, orgUnit, program, programStage, eventStatus, enrollment, enrollmentStatus, trackedEntity, attributeCategoryOptions, attributeOptionCombo, dueDate, eventDate, isFollowUp, isDeleted, isOnline, dataElement, value, isProvidedElsewhere";
export const TABLE_NAME = "event";

export const pull = async () => {
  try {
    // const lastUpdated = moment().subtract(3, 'months').format('YYYY-MM-DD');
    const programs = await programManager.getPrograms();
    const { organisationUnits } = await meManager.getMe();

    for (const org of organisationUnits) {
      for (let program of programs) {
        try {
          for (let page = 1; ; page++) {
            const result = await dataApi.get(
              "/api/events",
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
                  "event",
                  "lastUpdated",
                  "dueDate",
                  "eventDate",
                  "orgUnit",
                  "trackedEntity",
                  "program",
                  "programStage",
                  "status",
                  "enrollment",
                  "enrollmentStatus",
                  "attributeCategoryOptions",
                  "attributeOptionCombo",
                  "deleted",
                  "followup",
                  "dataValues[dataElement,providedElsewhere,value]",
                ].join(",")}`,
              ]
            );

            if (!result.events || result.events.length === 0) {
              break;
            }

            console.log(
              `TEI = (page=${page}/${result.pager.pageCount}, count=${result.events.length})`
            );

            await persist(await beforePersist([result]));
            break;
          }
        } catch (error) {
          console.log("Event:pull", error);
          continue;
        }
      }
    }
  } catch (error) {
    console.log("Event:pull", error);
  }
};

const persist = async (trackedEntities) => {
  await db[TABLE_NAME].bulkPut(trackedEntities);
};

const beforePersist = async (result) => {
  const objects = [];
  const ids = [];

  for (const [_, data] of result.entries()) {
    const events = data.events;

    if (!events || events.length === 0) {
      continue;
    }

    for (const ev of events) {
      const event = {
        event: ev.event,
        lastUpdated: ev.lastUpdated,
        program: ev.program,
        programStage: ev.programStage,
        orgUnit: ev.orgUnit,
        eventStatus: ev.status,
        enrollment: ev.enrollment,
        enrollmentStatus: ev.enrollmentStatus,
        trackedEntity: ev.trackedEntityInstance,
        attributeOptionCombo: ev.attributeOptionCombo,
        dueDate: ev.dueDate,
        eventDate: ev.eventDate,
        isOnline: 1,
        isFollowUp: ev.followup ? 1 : 0,
        isDeleted: ev.deleted ? 1 : 0,
      };

      ids.push(event.uid);

      for (const dv of ev.dataValues) {
        const value = Object.assign({}, event, {
          dataElement: dv.dataElement,
          value: dv.value,
          isProvidedElsewhere: dv.providedElsewhere ? 1 : 0,
        });

        objects.push(value);
      }
    }
  }

  return objects;
};

export const setEvent = async (me) => {
  try {
    await db[TABLE_NAME].bulkPut(me);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

/**
event	INTEGER	NO	NULL	
lastUpdated	date	NO	NULL	
orgUnit	varchar(11)	NO	NULL	
program	varchar(11)	NO	NULL	
programStage	varchar(11)	NO	NULL	
eventStatus	TEXT	NO	NULL	
enrollment	varchar(11)	YES	NULL	
enrollmentStatus	TEXT	YES	NULL	
trackedEntity	varchar(11)	YES	NULL	
attributeCategoryOptions	varchar(11)	YES	NULL	
attributeOptionCombo	varchar(11)	YES	NULL	
dueDate	date	YES	NULL	
eventDate	date	YES	NULL	
isFollowUp	boolean	NO	NULL	
isDeleted	boolean	NO	NULL	
isOnline	boolean	NO	NULL	
dataElement	varchar(11)	NO	NULL	
value	TEXT	YES	NULL	
isProvidedElsewhere	boolean	NO	NULL	
 */
