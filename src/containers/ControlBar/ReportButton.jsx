import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReportButton from "../../components/ControlBar/ReportButton";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";

const ReportButtonContainer = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { offlineStatus } = useSelector((state) => state.common);
  const { selectedOrgUnit } = useSelector((state) => state.metadata);

  if (offlineStatus) {
    return null;
  }

  return (
    <ReportButton
      variant="contained"
      color="primary"
      // disableElevation
      // onClick={() => {
      //   history.replace(`/report`);
      // }}
      href={`../../../dhis-web-reports/index.html#/standard-report/view/zDH0OW4JKEi?ou=${selectedOrgUnit.id}`}
      target={'_blank'}
    >
      {t("report")}
    </ReportButton>
  );
};

export default withOrgUnitRequired()(ReportButtonContainer);
