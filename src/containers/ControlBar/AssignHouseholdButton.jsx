import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setSelectedOrgUnit } from "@/redux/actions/metadata";
import { useDispatch, useSelector } from "react-redux";
import { filter } from "@/redux/actions/teis";
import ReportButton from "../../components/ControlBar/ReportButton";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";

const AssignHouseholdButtonContainer = () => {
  const { t } = useTranslation();
  const { selectedOrgUnit } = useSelector((state) => state.metadata);
  const dispatch = useDispatch();
  const history = useHistory();
  
  return (
    <ReportButton
      variant="contained"
      color="primary"
      onClick={() => {
        if (history.location.pathname === "/assign") {
          dispatch(setSelectedOrgUnit({ ...selectedOrgUnit }));
          dispatch(filter([]));
          // window.location.reload();
        }

        history.replace(`/assign`);
      }}
    >
      {t("list")}
    </ReportButton>
  );
};

export default withOrgUnitRequired()(AssignHouseholdButtonContainer);
