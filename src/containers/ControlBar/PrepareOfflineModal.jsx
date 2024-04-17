import { Modal, Typography, Flex, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { setOfflineStatus } from "@/redux/actions/common";
import { useEffect } from "react";

const downloadMapping = [
  { id: "metadata", label: "Download metadata" },
  { id: "tei", label: "Download tracked entities" },
  { id: "enr", label: "Download enrollments" },
  { id: "event", label: "Download events" },
];

const PrepareOfflineModal = ({ open, onCancel, onClose }) => {
  const { currentOfflineLoading } = useSelector((state) => state.common);

  useEffect(() => {
    if (currentOfflineLoading.id === downloadMapping[downloadMapping.length - 1].id && currentOfflineLoading.percent >= 100) {
      onClose();
    }
  }, [currentOfflineLoading.id, currentOfflineLoading.percent]);

  return (
    <Modal
      title="Preparing for offline mode"
      open={open}
      centered
      closeIcon={null}
      maskClosable={false}
      onCancel={onCancel}
      okButtonProps={{ style: { display: "none" } }}
    >
      {downloadMapping.map(({ label }, step) => {
        const currentStep = downloadMapping.findIndex(({ id }) => id === currentOfflineLoading.id);

        let percent = 0;
        if (currentStep > -1) {
          if (currentStep > step) percent = 100;
          if (currentStep === step) percent = currentOfflineLoading.percent;
        }

        return (
          <div>
            <Typography>{label}</Typography>
            <Progress percent={percent} />
          </div>
        );
      })}
    </Modal>
  );
};

export default PrepareOfflineModal;
