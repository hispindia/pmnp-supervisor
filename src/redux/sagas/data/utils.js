import { getEventByYearAndHalt6Month, getEventsByYear } from "@/utils/event";
import moment from "moment";
import queryString from "query-string";
import { call, select } from "redux-saga/effects";
import { calculateDataElements } from "@/components/FamilyMemberForm/FormCalculationUtils";
import { at } from "lodash";

export function* getTeiId() {
  const searchString = yield select((state) => state.router.location.search);
  const { tei: teiId } = queryString.parse(searchString);
  return teiId;
}

export function* getHeaderIndexes(payload) {
  return payload.headers.reduce((res, h) => {
    res[h.name] = payload.headers.map((e) => e.name).indexOf(h.name);
    return res;
  }, {});
}

export function* getSelectedOrgUnitByOuId(ouId) {
  const useOrgUnits = yield select((state) => state.metadata.orgUnits);
  const maxLevel = useOrgUnits.reduce(
    (max, { level }) => (level < max ? level : max),
    useOrgUnits[0].level
  );

  const ou = useOrgUnits.find((o) => o.id === ouId);
  const splittedPath = ou.path.split("/");
  // [0] is ""
  const selectedPath = [splittedPath[0]]
    .concat(splittedPath.slice(maxLevel, splittedPath.length))
    .join("/");

  return { ...ou, selected: [selectedPath] } || null;
}

export function* getCurrentEvent() {
  const currentEvents = yield select(
    (state) => state.data.tei.data.currentEvents
  );

  const { year, selected6Month } = yield select(
    (state) => state.data.tei.selectedYear
  );

  const currentEvent = getEventByYearAndHalt6Month(
    currentEvents,
    year,
    selected6Month
  );

  return currentEvent;
}

export function* makeNewCurrentEvent(dataValues) {
  const currentEvent = yield call(getCurrentEvent);

  return {
    ...currentEvent,
    dataValues: {
      ...currentEvent.dataValues,
      ...dataValues,
    },
  };
}

