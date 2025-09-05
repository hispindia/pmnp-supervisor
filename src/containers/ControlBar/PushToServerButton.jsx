import { toDhis2Enrollments } from "@/indexDB/data/enrollment";
import { toDhis2Events } from "@/indexDB/data/event";
import { toDhis2TrackedEntities } from "@/indexDB/data/trackedEntity"; // Import the color from Ant Design
import { resetCurrentOfflineLoading, setCurrentOfflineLoading, setOfflineStatus } from "@/redux/actions/common";
import { findChangedData } from "@/utils/offline";
import { blue } from "@ant-design/colors";
import { UploadOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";

import ExcelImportButton from "./ExcelImportButton";
import PushModal, { pushMapping } from "./PushModal";
import { useExcel } from "./useExcel";

const handlePushResult = async (result, message) => {
  if (result?.length > 0 && result.status != "OK") {
    if (result.some((result) => result.status != "OK")) {
      const errors = [];

      for (let i = 0; i < result.length; i++) {
        try {
          const error = await result[i].json();
          errors.push(error);
        } catch (err) {}
      }

      const errorMessages = errors.map((error) =>
        error.validationReport.errorReports.map((errorReport) => errorReport.message).join("\n"),
      );

      console.log({ errorMessages });

      throw new Error(message + "\n" + errorMessages.join("\n"));
    }
  }
};

const showingCurrentOfflineLoading = ({ dispatch, id, percent }) => {
  dispatch(setCurrentOfflineLoading({ id, percent }));
};

const handlePushToServer = async (dispatch) => {
  try {
    // Check internet connection
    if (!navigator.onLine) {
      throw new Error("No internet connection!");
    }

    /**
     * push data to server by order
     */
    // push tracked entities
    const teiPushResults = await trackedEntityManager.push((progress) =>
      showingCurrentOfflineLoading({ dispatch, ...progress }),
    );
    await handlePushResult(teiPushResults, "Sync tracked entities failed: ");

    // push enrollments
    const enrPushResults = await enrollmentManager.push((progress) =>
      showingCurrentOfflineLoading({ dispatch, ...progress }),
    );
    await handlePushResult(enrPushResults, "Sync enrollments failed: ");

    // push events
    const eventPushRetuls = await eventManager.push((progress) =>
      showingCurrentOfflineLoading({ dispatch, ...progress }),
    );
    await handlePushResult(eventPushRetuls, "Sync events failed: ");

    // wait for 3 second to show 100% progress bar
    await new Promise((resolve) => setTimeout(resolve, 3000));
    dispatch(setOfflineStatus(false));
  } catch (error) {
    notification.warning({
      message: "Warning",
      description: error ? error.message : "Sync data to server failed!",
      placement: "bottomRight",
      duration: 0,
    });

    console.table(error);
  } finally {
    console.log("handlePushToServer - finally");
  }
};

const PushToServerButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { exportExcel } = useExcel();

  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [pushData, setPushData] = useState(pushMapping.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {}));

  const handleCancelPush = () => {
    setPushModalOpen(false);
  };

  const handlePushClose = () => {
    setPushModalOpen(false);
  };

  const handlePush = async () => {
    if (Object.values(pushData).find(Boolean)) {
      await handlePushToServer(dispatch);
    }
  };

  return (
    <>
      <PushModal
        pushData={pushData}
        open={pushModalOpen}
        onCancel={handleCancelPush}
        onClose={handlePushClose}
        onOk={handlePush}
      />
      <Button
        onClick={async () => {
          const results = await findChangedData();
          const found = results.find((r) => r.length > 0);
          if (!found) {
            notification.info({
              message: "No data to sync",
              description: "There is no data to sync to the server",
              placement: "bottomRight",
              duration: 5,
            });
            return;
          }

          const enrs = toDhis2Enrollments(results[0]);
          const events = toDhis2Events(results[1]);
          const teis = toDhis2TrackedEntities(results[2]);
          setPushData({
            enr: enrs.length,
            event: events.length,
            tei: teis.length,
          });

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
        {t("sync")}
      </Button>
      <Button
        onClick={exportExcel}
        style={{
          marginRight: "10px",
          backgroundColor: blue[5],
        }}
        shape="round"
        size="small"
        type="primary"
        icon={<UploadOutlined />}
      >
        {t("exportExcel")}
      </Button>

      <ExcelImportButton />
    </>
  );
};

export default PushToServerButton;
