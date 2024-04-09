import db from "./db";
import { metadataApi } from "@/api";

export const TABLE_FIELDS =
  "id, lastUpdated, created, name, displayName, externalAccess, surname, lastCheckedInterpretations, firstName, favorite, access, userCredentials, sharing, settings, favorites, teiSearchOrganisationUnits, translations, organisationUnits, dataViewOrganisationUnits, userGroupAccesses, attributeValues, userGroups, userAccesses, authorities, programs, dataSets";
const TABLE_NAME = "me";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();

    const me = await metadataApi.getMe();

    if (me) {
      await addMe([me]); // `me` data need to be an array
    }
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const addMe = async (me) => {
  try {
    await db[TABLE_NAME].bulkPut(me);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const getMe = async () => {
  try {
    const me = await db[TABLE_NAME].toArray();

    return me?.length ? me[0] : null;
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};
