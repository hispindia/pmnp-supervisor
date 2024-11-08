import db from "../db";
import { TABLE_NAME } from ".";
import { dataApi } from "@/api";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as meManager from "@/indexDB/MeManager/MeManager";
import moment from "moment";
import { chunk } from "lodash";
import { toDhis2Events } from "../data/event";

export const getEventsRawData = async (pager, org, program) => {
  return await dataApi.get(
    "/api/events",
    {
      ...pager,
    },
    [
      // `orgUnit=ia7PTbi01id`,
      // `ouMode=SELECTED`,

      `orgUnit=${org.id}`,
      `ouMode=DESCENDANTS`,
      `program=${program.id}`,
      `includeDeleted=true`,
      // `lastUpdatedStartDate=${updatedAt}`, // Need to get all data
      `fields=${[
        "event",
        "updatedAt",
        "dueDate",
        "occurredAt",
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
};

export const getEventsAnalyticsTable = async (pager, org, program) => {
  const dataElementIds = program.programStages[0].dataElements.map(
    (de) => de.id
  );

  return await dataApi.get(
    `/api/analytics/events/query/${program.id}`,
    {
      ...pager,
    },
    [
      `dimension=ou:${org.id}`,
      `ouMode=DESCENDANTS`,
      `startDate=2018-01-01`,
      `endDate=${moment().format("YYYY-MM-DD")}`,
      // `dimension=dx:${dataElementIds.map((de) => de).join(';')}`,
      dataElementIds.map((de) => `dimension=${de}`).join("&"),
    ]
  );
};

export const pull = async ({
  handleDispatchCurrentOfflineLoading,
  offlineSelectedOrgUnits,
}) => {
  try {
    // Delete the table
    await db[TABLE_NAME].clear();
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

            const result = await getEventsAnalyticsTable(
              {
                paging: true,
                totalPages: true,
                pageSize: 600, // using 1200 because, if getting 200 will be missing some data - DHIS2 bug
                page,
              },
              org,
              program
            );

            if (
              !result.rows ||
              result.rows.length === 0 ||
              page > result.metaData.pager.pageCount
            ) {
              break;
            }

            console.log(
              `EVENT = (page=${page}/${result.metaData.pager.pageCount}, count=${result.rows.length})`
            );

            await persist(await beforePersistAnalyticsData(result, program));

            // Update total pages
            totalPages = result.metaData.pager.pageCount;
          }
        } catch (error) {
          console.log("Event:pull", error);
          continue;
        }
      }

      if (handleDispatchCurrentOfflineLoading) {
        handleDispatchCurrentOfflineLoading({
          id: "event",
          percent: ((j + 1) / offlineSelectedOrgUnits.length) * 100,
        });
      }
    }
  } catch (error) {
    console.log("Event:pull", error);
  }
};

export const push = async () => {
  console.time("Event::push");
  var start = performance.now();

  const events = await findOffline();

  if (events?.length > 0) {
    const results = await pushAndMarkOnline(toDhis2Events(events));

    for (const result of results) {
      console.log(result.status);
    }

    return results;
  }

  console.timeEnd("Event::push");
  var end = performance.now();
  // return "Event::push - " + (end - start);
  return {
    status: "OK",
  };
};

const findOffline = async () => {
  return await db[TABLE_NAME].where("isOnline").anyOf(0).toArray();
};

const markOnline = async (eventIds) => {
  return await db[TABLE_NAME].where("event")
    .anyOf(eventIds)
    .modify({ isOnline: 1 });
};

const pushAndMarkOnline = async (events) => {
  const results = [];

  if (events.length === 0) {
    return results;
  }

  const partitions = chunk(events, 20);

  for (const partition of partitions) {
    console.log("pushEvents", { partition });

    try {
      const result = await dataApi.pushEvents({
        events: partition,
      });

      console.log("pushEvents", { result });

      results.push(result);

      if (result.status === "OK") {
        await markOnline(partition.map((en) => en.event));
      }
    } catch (error) {
      console.error(`Failed to push event`, error);
      results.push(error);
    }
  }

  return results;
};

const persist = async (events) => {
  await db[TABLE_NAME].bulkPut(events);
};

export const beforePersist = async (result) => {
  const objects = [];
  const ids = [];

  const events = result?.events;

  if (!events || events.length === 0) {
    return objects;
  }

  for (const ev of events) {
    const event = {
      event: ev.event,
      updatedAt: ev.updatedAt,
      program: ev.program,
      programStage: ev.programStage,
      orgUnit: ev.orgUnit,
      eventStatus: ev.status,
      enrollment: ev.enrollment,
      enrollmentStatus: ev.enrollmentStatus,
      trackedEntity: ev.trackedEntity,
      attributeOptionCombo: ev.attributeOptionCombo,
      dueDate: ev.dueDate,
      occurredAt: ev.occurredAt,
      isOnline: 1,
      isFollowUp: ev.followup ? 1 : 0,
      isDeleted: ev.deleted ? 1 : 0,
    };

    ids.push(event.event);

    for (const dv of ev.dataValues) {
      const value = Object.assign({}, event, {
        dataElement: dv.dataElement,
        value: dv.value,
        isProvidedElsewhere: dv.providedElsewhere || false,
      });

      objects.push(value);
    }
  }

  return objects;
};

const findHeaderIndex = (headers, name) => {
  return headers.findIndex((header) => header.name === name);
};

export const getEventsByQuery = async ({
  program,
  programStage,
  orgUnit,
  filters,
  startDate,
  endDate,
}) => {
  let queryBuilder = db[TABLE_NAME].where("orgUnit").equals(orgUnit);

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      const [field, operator, value] = filter.split(/[:=]/);
      // example: 'attribute=gv9xX5w4kKt:EQ:EzwtyXwTVzq' => ['attribute', 'gv9xX5w4kKt', 'EQ', 'EzwtyXwTVzq']

      if (operator === "EQ") {
        queryBuilder = queryBuilder
          .and((teiValue) => teiValue["dataElement"] === field)
          .and((teiValue) => teiValue["value"] === value);
      }
    });
  }

  if (program) {
    queryBuilder = queryBuilder.and((env) => env.program === program);
  }

  if (programStage) {
    queryBuilder = queryBuilder.and((env) => env.programStage === programStage);
  }

  if (startDate) {
    queryBuilder = queryBuilder.and((env) => {
      return moment(env.occurredAt, "YYYY-MM-DD").isSameOrAfter(startDate);
    });
  }
  if (endDate) {
    queryBuilder = queryBuilder.and((env) => {
      return moment(env.occurredAt, "YYYY-MM-DD").isSameOrBefore(endDate);
    });
  }

  let eventsMatchFilter = await queryBuilder.toArray();

  return {
    events: toDhis2Events(eventsMatchFilter),
  };
};

export const deleteEvents = async ({ events }) => {
  const eventIds = events.map((ev) => ev.event);
  await db[TABLE_NAME].where("event").anyOf(eventIds).delete();
};

const beforePersistAnalyticsData = async (result, program) => {
  const objects = [];
  const ids = [];

  const events = result.rows;

  if (!events || events.length === 0) {
    return objects;
  }

  const dataElementIds = program.programStages[0].dataElements.map(
    (de) => de.id
  );

  for (const ev of events) {
    const event = {
      event: ev[findHeaderIndex(result.headers, "psi")],
      updatedAt: ev[findHeaderIndex(result.headers, "eventdate")], //ev.updatedAt,
      program: program.id,
      programStage: ev[findHeaderIndex(result.headers, "ps")],
      orgUnit: ev[findHeaderIndex(result.headers, "ou")],
      eventStatus: `ACTIVE`, //ev.status,
      enrollment: ev[findHeaderIndex(result.headers, "pi")],
      enrollmentStatus: `ACTIVE`, //ev.enrollmentStatus,
      trackedEntity: ev[findHeaderIndex(result.headers, "tei")],
      attributeOptionCombo: `HllvX50cXC0`, // ev.attributeOptionCombo,
      dueDate: ev[findHeaderIndex(result.headers, "eventdate")], // ev.dueDate,
      occurredAt: ev[findHeaderIndex(result.headers, "eventdate")],
      isOnline: 1,
      isFollowUp: 0, // ev.followup || false,
      isDeleted: 0, // ev.deleted || false,
    };

    ids.push(event.event);

    for (const de of dataElementIds) {
      const dataValue = ev[findHeaderIndex(result.headers, de)];

      if (dataValue) {
        const value = Object.assign({}, event, {
          dataElement: de,
          value: ev[findHeaderIndex(result.headers, de)],
          isProvidedElsewhere: 0, // dv.providedElsewhere || false,
        });

        objects.push(value);
      }
    }
  }

  const partitions = chunk(ids, 200);

  for (const partition of partitions) {
    await db[TABLE_NAME].where("event").anyOf(partition).delete();
  }

  return objects;
};

export const findOne = async (event) => {
  return await db[TABLE_NAME].get(event);
};

export const findAll = async () => {
  return await db[TABLE_NAME].toArray();
};

export const setEvents = async ({ events }) => {
  for (const ev of events) {
    await setEvent(ev);
  }
};

const setEvent = async (ev) => {
  try {
    const ids = [];
    const objects = [];

    const event = {
      event: ev.event,
      updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      program: ev.program,
      programStage: ev.programStage,
      orgUnit: ev.orgUnit,
      status: ev.eventStatus || ev.status,
      eventStatus: ev.eventStatus || ev.status,
      enrollment: ev.enrollment,
      enrollmentStatus: ev.status || ev.enrollmentStatus,
      trackedEntity: ev.trackedEntity,
      attributeOptionCombo: ev.attributeOptionCombo || "HllvX50cXC0",
      dueDate: ev.dueDate,
      occurredAt: ev.occurredAt,
      isOnline: 0,
      isFollowUp: ev.followup ? 1 : 0,
      isDeleted: ev.deleted ? 1 : 0,
    };

    ids.push(event.event);

    for (const dv of ev.dataValues) {
      if (dv?.value || dv?.dontClear) {
        const value = Object.assign({}, event, {
          dataElement: dv.dataElement,
          value: dv.value,
          isProvidedElsewhere: dv.providedElsewhere || false,
        });
        objects.push(value);
      }
    }

    const partitions = chunk(ids, 200);

    for (const partition of partitions) {
      await db[TABLE_NAME].where("event").anyOf(partition).delete();
    }

    console.log("setEvent", objects);

    await persist(objects);

    return;
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

/**
event	INTEGER	NO	NULL	
updatedAt	date	NO	NULL	
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
occurredAt	date	YES	NULL	
isFollowUp	boolean	NO	NULL	
isDeleted	boolean	NO	NULL	
isOnline	boolean	NO	NULL	
dataElement	varchar(11)	NO	NULL	
value	TEXT	YES	NULL	
isProvidedElsewhere	boolean	NO	NULL	
 */
