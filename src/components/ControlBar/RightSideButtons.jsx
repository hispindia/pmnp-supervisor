import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from "@material-ui/icons/Help";
import { Button } from "antd";
import styles from "./ControlBar.module.css";
import { useLocation } from "react-router";
import OfflineModeButton from "@/containers/ControlBar/OfflineModeButton";
import PushToServerButton from "@/containers/ControlBar/PushToServerButton";

const { exitBtn, helpBtn, barContainer } = styles;

const RightSideButtons = ({
  onClickHelp,
  onClickExit,
  helpLabel,
  exitLabel,
}) => {
  const location = useLocation();
  const shouldShowExit = location.pathname !== "/form";

  return (
    <div className={barContainer}>
      <OfflineModeButton />
      <PushToServerButton />

      {shouldShowExit ? (
        <>
          <div className={helpBtn}>
            <Tooltip title={helpLabel} placement="left">
              <IconButton size="small">
                <HelpIcon onClick={onClickHelp} />
              </IconButton>
            </Tooltip>
          </div>
          {/*<div className={completeBtn} id="complete-button"></div>*/}
          {/* <div className={closeBtn} id="close-button"></div> */}
          <div className={exitBtn}>
            <Button
              variant="contained"
              color="default"
              disableElevation
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
