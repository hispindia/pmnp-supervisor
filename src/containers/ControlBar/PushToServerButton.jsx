import { pushToServer, resetCurrentOfflineLoading } from "@/redux/actions/common";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import PushModal, { pushMapping } from "./PushModal";
import { findChangedData } from "./OfflineModeButton";
import { toDhis2Enrollments } from "@/indexDB/data/enrollment";
import { toDhis2Events } from "@/indexDB/data/event";
import { toDhis2TrackedEntities } from "@/indexDB/data/trackedEntity";

const PushToServerButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [pushData, setPushData] = useState(pushMapping.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {}));

  const handleCancelPush = () => {
    setPushModalOpen(false);
  };

  const handlePushClose = () => {
    setPushModalOpen(false);
  };

  const handlePush = async () => {
    if (Object.values(pushData).find(Boolean)) dispatch(pushToServer());
  };

  return (
    <>
      <PushModal pushData={pushData} open={pushModalOpen} onCancel={handleCancelPush} onClose={handlePushClose} onOk={handlePush} />
      <Button
        onClick={async () => {
          const results = await findChangedData();
          const found = results.find((r) => r.length > 0);
          if (!found) return;

          const enrs = toDhis2Enrollments(results[0]);
          const events = toDhis2Events(results[1]);
          const teis = toDhis2TrackedEntities(results[2]);
          setPushData({ enr: enrs.length, event: events.length, tei: teis.length });

          dispatch(resetCurrentOfflineLoading());
          setPushModalOpen(true);
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
