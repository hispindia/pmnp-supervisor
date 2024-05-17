import React, { useState, useEffect } from "react";
import { CustomDataProvider } from "@dhis2/app-runtime";
import { OrganisationUnitTree } from "@dhis2/ui";
import { useSelector } from "react-redux";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";
import useApi from "../../hooks/useApi.js";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";

const OrgUnitSelector = ({ singleSelection, limit, selectedOrgUnit, handleSelectOrgUnit, filter }) => {
  const { metadataApi } = useApi();
  const { offlineStatus } = useSelector((state) => state.common);
  const { orgUnits } = useSelector((state) => state.metadata);
  const [orgUnitData, setOrgUnitData] = useState(null);

  useEffect(() => {
    if (orgUnits) {
      if (offlineStatus) {
        organisationUnitManager.getOrgUnitSelectorData({ orgUnits, filter }).then((json) => {
          setOrgUnitData(json);
        });
      } else {
        metadataApi.getOrgUnitSelectorData({ orgUnits, filter }).then((json) => {
          setOrgUnitData(json);
        });
      }
    }
  }, [orgUnits]);

  const foundSelectedOrgUnit = orgUnitData ? orgUnitData.tree[`organisationUnits/${selectedOrgUnit}`] : "";
  let transformedSelectedOrgUnit = null;
  if (foundSelectedOrgUnit) {
    if (orgUnitData.roots.includes(selectedOrgUnit)) {
      transformedSelectedOrgUnit = ["/" + foundSelectedOrgUnit.id];
    } else {
      transformedSelectedOrgUnit = [foundSelectedOrgUnit.path];
    }
  }

  return orgUnitData ? (
    <CustomDataProvider data={orgUnitData.tree}>
      <OrganisationUnitTree
        initiallyExpanded={transformedSelectedOrgUnit ? transformedSelectedOrgUnit : orgUnitData.roots}
        roots={orgUnitData.roots}
        singleSelection={singleSelection}
        selected={selectedOrgUnit ? selectedOrgUnit.selected : []}
        onChange={(selected) => {
          //singleSelection mode or multiple but not limit
          if (singleSelection || !limit) handleSelectOrgUnit(selected);
          //multiple mode with limit
          if (selected.selected.length <= limit) handleSelectOrgUnit(selected);
        }}
      />
    </CustomDataProvider>
  ) : (
    <LoadingMask />
  );
};

export default OrgUnitSelector;
