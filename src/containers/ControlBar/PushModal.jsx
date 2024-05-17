import { Modal, Typography, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { setOfflineStatus } from "@/redux/actions/common";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const pushMapping = [
  { id: "tei", label: "Push tracked entities" },
  { id: "enr", label: "Push enrollments" },
  { id: "event", label: "Push events" },
];

const PushModal = ({ open, onCancel, onOk, onClose, pushData }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentOfflineLoading } = useSelector((state) => state.common);

  useEffect(() => {
    if (
      open &&
      currentOfflineLoading.id === pushMapping[pushMapping.length - 1].id &&
      currentOfflineLoading.percent >= 100
    ) {
      // Dont dispatch this action here because Pushing data might occur some errors
      // dispatch(setOfflineStatus(false));
      onClose();
    }
  }, [open && currentOfflineLoading.id, currentOfflineLoading.percent]);

  return (
    <Modal
      title={t("pushChangedData")}
      open={open}
      centered
      closeIcon={null}
      maskClosable={false}
      onCancel={onCancel}
      onOk={onOk}
      okText={t("push")}
    >
      {pushMapping.map(({ label, id }, step) => {
        const currentStep = pushMapping.findIndex(
          ({ id }) => id === currentOfflineLoading.id
        );

        let percent = 0;
        if (currentStep > -1) {
          if (currentStep > step) percent = 100;
          if (currentStep === step) percent = currentOfflineLoading.percent;
        }

        return (
          Boolean(pushData[id]) && (
            <div key={label}>
              <Typography>
                {label} ({pushData[id]})
              </Typography>
              <Progress percent={percent} />
            </div>
          )
        );
      })}
      <div style={{ marginBottom: 24 }}></div>
    </Modal>
  );
};

export default PushModal;
