import _ from "lodash";

const toDhis2Tei = (trackedEntity, teiData, enrs = []) => {
  let attributes = [];

  teiData.map((e) => {
    attributes.push({
      attribute: e.attribute,
      value: e.value,
      valueType: e.valueType,
      displayName: e.displayName,
    });
  });

  let { isOnline, orgUnit, isDeleted, trackedEntityType, updatedAt } =
    teiData[0];

  return {
    trackedEntity,
    trackedEntityType,
    enrollments: enrs,
    updatedAt,
    isOnline: isOnline,
    orgUnit: orgUnit,
    deleted: isDeleted,
    attributes,
  };
};

export const toDhis2TrackedEntities = (teis) => {
  if (!teis) return [];
  let resTEIS = _.groupBy(teis, "trackedEntity");

  return Object.entries(resTEIS).map(([trackedEntity, teiData]) =>
    toDhis2Tei(trackedEntity, teiData)
  );
};

export const toDhis2TrackedEntity = (tei, enrs = []) => {
  if (!tei) return null;
  let resTEIS = _.groupBy(tei, "trackedEntity");

  const formatedTei = Object.entries(resTEIS).map(([uid, teiData]) => {
    return toDhis2Tei(uid, teiData, enrs);
  });

  return formatedTei[0];
};
