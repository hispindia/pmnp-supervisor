import { calculateDataElements } from "@/components/FamilyMemberForm/FormCalculationUtils";
import { FAMILY_UID_ATTRIBUTE_ID, MEMBER_PROGRAM_ID, MEMBER_TRACKED_ENTITY_TYPE_ID } from "@/constants/app-config";
import { getEventByYearAndHalt6Month, getEventsByYear } from "@/utils/event";
import moment from "moment";
import queryString from "query-string";
import { call, select } from "redux-saga/effects";

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
  const maxLevel = useOrgUnits.reduce((max, { level }) => (level < max ? level : max), useOrgUnits[0].level);

  const ou = useOrgUnits.find((o) => o.id === ouId);
  const splittedPath = ou.path.split("/");
  // [0] is ""
  const selectedPath = [splittedPath[0]].concat(splittedPath.slice(maxLevel, splittedPath.length)).join("/");

  return { ...ou, selected: [selectedPath] } || null;
}

export function* transformEvent(event) {
  const transformed = { ...event };
  transformed.dataValues = Object.keys(transformed.dataValues).map((dataElement) => {
    const dv = {
      dataElement,
      value: transformed.dataValues[dataElement],
    };
    return dv;
  });
  return transformed;
}

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
      // Convert 1 to "true", 0 to empty string for TRUE_ONLY fields
      if (value === "1" || value === 1 || value === "true") {
        return "true";
      } else if (value === "0" || value === 0 || value === "" || value === null || value === undefined) {
        return "";
      }
      return value ? value + "" : "";
    case "AGE":
      return value ? moment(value).format("YYYY-MM-DD") : value;
    default:
      return "";
  }
};

export function* generateTEIDhis2Payload(payload, programMetadata) {
  console.log("**********:>>>", { payload, programMetadata });
  let { family, memberDetails, memberEnrollment } = payload || {};

  let { orgUnit } = family;
  let { enrollment } = memberEnrollment || {};

  // Reconstruct payload
  // TEI
  let tei = {
    orgUnit: orgUnit,
    trackedEntity: memberDetails.id,
    trackedEntityType: MEMBER_TRACKED_ENTITY_TYPE_ID,
    programOwners: [],
    enrollments: [],
    attributes: [],
  };

  // TEI attributes
  programMetadata.trackedEntityAttributes.forEach((attr) => {
    if (attr.id === FAMILY_UID_ATTRIBUTE_ID) {
      tei.attributes.push({
        attribute: FAMILY_UID_ATTRIBUTE_ID,
        value: family.trackedEntity,
      });

      return;
    }

    tei.attributes.push({
      attribute: attr.id,
      value: convertValueBack(attr.valueType, memberDetails[attr.id]),
    });
  });

  // modified event payload for multiple program stages.
  // let modifiedEventPayload = [];

  // // Loop through programStages
  // programMetadata.programStages.forEach((programStage) => {
  //   let eventPayload = {
  //     event: generateUid(),
  //     status: "COMPLETED",
  //     program: programMetadata.id || "n/a",
  //     programStage: programStage.id,
  //     enrollmentStatus: "ACTIVE",
  //     enrollment: enrollment,
  //     orgUnit: orgUnit,
  //     occurredAt: memberEvent.occurredAt,
  //     dueDate: memberEvent.occurredAt,
  //     trackedEntity: memberDetails.id,
  //     status: memberEvent.status,
  //     dataValues: [],
  //   };

  //   // Update occurred and due date values
  //   eventPayload.occurredAt = memberEvent.occurredAt;
  //   eventPayload.dueDate = memberEvent.occurredAt;

  //   modifiedEventPayload.push(eventPayload);
  // });

  // ENR
  if (memberEnrollment) {
    let enrollmentPayload = {
      orgUnit: orgUnit,
      program: MEMBER_PROGRAM_ID,
      trackedEntity: memberDetails.id,
      enrollment: enrollment,
      trackedEntityType: MEMBER_TRACKED_ENTITY_TYPE_ID,
      enrolledAt: memberEnrollment.enrolledAt,
      occurredAt: memberEnrollment.enrolledAt,
      incidentDate: memberEnrollment.enrolledAt,
      status: "ACTIVE",
    };

    tei.enrollments.push(enrollmentPayload);
  }

  return { data: tei, memberDetails };
}
