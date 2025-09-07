import { dataApi } from "@/api";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import { chunk } from "lodash";
import moment from "moment";
import { TABLE_NAME } from ".";
import { toDhis2Events } from "../data/event";
import db from "../db";

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
    ],
  );
};

export const getEventsAnalyticsTable = async (pager, org, program) => {
  const dataElementIds = program.programStages.reduce((acc, ps) => {
    const dataElements = ps.dataElements.map((de) => de.id);
    return acc.concat(dataElements);
  }, []);

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
    ],
  );
};

export const pull = async ({ handleDispatchCurrentOfflineLoading, offlineSelectedOrgUnits }) => {
  try {
    // Delete the table
    if (offlineSelectedOrgUnits && offlineSelectedOrgUnits.length > 0) {
      console.log("clearing Events...");
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

            const result = await getEventsAnalyticsTable(
              {
                paging: true,
                totalPages: true,
                pageSize: 600, // using 1200 because, if getting 200 will be missing some data - DHIS2 bug
                page,
              },
              org,
              program,
            );

            if (!result.rows || result.rows.length === 0 || page > result.metaData.pager.pageCount) {
              break;
            }

            console.log(`EVENT = (page=${page}/${result.metaData.pager.pageCount}, count=${result.rows.length})`);

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

export const push = async (progressCallback) => {
  console.time("Event::push");

  const events = await findOffline();

  if (events?.length > 0) {
    const results = await pushAndMarkOnline(toDhis2Events(events), progressCallback);

    for (const result of results) {
      console.log(result.status);
    }

    return results;
  }

  console.timeEnd("Event::push");

  return {
    status: "OK",
  };
};

const findOffline = async () => {
  return await db[TABLE_NAME].where("isOnline").anyOf(0).toArray();
};

const markOnline = async (eventIds) => {
  return await db[TABLE_NAME].where("event").anyOf(eventIds).modify({ isOnline: 1 });
};

const pushAndMarkOnline = async (events, progressCallback) => {
  const results = [];

  if (events.length === 0) {
    return results;
  }

  let eventsToProcess = [...events];
  const chunkSizes = [100, 50, 20, 10, 5, 1]; // Progressive chunk sizes for retries
  const totalOriginalEvents = events.length;
  let processedEventsCount = 0;

  for (let attempt = 0; attempt < chunkSizes.length; attempt++) {
    if (eventsToProcess.length === 0) {
      break; // No more events to process
    }

    const chunkSize = chunkSizes[attempt];

    // Skip if chunk size is larger than remaining events
    if (eventsToProcess.length < chunkSize) {
      continue;
    }

    const partitions = chunk(eventsToProcess, chunkSize);
    const failedEvents = [];

    console.log(
      `Event push attempt ${attempt + 1} with chunk size ${chunkSize}, processing ${eventsToProcess.length} events`,
    );

    for (let i = 0; i < partitions.length; i++) {
      const partition = partitions[i];

      try {
        const result = await dataApi.pushEvents({
          events: partition,
        });

        results.push(result);

        if (result.status === "OK") {
          await markOnline(partition.map((en) => en.event));
          processedEventsCount += partition.length;

          // Call progress callback if provided only on success
          if (progressCallback) {
            // Never report 100% unless all events are actually processed successfully
            const percent =
              processedEventsCount === totalOriginalEvents
                ? 100
                : Math.min(Math.round((processedEventsCount / totalOriginalEvents) * 100), 99);
            progressCallback({ id: "event", percent });
          }
        } else {
          console.error(`Failed to push event chunk - status: ${result.status}`, result);
          // Add failed events back to the list for retry
          failedEvents.push(...partition);
        }
      } catch (error) {
        console.error(`Failed to push event chunk`, error);
        results.push(error);
        // Add failed events back to the list for retry
        failedEvents.push(...partition);
      }
    }

    // Update events to process for next attempt
    eventsToProcess = failedEvents;

    if (eventsToProcess.length === 0) {
      console.log(`All events processed successfully after ${attempt + 1} attempts`);
      break;
    } else if (attempt === chunkSizes.length - 1) {
      console.error(`Failed to process ${eventsToProcess.length} events after all retry attempts`);
    }
  }

  return results;
};

export const persist = async (events) => {
  console.log("persist events", { events });
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

const findHeader = (headers, name) => {
  const header = headers.find((header) => header.name === name);
  if (!header) {
    throw new Error(`Header ${name} not found`);
  }
  return header;
};

const convertValue = (metadata, datavalue) => {
  switch (metadata.valueType) {
    case "BOOLEAN":
      return datavalue === "1" ? "true" : "false";

    default:
      return datavalue;
  }
};

export const getEventsByQuery = async ({ program, programStage, orgUnit, filters, startDate, endDate }) => {
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

  const dataElementIds = program.programStages.reduce((acc, ps) => {
    const dataElements = ps.dataElements.map((de) => de.id);
    return acc.concat(dataElements);
  }, []);

  for (const ev of events) {
    const event = {
      event: ev[findHeaderIndex(result.headers, "psi")],
      updatedAt: ev[findHeaderIndex(result.headers, "eventdate")], //ev.updatedAt,
      program: program.id,
      programStage: ev[findHeaderIndex(result.headers, "ps")],
      orgUnit: ev[findHeaderIndex(result.headers, "ou")],
      eventStatus: ev.status,
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
      const metadataHeader = findHeader(result.headers, de);
      const dataValue = ev[findHeaderIndex(result.headers, de)];

      if (dataValue) {
        const value = Object.assign({}, event, {
          dataElement: de,
          value: convertValue(metadataHeader, dataValue),
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

export const clearTable = async () => {
  console.log("Clearing Event table");
  await db[TABLE_NAME].clear();
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
