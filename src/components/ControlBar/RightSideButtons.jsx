import OfflineModeButton from "@/containers/ControlBar/OfflineModeButton";
import PushToServerButton from "@/containers/ControlBar/PushToServerButton";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import styles from "./ControlBar.module.css";
import { Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import { LOCALE_CODES, LOCALE_LABELS } from "@/constants/app-config";
import { baseApi } from "@/api";
import { useState } from "react";

const { exitBtn, helpBtn, barContainer } = styles;

const RightSideButtons = ({ onClickHelp, onClickExit, helpLabel, exitLabel }) => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState();
  const shouldShowExit = location.pathname !== "/form";

  return (
    <div className={barContainer}>
      <div className="d-none d-lg-block">
        <OfflineModeButton />
        <PushToServerButton />
        <Select
          size="small"
          loading={loading}
          className="[&_.ant-select-selector]:!rounded-full min-w-[110px]"
          value={i18n.language}
          onChange={async (value) => {
            setLoading(true);
            await baseApi.purePush("/api/userSettings/keyDbLocale", value);
            window.location.reload();
          }}
        >
          {Object.values(LOCALE_CODES).map((code) => (
            <Select.Option value={code}>{LOCALE_LABELS[code]}</Select.Option>
          ))}
        </Select>
      </div>
      {shouldShowExit ? (
        <>
          {helpLabel ? (
            <div className={helpBtn}>
              <Tooltip title={helpLabel} placement="left">
                <IconButton size="small">
                  <HelpIcon onClick={onClickHelp} />
                </IconButton>
              </Tooltip>
            </div>
          ) : null}

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