// clone calculateDataElements for all events of the year of Family
export function* makeNewCurrentEventsWithCalculatedDataElements(
  currentEvents,
  dataValues
) {
  const { year } = yield select((state) => state.data.tei.selectedYear);
  let eventsByYear = getEventsByYear(currentEvents, year);

  // get all dataValues in the list calculateDataElements
  const calculatedDataValues = Object.entries(dataValues).reduce(
    (acc, [key, value]) => {
      if (calculateDataElements.includes(key)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  eventsByYear = eventsByYear.reduce((acc, event) => {
    acc.push({
      ...event,
      dataValues: {
        ...event.dataValues,
        ...calculatedDataValues,
      },
    });
    return acc;
  }, []);

  return eventsByYear;
}

export function* makeNewCurrentEvents(dataValues) {
  const newCurrentEvent = yield call(makeNewCurrentEvent, dataValues);
  newCurrentEvent._isDirty = false;
  const currentEvents = yield select(
    (state) => state.data.tei.data.currentEvents
  );

  const newCurrentEvents = JSON.parse(JSON.stringify(currentEvents));
  const currentEventIndex = newCurrentEvents.findIndex(
    (e) => e.event === newCurrentEvent.event
  );

  newCurrentEvents.splice(currentEventIndex, 1, newCurrentEvent);

  const newCurrentEventsWithCalculatedDataElements = yield call(
    makeNewCurrentEventsWithCalculatedDataElements,
    newCurrentEvents,
    dataValues
  );

  newCurrentEventsWithCalculatedDataElements.forEach((event) => {
    const index = newCurrentEvents.findIndex((e) => e.event === event.event);

    newCurrentEvents.splice(index, 1, event);
  });

  return newCurrentEvents;
}

export function* transformEvent(event) {
  const transformed = { ...event };
  transformed.dataValues = Object.keys(transformed.dataValues).map(
    (dataElement) => {
      const dv = {
        dataElement,
        value: transformed.dataValues[dataElement],
      };
      return dv;
    }
  );
  return transformed;
}

const teiMapping = {
  BaiVwt8jVfg: "age",
  DmuazFb368B: "sex",
  IBLkiaYRRL3: "lastname",
  IEE2BMhfoSc: "firstname",
  NLth2WTyo7M: "nationality",
  bIzDI9HJCB0: "birthyear",
  ck9h7CokxQE: "agetype",
  tASKWHyRolc: "status",
  tJrT8GIy477: "ethnicity",
  tQeFLjYbqzv: "DOB",
  W4aInCTn8p5: "newFamilyBookNum",
  rSETgSvyVpJ: "covidNum",
  PYgXM3R2TQd: "policeNum",
  g9wNk1T3MLE: "phoneNum",
  // gv9xX5w4kKt: "FI_UID"
};
const enrMapping = {};
const eventMapping = {
  // PzzayUNGasj: "DOB",
  Z9a4Vim1cuJ: "education",
  hV0pAEbJqZj: "status",
  it3Ih0CVTV1: "age",
  kf8isugsc3x: "birthyear",
  u0Ke4EXsIKZ: "relation",
  vbBhehiwNLV: "insurance",
  xXybyxfggiE: "maritalstatus",
  xvLv4LQGQuT: "agetype",
  // ig2YSpQdP55: "FI_UID"
};
const dataMapping = {
  Active: "active",
  Transferred: "transfer-out",
  Dead: "dead",
};

const convertValueBack = (valueType, value) => {
  if (value === undefined || value === null) {
    return "";
  }

  switch (valueType) {
    case "TEXT":
    case "INTEGER_POSITIVE":
    case "INTEGER_NEGATIVE":
    case "INTEGER_ZERO_OR_POSITIVE":
    case "PERCENTAGE":
    case "NUMBER":
    case "INTEGER":
    case "PHONE_NUMBER":
    case "EMAIL":
    case "LONG_TEXT":
      return dataMapping.hasOwnProperty(value) ? dataMapping[value] : value;
    case "DATE":
      return value ? moment(value).format("YYYY-MM-DD") : value;
    case "DATETIME":
      return moment(value);
    case "TIME":
      return moment(value);
    case "BOOLEAN":
      return value + "";
    case "TRUE_ONLY":
      return value ? value + "" : "";
    case "AGE":
      return value ? moment(value).format("YYYY-MM-DD") : value;
    default:
      return "";
  }
};

export function* generateTEIDhis2Payload(payload, programMetadata) {
  console.log('**********:>>>', { payload, programMetadata });
  // let { family, currentEvent, memberEvent, memberDetails, memberTEI } = payload;
  let { family, memberEvent, memberDetails, memberEnrollment } = payload;

  let { orgUnit } = family;
  let { event } = memberEvent;
  let { enrollment } = memberEnrollment;

  // Reconstruct payload
  // TEI
  let tei = {
    orgUnit: orgUnit,
    trackedEntity: memberDetails.id,
    trackedEntityType: "Y2TBztNgJpH",
    programOwners: [],
    enrollments: [],
    attributes: [],
  };

  programMetadata.trackedEntityAttributes.forEach((attr) => {
    tei.attributes.push({
      attribute: attr.id,
      value: convertValueBack(attr.valueType, memberDetails[attr.id]),
    });
  });

  // Object.entries(teiMapping).forEach(([key, value]) => {
  //   const attributeMetadata = programMetadata.trackedEntityAttributes.find(
  //     (attr) => attr.id === key
  //   );

  //   tei.attributes.push({
  //     attribute: key,
  //     value: convertValueBack(
  //       attributeMetadata.valueType,
  //       memberDetails[teiMapping[key]]
  //     ),
  //   });
  // });

  // assign family TEI id to each member
  tei.attributes.push({
    attribute: "gv9xX5w4kKt",
    value: family.trackedEntity,
  });

  // Should not clear be cause it will be used to remove the attribute
  // clear all empty attributes
  // tei.attributes = tei.attributes.filter((attr) => attr.value);

  // ENR
  let enrollmentPayload = {
    orgUnit: orgUnit,
    program: "xvzrp56zKvI",
    trackedEntity: memberDetails.id,
    enrollment: enrollment,
    trackedEntityType: "Y2TBztNgJpH",
    enrolledAt: memberEnrollment.enrolledAt,
    occurredAt: memberEnrollment.enrolledAt,
    incidentDate: memberEnrollment.enrolledAt,
    status: "ACTIVE",
    events: [],
  };

  // let eventPayload = {
  //   event: event,
  //   status: "COMPLETED",
  //   program: programMetadata.id || 'n/a',
  //   // program: "xvzrp56zKvI",
  //   programStage: "Ux1dcyOiHe7",
  //   enrollmentStatus: "ACTIVE",
  //   enrollment: enrollment,
  //   orgUnit: orgUnit,
  //   occurredAt: memberEvent.occurredAt,
  //   dueDate: memberEvent.occurredAt,
  //   trackedEntity: memberDetails.id,
  //   status: memberEvent.status,
  //   dataValues: [],
  // };

  // modified event payload for multiple program stages.
  let modifiedEventPayload = []

  // Loop through programStages
  programMetadata.programStages.forEach((programStage) => {

    let eventPayload = {
      event: event,
      status: "COMPLETED",
      program: programMetadata.id || 'n/a',
      // program: "xvzrp56zKvI",
      // programStage: "Ux1dcyOiHe7",
      programStage: programStage.id,
      enrollmentStatus: "ACTIVE",
      enrollment: enrollment,
      orgUnit: orgUnit,
      occurredAt: memberEvent.occurredAt,
      dueDate: memberEvent.occurredAt,
      trackedEntity: memberDetails.id,
      status: memberEvent.status,
      dataValues: [],
    };


    programStage.dataElements.forEach((de) => {
      const value = convertValueBack(de.valueType, memberDetails[de.id]);

      if (de.id == "ig2YSpQdP55") {
        eventPayload.dataValues.push({
          dataElement: "ig2YSpQdP55",
          value: family.trackedEntity,
        });
      }
      if (!value) {
        return;
      }

      eventPayload.dataValues.push({
        dataElement: de.id,
        value,
      });
    });

    // Update occurred and due date values
    eventPayload.occurredAt = memberEvent.occurredAt;
    eventPayload.dueDate = memberEvent.occurredAt;

    modifiedEventPayload.push(eventPayload);
  });

  // let programStage = programMetadata.programStages[0];

  // Object.entries(eventMapping).forEach(([key, value]) => {
  //   const dataElementMetadata = programStage.dataElements.find(
  //     (de) => de.id === key
  //   );

  //   eventPayload.dataValues.push({
  //     dataElement: key,
  //     value: convertValueBack(
  //       dataElementMetadata.valueType,
  //       memberDetails[eventMapping[key]]
  //     ),
  //   });
  // });

  // assign family TEI id to each member
  // eventPayload.dataValues.push({
  //   dataElement: "ig2YSpQdP55",
  //   value: family.trackedEntity,
  // });

  // eventPayload.occurredAt = memberEvent.occurredAt;
  // eventPayload.dueDate = memberEvent.occurredAt;

  // Combine payload
  // enrollmentPayload.events.push(eventPayload);
  enrollmentPayload.events = modifiedEventPayload;
  tei.enrollments.push(enrollmentPayload);

  console.log({ tei, memberDetails });
  return { data: tei, memberDetails };
}
