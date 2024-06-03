import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setSelectedOrgUnit } from "@/redux/actions/metadata";
import { useDispatch, useSelector } from "react-redux";
import { filter } from "@/redux/actions/teis";
import ReportButton from "../../components/ControlBar/ReportButton";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";

const ListButtonContainer = () => {
  const { t } = useTranslation();
  const { selectedOrgUnit } = useSelector((state) => state.metadata);
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <ReportButton
      variant="contained"
      color="primary"
      onClick={() => {
        if (history.location.pathname === "/list") {
          dispatch(setSelectedOrgUnit({ ...selectedOrgUnit }));
          dispatch(filter([]));
          // window.location.reload();
        }

        history.replace(`/list`);
      }}
    >
      {t("list")}
    </ReportButton>
  );
};

export default withOrgUnitRequired()(ListButtonContainer);
