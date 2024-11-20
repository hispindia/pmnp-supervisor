import { useTranslation } from "react-i18next";
import RightSideButtons from "../../components/ControlBar/RightSideButtons";

const RightSideButtonsContainer = ({ className }) => {
  const { t } = useTranslation();
  const onClickHelp = () => {
    window.open("./FamilyInformationManual.pdf", "_blank");
  };

  const onClickExit = () => {
    window.location.href = `/${window.location.pathname.replace(
      /^\/([^\/]*).*$/,
      "$1"
    )}`;
  };
  return (
    <RightSideButtons
      onClickHelp={onClickHelp}
      onClickExit={onClickExit}
      helpLabel={t("help")}
      exitLabel={t("exit")}
    />
  );
};

export default RightSideButtonsContainer;
