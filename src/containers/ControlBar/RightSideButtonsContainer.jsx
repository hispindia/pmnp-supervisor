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

    // <div className={barContainer}>
    //     <div className={helpBtn}>
    //         <Tooltip title={t("help")} placement="left">
    //             <IconButton size="small">
    //                 <HelpIcon
    //                     onClick={}
    //                 />
    //             </IconButton>
    //         </Tooltip>
    //     </div>
    //     {/*<div className={completeBtn} id="complete-button"></div>*/}
    //     {/* <div className={closeBtn} id="close-button"></div> */}
    //     <div className={exitBtn}>
    //         <Button
    //             variant="contained"
    //             color="default"
    //             disableElevation
    //             onClick={}
    //         >
    //             {t("exit")}
    //         </Button>
    //     </div>
    // </div>
  );
};

export default RightSideButtonsContainer;
