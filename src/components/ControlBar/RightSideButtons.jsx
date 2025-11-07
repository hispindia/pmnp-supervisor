import OfflineModeButton from "@/containers/ControlBar/OfflineModeButton";
import PushToServerButton from "@/containers/ControlBar/PushToServerButton";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import { Button } from "antd";
import { useLocation } from "react-router";
import styles from "./ControlBar.module.css";
import LanguageSelectionButton from "./LanguageSelectionButton";
import manifest from "../../../manifest.webapp.json";

const { exitBtn, helpBtn, barContainer } = styles;

const RightSideButtons = ({ onClickHelp, onClickExit, helpLabel, exitLabel }) => {

  const location = useLocation();
  const shouldShowExit = location.pathname !== "/form";

  return (
    <div className={barContainer}>
      <div className="d-none d-lg-block">
        {/* <OfflineModeButton />
        <PushToServerButton /> */}
        <LanguageSelectionButton />
        <div className="d-flex align-items-center">
          <span className="text-muted font-medium">v{manifest.version}</span>
        </div>
      </div>
       {shouldShowExit ? (
      <>
       {/* {helpLabel ? (
           <div className={helpBtn}>
               <Tooltip title={helpLabel} placement="left">
               <IconButton size="small">
                <HelpIcon onClick={onClickHelp} />
                 </IconButton>
                 </Tooltip>
                </div>
         ) : null}  */}

          <div className={exitBtn}>
            <Button
              variant="contained"
              color="default"
              // disableElevation
              onClick={onClickExit}
            >
              {exitLabel}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default RightSideButtons;
