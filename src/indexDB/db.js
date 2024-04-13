// db.js
import Dexie from "dexie";

import * as me from "./MeManager";
import * as organisationUnit from "./OrganisationUnitManager";
import * as organisationsUnitLevel from "./OrganisationUnitLevelManager";
import * as enrollment from "./EnrollmentManager";
import * as trackedEntity from "./TrackedEntityManager";
import * as program from "./ProgramManager";
import * as optionSet from "./OptionSetManager";
import * as event from "./EventManager";

export const db = new Dexie("FI_Offline");
db.version(1).stores({
  [me.TABLE_NAME]: me.TABLE_FIELDS,
  // organisationsPath: 'id, path', // Primary key and indexed props
  [organisationUnit.TABLE_NAME]: organisationUnit.TABLE_FIELDS,
  [organisationsUnitLevel.TABLE_NAME]: organisationsUnitLevel.TABLE_FIELDS,
  [enrollment.TABLE_NAME]: enrollment.TABLE_FIELDS,
  [trackedEntity.TABLE_NAME]: trackedEntity.TABLE_FIELDS,
  [program.TABLE_NAME]: program.TABLE_FIELDS,
  [optionSet.TABLE_NAME]: optionSet.TABLE_FIELDS,
  [event.TABLE_NAME]: event.TABLE_FIELDS,
});

export default db;
