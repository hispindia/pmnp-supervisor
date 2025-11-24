import { MEMBER_TRACKED_ENTITY_TYPE_ID } from "@/constants/app-config";
import { convertValueBack } from "@/utils";
import { HH_STATUSES } from "../constants";

export const getHHStatus = (interviewResult, supervisorStatus) => {
    if (interviewResult === "Non-Eligible") return HH_STATUSES.nonEligible;
    if (!interviewResult || interviewResult === "Postponed" || interviewResult === "Not at home") {
      return HH_STATUSES.pending;
    }
    if (interviewResult === "Refused") return HH_STATUSES.refused;
    if (interviewResult === "Others") return HH_STATUSES.other;
    if (interviewResult === "Partially Completed") return HH_STATUSES.ongoing;
    if (interviewResult === "Completed" && supervisorStatus==='Approved') return HH_STATUSES.approved;
    if (interviewResult === "Completed" && supervisorStatus==='') return HH_STATUSES.submitted;
    if (interviewResult === "Needs_updates") return HH_STATUSES.needsUpdates;
  };
  
export const clearHiddenFieldData = (metadata, data, extCondition = (itemMetadata) => true) => {
  // clear data for hidden items
  for (let meta in metadata) {
    if (metadata[meta].hidden && extCondition(metadata[meta])) {
      delete data[meta];
    }
  }
};

export const updateMetadata = (metadata, data) => {
  metadata.forEach((md) => {
    // Options
    if (md.valueSet) {
      md.valueSet.forEach((item) => {
        // Compulsory
        if (md.existCompulsory) {
          if (data.length == 0) {
            if (item.compulsory && !_.some(data, { [md.code]: item.value })) {
              item.isDisabled = false;
            } else {
              item.isDisabled = true;
            }
          } else {
            item.isDisabled = false;
          }
        }

        // Unique
        if (item.unique) {
          if (_.some(data, { [md.code]: item.value })) {
            item.isDisabled = true;
          }
        }

        // Number column
        // if (item.orderNumber) {
        //   if (_.some(data.dataVals, { [md.code]: item.code })) {
        //     item.disabled = true;
        //   } else {
        //     item.disabled = false;
        //   }
        // }
      });
    }
  });
  return metadata;
};

export const compareObject = (obj1, obj2) => {
  const filtered = Object.keys(obj1).filter((key) => {
    // case property is object
    if (typeof obj1[key] === "object") {
      //case object 2 don't have this property (add new case)
      if (obj2?.[key] === undefined || obj2?.[key] === null) return true;
      //case object 1 don't have this property (delete case)
      if (obj1?.[key] === undefined || obj1?.[key] === null) return true;

      return !compareObject(obj1[key], obj2[key]);
    }

    // case object 2 don't have this property (add new case)
    if (obj2?.[key] === undefined || obj2?.[key] === null) return true;
    // case object 1 don't have this property (delete case)
    if (obj1?.[key] === undefined || obj1?.[key] === null) return true;

    return obj1[key] !== obj2[key];
  });

  return !filtered.length;
};

export const generateTEIDhis2Payload = ({ teiData, programMetadata, orgUnit }) => {
  const { trackedEntityAttributes } = programMetadata;

  // TEI
  let tei = {
    orgUnit: orgUnit,
    trackedEntity: teiData.id,
    trackedEntityType: MEMBER_TRACKED_ENTITY_TYPE_ID,
    attributes: [],
  };

  trackedEntityAttributes.forEach((attr) => {
    tei.attributes.push({
      attribute: attr.id,
      value: convertValueBack(attr.valueType, teiData[attr.id]),
    });
  });

  return tei;
};

export const updateMetadataValueSet = (selectedMetadata, optionValue, prop, propValue) => {
  if (!selectedMetadata || !selectedMetadata.valueSet) return;

  const indexOfOption = selectedMetadata.valueSet.findIndex((option) => option.value === optionValue);
  if (indexOfOption !== -1) {
    selectedMetadata.valueSet[indexOfOption][prop] = propValue;
  }
};

export const getFullName = (data) =>
  `${data["PIGLwIaw0wy"] || ""} ${data["WC0cShCpae8"] || ""} ${data["IENWcinF8lM"] || ""}`;
