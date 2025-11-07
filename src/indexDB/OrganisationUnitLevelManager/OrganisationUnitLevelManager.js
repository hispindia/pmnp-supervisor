import db from "../db";
import { metadataApi } from "@/api";
import { TABLE_NAME } from ".";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();
    const orgLevels = await metadataApi.getOrgUnitLevels();

    if (orgLevels && orgLevels.organisationUnitLevels.length > 0) {
      await addOrganisationUnitLevels(orgLevels.organisationUnitLevels);
    }
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const addOrganisationUnitLevels = async (orgUnits) => {
  try {
    await db[TABLE_NAME].bulkPut(orgUnits);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const getOrganisationUnitLevelById = async (id) => {
  try {
    const orgs = await db[TABLE_NAME].get({ id });

    return orgs;
  } catch (error) {
    console.error(`Failed to get org`, error);
  }
};

export const getAllOrganisationUnitLevels = async () => {
  try {
    const orgLevels = await db[TABLE_NAME].toArray();

    return { organisationUnitLevels: orgLevels };
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};
