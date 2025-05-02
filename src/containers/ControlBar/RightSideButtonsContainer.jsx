import { useTranslation } from "react-i18next";
import RightSideButtons from "../../components/ControlBar/RightSideButtons";

const RightSideButtonsContainer = ({ className }) => {
  const { t } = useTranslation();

  const onClickExit = () => {
    window.location.href = `/${window.location.pathname.replace(/^\/([^\/]*).*$/, "$1")}`;
  };

  return <RightSideButtons onClickExit={onClickExit} exitLabel={t("exit")} />;
};

export default RightSideButtonsContainer;
