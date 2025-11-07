import React, { useMemo } from "react";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import AddNewFamilyButton from "../../components/ControlBar/AddNewFamilyButton";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { makeStyles } from "@material-ui/core/styles";

const AddNewFamilyButtonContainer = () => {
  const { programMetadata, selectedOrgUnit } = useSelector((state) => state.metadata);
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const isAssignedToOrg = useMemo(() => {
    return programMetadata?.organisationUnits?.find((e) => e.id == selectedOrgUnit.id);
  }, [selectedOrgUnit]);

  const disabled = location.pathname === "/form" || !isAssignedToOrg;
  const onClick = () => {
    history.replace(`/form`);
  };
  return (
    <AddNewFamilyButton isAssignedToOrg={isAssignedToOrg} onClick={onClick} disabled={disabled}>
      {t("addNewFamily")}
    </AddNewFamilyButton>
  );
};

export default withOrgUnitRequired()(AddNewFamilyButtonContainer);
