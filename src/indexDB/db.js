// db.js
import Dexie from "dexie";

import * as organisationUnit from "./OrganisationUnitManager";
import * as organisationsUnitLevel from "./OrganisationUnitLevelManager";
import * as me from "./MeManager";
import * as enrollment from "./EnrollmentManager";
import * as trackedEntity from "./TrackedEntityInstanceManager";
import * as program from "./ProgramManager";
import * as optionSet from "./OptionSetManager";
import * as event from "./EventManager";

export const db = new Dexie("FI_Offline");
db.version(1).stores({
  me: me.TABLE_FIELDS,
  // organisationsPath: 'id, path', // Primary key and indexed props
  [organisationUnit.TABLE_NAME]: organisationUnit.TABLE_FIELDS,
  [organisationsUnitLevel.TABLE_NAME]: organisationsUnitLevel.TABLE_FIELDS,
  [enrollment.TABLE_NAME]: enrollment.TABLE_FIELDS,
  // [trackedEntity.TABLE_NAME]: trackedEntity.TABLE_FIELDS,
  trackedEntity:
    "++id, trackedEntity, updatedAt, orgUnit, trackedEntityType, isDeleted, isOnline, attribute, valueType, displayName, value",
  [program.TABLE_NAME]: program.TABLE_FIELDS,
  [optionSet.TABLE_NAME]: optionSet.TABLE_FIELDS,
  [event.TABLE_NAME]: event.TABLE_FIELDS,
});

// This only have id,path -> use as input of OrgUnitComponent -> the rest info will be fetched inside the component
export async function addOrgsPath(orgs) {
  try {
    await db.organisationsPath.bulkPut(orgs);
    // orgs.forEach(async (org) => {

    // });
  } catch (error) {
    console.error(`Failed to add org path`, error);
  }
}

export default db;
