import React from "react";
import { useTranslation } from "react-i18next";
import ReportButton from "../../components/ControlBar/ReportButton";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import { useHistory } from "react-router-dom";

const ReportButtonContainer = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <ReportButton
      variant="contained"
      color="primary"
      // disableElevation
      onClick={() => {
        history.replace(`/report`);
      }}
    >
      {t("report")}
    </ReportButton>
  );
};

export default withOrgUnitRequired()(ReportButtonContainer);
