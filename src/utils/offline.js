import { metadataApi } from "@/api";
import {
  MEMBER_PROGRAM_ID,
  HOUSEHOLD_PROGRAM_ID,
} from "@/constants/app-config";
import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import db from "@/indexDB/db";

export const getMetadataSet = (isOfflineMode) => {
  if (isOfflineMode) {
    return [
      programManager.getProgramById(HOUSEHOLD_PROGRAM_ID),
      organisationUnitManager.getAllOrganisationUnits(),
      meManager.getMe(),
      organisationUnitLevelsManager.getAllOrganisationUnitLevels(),
      programManager.getProgramById(MEMBER_PROGRAM_ID),
      organisationUnitManager.getUserOrgs(),
    ];
  } else {
    return [
      metadataApi.getProgramMetadata(HOUSEHOLD_PROGRAM_ID),
      metadataApi.get(`/api/organisationUnits`, {}, [
        "paging=false&fields=id,code,path,displayName,level,parent,translations",
      ]),
      metadataApi.getMe(),
      metadataApi.getOrgUnitLevels(),
      metadataApi.getProgramMetadata(MEMBER_PROGRAM_ID),
      metadataApi.getUserOrgUnits(),
    ];
  }
};

// MEMBER_PROGRAM_ID

export const findOffline = (TABLE_NAME) =>
  db[TABLE_NAME].where("isOnline").anyOf(0).toArray();

export const findChangedData = () =>
  Promise.all([
    findOffline("enrollment"),
    findOffline("event"),
    findOffline("trackedEntity"),
  ]);
