import { pushToServer } from "@/redux/actions/common";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PrepareOfflineModal from "./PrepareOfflineModal";

const PushToServerButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [prepareModalOpen, setPrepareModalOpen] = useState(false);

  const handleCancelOffline = () => {
    setPrepareModalOpen(false);
  };

  const handleClose = () => {
    setPrepareModalOpen(false);
  };

  return (
    <>
      <PrepareOfflineModal
        open={prepareModalOpen}
        onCancel={handleCancelOffline}
        onClose={handleClose}
      />

      <Button
        onClick={() => {
          dispatch(pushToServer());
          setPrepareModalOpen(true);
        }}
        style={{
          marginRight: "10px",
          backgroundColor: "green",
        }}
        shape="round"
        size="small"
        type="primary"
        icon={<UploadOutlined />}
      >
        {t("push")}
      </Button>
    </>
  );
};

export default PushToServerButton;
