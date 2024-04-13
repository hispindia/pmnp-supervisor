import { metadataApi } from "@/api";
import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";

export const getMetadataSet = (isOfflineMode) => {
  if (isOfflineMode) {
    return [
      programManager.getProgramById("L0EgY4EomHv"),
      organisationUnitManager.getAllOrganisationUnits(),
      meManager.getMe(),
      organisationUnitLevelsManager.getAllOrganisationUnitLevels(),
      programManager.getProgramById("xvzrp56zKvI"),
      organisationUnitManager.getUserOrgs(),
    ];
  } else {
    return [
      metadataApi.getProgramMetadata("L0EgY4EomHv"),
      metadataApi.get(`/api/organisationUnits`, {}, [
        "filter=level:in:[1,2,3,4]&paging=false&fields=id,code,path,displayName,level,parent,translations",
      ]),
      metadataApi.getMe(),
      metadataApi.getOrgUnitLevels(),
      metadataApi.getProgramMetadata("xvzrp56zKvI"),
      metadataApi.getUserOrgUnits(),
    ];
  }
};
