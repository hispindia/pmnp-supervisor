import { Switch, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { setOfflineStatus } from "@/redux/actions/common";
import { useIsPwa } from "../../hooks";
import PrepareOfflineModal from "./PrepareOfflineModal";
import { findChangedData } from "@/utils/offline";

const { VITE_MODE } = import.meta.env;

const OfflineModeButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isPwa = useIsPwa();

  const { offlineStatus } = useSelector((state) => state.common);

  const [prepareModalOpen, setPrepareModalOpen] = useState(false);

  const handleCancelOffline = () => {
    setPrepareModalOpen(false);
    dispatch(setOfflineStatus(false));
  };

  const handleOfflineClose = () => {
    setPrepareModalOpen(false);
  };

  return (
    <>
      <PrepareOfflineModal
        open={prepareModalOpen}
        onCancel={handleCancelOffline}
        onClose={handleOfflineClose}
      />
      <Switch
        checkedChildren={t("offline")}
        unCheckedChildren={t("online")}
        checked={offlineStatus}
        onChange={async (checked) => {
          if (checked && !isPwa && VITE_MODE === "production") {
            notification.warning({
              message: t("warning"),
              description: t("pleaseInstallApp"),
              placement: "bottomRight",
              duration: 10,
            });
            return;
          }

          if (checked) return setPrepareModalOpen(true);

          const results = await findChangedData();

          const found = results.find((r) => r.length > 0);
          if (!found) return dispatch(setOfflineStatus(false));

          notification.warning({
            message: t("warning"),
            description: t("pleasePushChangedData"),
            placement: "bottomRight",
            duration: 10,
          });
        }}
        style={{
          marginRight: "10px",
        }}
      />
    </>
  );
};

export default OfflineModeButton;
