export const TABLE_NAME = "trackedEntity";
export const TABLE_FIELDS =
  "++id, trackedEntity, updatedAt, orgUnit, trackedEntityType, isDeleted, isOnline, attribute, valueType, displayName, value";

export * from "./TrackedEntityManager";
