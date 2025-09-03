import { Modal, Progress, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const pushMapping = [
  { id: "tei", label: "Sync tracked entities" },
  { id: "enr", label: "Sync enrollments" },
  { id: "event", label: "Sync events" },
];

// Constants
const SYNC_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes in milliseconds
const STORAGE_KEY = "syncTime";

const PushModal = ({ open, onCancel, onOk, onClose, pushData }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentOfflineLoading } = useSelector((state) => state.common);

  // Countdown state and ref
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const intervalRef = useRef(null);

  // Check if sync is on cooldown
  const checkSyncCooldown = () => {
    const lastSyncTime = sessionStorage.getItem(STORAGE_KEY);
    if (!lastSyncTime) {
      return { isOnCooldown: false, remainingTime: 0 };
    }

    const lastSyncTimestamp = parseInt(lastSyncTime, 10);
    const currentTime = Date.now();
    const timeDifference = currentTime - lastSyncTimestamp;

    if (timeDifference >= SYNC_COOLDOWN_MS) {
      // Cooldown period has passed
      sessionStorage.removeItem(STORAGE_KEY);
      return { isOnCooldown: false, remainingTime: 0 };
    } else {
      // Still on cooldown
      const remainingTime = Math.ceil((SYNC_COOLDOWN_MS - timeDifference) / 1000);
      return { isOnCooldown: true, remainingTime };
    }
  };

  // Initialize countdown based on sessionStorage
  useEffect(() => {
    if (open) {
      const { isOnCooldown, remainingTime } = checkSyncCooldown();

      if (isOnCooldown) {
        setIsDisabled(true);
        setCountdown(remainingTime);

        // Start countdown
        intervalRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setIsDisabled(false);
              sessionStorage.removeItem(STORAGE_KEY);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setIsDisabled(false);
        setCountdown(0);
      }
    }

    // Cleanup interval when modal closes or component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [open]);

  // Format countdown display
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Generate button text
  const getButtonText = () => {
    if (isDisabled && countdown > 0) {
      return `${t("sync")} (${formatCountdown(countdown)})`;
    }
    return t("sync");
  };

  // Handle sync button click
  const handleSyncClick = () => {
    // Store current timestamp when sync is clicked
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString());

    // Start cooldown immediately
    setIsDisabled(true);
    setCountdown(120); // 2 minutes = 120 seconds

    // Start countdown
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsDisabled(false);
          sessionStorage.removeItem(STORAGE_KEY);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Call the original onOk function
    if (onOk) {
      onOk();
    }
  };

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
      title={t("syncChangedData")}
      open={open}
      centered
      closeIcon={null}
      maskClosable={false}
      onCancel={onCancel}
      onOk={handleSyncClick}
      okText={getButtonText()}
      okButtonProps={{ disabled: isDisabled }}
    >
      {pushMapping.map(({ label, id }, step) => {
        const currentStep = pushMapping.findIndex(({ id }) => id === currentOfflineLoading.id);

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
