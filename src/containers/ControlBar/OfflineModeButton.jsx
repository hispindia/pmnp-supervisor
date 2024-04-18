import { useState } from "react";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import PrepareOfflineModal from "./PrepareOfflineModal";
import {
  setOfflineLoadingStatus,
  setOfflineStatus,
} from "@/redux/actions/common";

const downloadMapping = [
  { id: "metadata", label: "Download metadata" },
  { id: "tei", label: "Download tracked entities" },
  { id: "enr", label: "Download enrollments" },
  { id: "event", label: "Download events" },
];

const OfflineModeButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { offlineStatus } = useSelector((state) => state.common);

  const [prepareModalOpen, setPrepareModalOpen] = useState(false);

  const handleCancelOffline = () => {
    setPrepareModalOpen(false);
    dispatch(setOfflineStatus(false));
  };

  const handleClose = () => {
    setPrepareModalOpen(false);
  };

  return (
    <>
      <PrepareOfflineModal
        downloadMapping={downloadMapping}
        open={prepareModalOpen}
        onCancel={handleCancelOffline}
        onClose={handleClose}
      />
      <Switch
        checkedChildren={t("offline")}
        unCheckedChildren={t("online")}
        checked={offlineStatus}
        onChange={(checked) => {
          if (checked) {
            dispatch(setOfflineLoadingStatus(true));
            setPrepareModalOpen(true);
          } else {
            dispatch(setOfflineStatus(false));
          }
        }}
        style={{
          marginRight: "10px",
        }}
      />
    </>
  );
};

export default OfflineModeButton;
