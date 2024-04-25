import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReportButton from "../../components/ControlBar/ReportButton";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";

const ReportButtonContainer = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { offlineStatus } = useSelector((state) => state.common);

  if (offlineStatus) {
    return null;
  }

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
