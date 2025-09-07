import { Modal, Progress, Typography } from "antd";
import { useSelector } from "react-redux";

import { useUser } from "@/hooks/useUser";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ExportExcelButton from "./ExportExcelButton";

export const pushMapping = [
  { id: "tei", label: "Sync tracked entities" },
  { id: "enr", label: "Sync enrollments" },
  { id: "event", label: "Sync events" },
];

// Constants
const SYNC_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes in milliseconds
const STORAGE_KEY = "syncTime";

const PushModal = ({ open, onCancel, onOk, onClose, pushData, syncError }) => {
  const { isSuperuser } = useUser();
  const { t } = useTranslation();
  const { currentOfflineLoading } = useSelector((state) => state.common);

  // Individual progress tracking for each operation
  const [individualProgress, setIndividualProgress] = useState({
    tei: 0,
    enr: 0,
    event: 0,
  });

  // Countdown state and ref
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const intervalRef = useRef(null);

  // Update individual progress when currentOfflineLoading changes
  useEffect(() => {
    if (currentOfflineLoading.id && currentOfflineLoading.percent !== undefined) {
      setIndividualProgress((prev) => ({
        ...prev,
        [currentOfflineLoading.id]: currentOfflineLoading.percent,
      }));
    }
  }, [currentOfflineLoading]);

  // Reset progress when modal opens
  useEffect(() => {
    if (open) {
      setIndividualProgress({
        tei: 0,
        enr: 0,
        event: 0,
      });
    }
  }, [open]);

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
    if (open) {
      // Check if all operations with data are complete
      const allComplete = pushMapping.every(({ id }) => {
        // If there's no data for this operation, consider it complete
        if (!pushData[id]) return true;
        // If there's data, check if progress is 100%
        return individualProgress[id] === 100;
      });

      if (allComplete && Object.values(pushData).some(Boolean)) {
        // All operations with data are complete
        // Don't auto-close here because there might be errors to display
        // onClose();
      }
    }
  }, [open, individualProgress, pushData]);

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
      okButtonProps={{ disabled: isDisabled && !isSuperuser }}
    >
      {pushMapping.map(({ label, id }, step) => {
        // Use individual progress for each operation
        const percent = individualProgress[id] || 0;

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

      {/* Export Excel button - shown above sync errors when there are errors */}

      {syncError ? (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Typography.Title level={5} type="danger" style={{ marginBottom: 8 }}>
            {t("syncError", "Sync Error")}: <ExportExcelButton />
          </Typography.Title>

          <div
            style={{
              maxHeight: "50vh",
              overflowY: "auto",
              padding: 12,
              backgroundColor: "#fff2f0",
              border: "1px solid #ffccc7",
              borderRadius: 6,
              whiteSpace: "pre-wrap",
              fontSize: 12,
              fontFamily: "monospace",
            }}
            dangerouslySetInnerHTML={{
              __html: syncError,
            }}
          />
        </div>
      ) : null}

      <div style={{ marginBottom: 24 }}></div>
    </Modal>
  );
};

export default PushModal;
