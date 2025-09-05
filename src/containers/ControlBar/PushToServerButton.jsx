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
import { useSelector } from "react-redux";

const handlePushResult = async (result, message, metadataMapping) => {
  if (result?.length > 0 && result.status != "OK") {
    if (result.some((result) => result.status != "OK")) {
      const errors = [];

      for (let i = 0; i < result.length; i++) {
        try {
          const error = await result[i].json();
          errors.push(error);
        } catch (err) {}
      }

      const checkDuplicateMapping = {};

      const errorMessages = errors
        .map((error) => {
          return error.validationReport.errorReports
            .map((errorReport) => {
              let message = errorReport.message;
              const uid = errorReport.uid || message;
              const mapKey = errorReport.message + " " + uid;

              // Check if this error message already exists
              if (checkDuplicateMapping[mapKey]) {
                return ""; // Return empty string for duplicates
              }

              // Mark this message as seen
              checkDuplicateMapping[mapKey] = true;

              // Find UUIDs (11 character alphanumeric strings) and replace with display names
              if (metadataMapping) {
                // Regex to match 11-character alphanumeric strings (DHIS2 UIDs)
                const uuidRegex = /\b[A-Za-z0-9]{11}\b/g;
                message = message.replace(uuidRegex, (match) => {
                  // If we have a mapping for this UUID, replace it with the display name
                  return `<b>${metadataMapping[match]}</b> (${match})` || match;
                });
              }

              return message;
            })
            .filter((msg) => msg !== "") // Filter out empty strings
            .join("\n");
        })
        .filter((msg) => msg !== ""); // Filter out empty error message groups

      throw new Error(message + "\n" + errorMessages.join("\n"));
    }
  }
};

const showingCurrentOfflineLoading = ({ dispatch, id, percent }) => {
  dispatch(setCurrentOfflineLoading({ id, percent }));
};

const handlePushToServer = async (dispatch, metadataMapping, setError) => {
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
    await handlePushResult(teiPushResults, "Sync tracked entities failed: ", metadataMapping);

    // push enrollments
    const enrPushResults = await enrollmentManager.push((progress) =>
      showingCurrentOfflineLoading({ dispatch, ...progress }),
    );
    await handlePushResult(enrPushResults, "Sync enrollments failed: ", metadataMapping);

    // push events
    const eventPushRetuls = await eventManager.push((progress) =>
      showingCurrentOfflineLoading({ dispatch, ...progress }),
    );
    await handlePushResult(eventPushRetuls, "Sync events failed: ", metadataMapping);

    // wait for 3 second to show 100% progress bar
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // dispatch(setOfflineStatus(false));
  } catch (error) {
    setError(error ? error.message : "Sync data to server failed!");
    console.table(error);
  } finally {
    console.log("handlePushToServer - finally");
  }
};

const getProgramMetadataNameMapping = ({ programMetadata, programMetadataMember, locale }) => {
  const mapping = {};

  // Helper function to get translated display name
  const getTranslatedDisplayName = (item, locale) => {
    if (!item.translations || !Array.isArray(item.translations) || !locale) {
      return item.displayName;
    }

    // First try to find FORM_NAME translation for the locale
    const formNameTranslation = item.translations.find((t) => t.locale === locale && t.property === "FORM_NAME");
    if (formNameTranslation && formNameTranslation.value) {
      return formNameTranslation.value;
    }

    // If no FORM_NAME, try NAME translation for the locale
    const nameTranslation = item.translations.find((t) => t.locale === locale && t.property === "NAME");
    if (nameTranslation && nameTranslation.value) {
      return nameTranslation.value;
    }

    // Fallback to original displayName
    return item.displayName;
  };

  // Helper function to process a single program metadata
  const processProgram = (program) => {
    if (!program) return;

    // Process trackedEntityAttributes
    if (program.trackedEntityAttributes) {
      program.trackedEntityAttributes.forEach((attr) => {
        mapping[attr.id] = getTranslatedDisplayName(attr, locale);
      });
    }

    // Process programStages and their dataElements
    if (program.programStages) {
      program.programStages.forEach((stage) => {
        if (stage.dataElements) {
          stage.dataElements.forEach((dataElement) => {
            mapping[dataElement.id] = getTranslatedDisplayName(dataElement, locale);
          });
        }
      });
    }
  };

  // Process both program metadata objects
  processProgram(programMetadata);
  processProgram(programMetadataMember);

  return mapping;
};

const PushToServerButton = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { exportExcel } = useExcel();
  const { programMetadata, programMetadataMember } = useSelector((state) => state.metadata);

  const programMetadataNameMapping = getProgramMetadataNameMapping({
    programMetadata,
    programMetadataMember,
    locale: i18n.language,
  });

  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [pushData, setPushData] = useState(pushMapping.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {}));
  const [syncError, setSyncError] = useState(null);

  const handleCancelPush = () => {
    setPushModalOpen(false);
    setSyncError(null);
  };

  const handlePushClose = () => {
    setPushModalOpen(false);
    setSyncError(null);
  };

  const handlePush = async () => {
    if (Object.values(pushData).find(Boolean)) {
      setSyncError(null); // Clear any previous errors
      await handlePushToServer(dispatch, programMetadataNameMapping, setSyncError);
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
        syncError={syncError}
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
