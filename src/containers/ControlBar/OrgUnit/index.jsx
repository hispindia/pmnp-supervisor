import React, { useEffect, useMemo } from "react";

/* REDUX */
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOrgUnit } from "../../../redux/actions/metadata";
/*       */
import OrgUnit from "../../../components/ControlBar/OrgUnit";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const OrgUnitContainer = ({ singleSelection = true, limit }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { selectedOrgUnit, orgUnits } = useSelector((state) => state.metadata);

  const buttonLabel = useMemo(() => {
    if (singleSelection || !orgUnits || !selectedOrgUnit.selected.length) return selectedOrgUnit ? <b>{selectedOrgUnit.displayName} </b> : t("select");
    return selectedOrgUnit.selected
      .map((path) => orgUnits.find((ou) => ou.id === path.split("/").pop()))
      .map(({ displayName }) => displayName || "")
      .join(", ");
  }, [selectedOrgUnit, orgUnits]);

  const handleSelectOrgUnit = (orgUnit) => {
    const selectedOrgUnit = {
      ...orgUnit,
      level: orgUnit.path.split("/").filter(Boolean).length,
    };

    dispatch(setSelectedOrgUnit(selectedOrgUnit));
    sessionStorage.setItem("selectedOrgUnit", JSON.stringify(orgUnit));
    history.push("/list");
  };

  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  return (
    <OrgUnit
      limit={limit}
      singleSelection={singleSelection}
      orgUnitSelectorFilter={orgUnits}
      orgUnitLabel={t("enrollingVillage")}
      handleSelectOrgUnit={handleSelectOrgUnit}
      onVisibleChange={onVisibleChange}
      buttonLabel={buttonLabel}
      selectedOrgUnit={selectedOrgUnit}
    />
  );
};

export default OrgUnitContainer;
