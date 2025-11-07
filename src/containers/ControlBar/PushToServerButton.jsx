import { toDhis2Enrollments } from "@/indexDB/data/enrollment";
import { toDhis2Events } from "@/indexDB/data/event";
import { toDhis2TrackedEntities } from "@/indexDB/data/trackedEntity"; // Import the color from Ant Design
import { resetCurrentOfflineLoading, setCurrentOfflineLoading } from "@/redux/actions/common";
import { findChangedData } from "@/utils/offline";
import { UploadOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as ImportFileManager from "@/indexDB/ImportFileManager/ImportFileManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";

import { useSelector } from "react-redux";
import ExcelImportButton from "./ExcelImportButton";
import PushModal, { pushMapping } from "./PushModal";

const handlePushResult = async (result, metadataMapping) => {
  if (result?.length > 0 && result.status != "OK") {
    if (result.some((result) => result.status != "OK")) {
      const errors = [];

      for (let i = 0; i < result.length; i++) {
        try {
          const error = await result[i].json();
          errors.push(error);
        } catch (err) {}
      }

      // Get all import files to map UIDs to filenames
      const importFiles = await ImportFileManager.findAll();
      console.log("Import files for error mapping:", importFiles);

      const checkDuplicateMapping = {};
      const errorsByFile = {};

      // Process all errors and group by file
      for (const error of errors) {
        for (const errorReport of error.validationReport.errorReports) {
          let message = errorReport.message;
          const uid = errorReport.uid || message;
          const mapKey = errorReport.message + " " + uid;

          // Check if this error message already exists
          if (checkDuplicateMapping[mapKey]) {
            continue; // Skip duplicates
          }

          // Mark this message as seen
          checkDuplicateMapping[mapKey] = true;

          // Find UUIDs (11 character alphanumeric strings) and replace with display names
          if (metadataMapping) {
            // Regex to match 11-character alphanumeric strings (DHIS2 UIDs)
            const uuidRegex = /\b[A-Za-z0-9]{11}\b/g;
            message = message.replace(uuidRegex, (match) => {
              // If we have a mapping for this UUID, replace it with the display name
              return metadataMapping[match] ? `<b>${metadataMapping[match]}</b> (${match})` : `<b>${match}</b>`;
            });
          }

          // Determine which file this error belongs to
          let belongsToFile = "Unknown File";

          if (uid && uid.length === 11) {
            // Check which import file contains this UID
            for (const importFile of importFiles) {
              if (importFile.uids && importFile.uids.includes(uid)) {
                belongsToFile = importFile.fileName;
                break;
              }
            }
          }

          // Group errors by file
          if (!errorsByFile[belongsToFile]) {
            errorsByFile[belongsToFile] = [];
          }
          errorsByFile[belongsToFile].push(message);
        }
      }

      console.log("Errors grouped by file:", errorsByFile);

      // Return errorsByFile object instead of formatted string
      return errorsByFile;
    }
  }

  // Return empty object if no errors
  return {};
};

const showingCurrentOfflineLoading = ({ dispatch, id, percent }) => {
  dispatch(setCurrentOfflineLoading({ id, percent }));
};

const handlePushToServer = async (dispatch, metadataMapping, setError, setSyncCompleted) => {
  const allErrors = [];
  const combinedErrorsByFile = {};

  try {
    // Check internet connection
    if (!navigator.onLine) {
      throw new Error("No internet connection!");
    }

    /**
     * push data to server by order
     */
    // push tracked entities
    try {
      const teiPushResults = await trackedEntityManager.push((progress) =>
        showingCurrentOfflineLoading({ dispatch, ...progress }),
      );
      const teiErrorsByFile = await handlePushResult(teiPushResults, metadataMapping);
      if (Object.keys(teiErrorsByFile).length > 0) {
        // Merge errors by file
        Object.keys(teiErrorsByFile).forEach((fileName) => {
          if (!combinedErrorsByFile[fileName]) {
            combinedErrorsByFile[fileName] = [];
          }
          combinedErrorsByFile[fileName].push(...teiErrorsByFile[fileName]);
        });
      }
    } catch (error) {
      allErrors.push(`Sync tracked entities failed: ${error.message}`);
    }

    // push enrollments
    try {
      const enrPushResults = await enrollmentManager.push((progress) =>
        showingCurrentOfflineLoading({ dispatch, ...progress }),
      );
      const enrErrorsByFile = await handlePushResult(enrPushResults, metadataMapping);
      if (Object.keys(enrErrorsByFile).length > 0) {
        // Merge errors by file
        Object.keys(enrErrorsByFile).forEach((fileName) => {
          if (!combinedErrorsByFile[fileName]) {
            combinedErrorsByFile[fileName] = [];
          }
          combinedErrorsByFile[fileName].push(...enrErrorsByFile[fileName]);
        });
      }
    } catch (error) {
      allErrors.push(`Sync enrollments failed: ${error.message}`);
    }

    // push events
    try {
      const eventPushRetuls = await eventManager.push((progress) =>
        showingCurrentOfflineLoading({ dispatch, ...progress }),
      );
      const eventErrorsByFile = await handlePushResult(eventPushRetuls, metadataMapping);
      if (Object.keys(eventErrorsByFile).length > 0) {
        // Merge errors by file
        Object.keys(eventErrorsByFile).forEach((fileName) => {
          if (!combinedErrorsByFile[fileName]) {
            combinedErrorsByFile[fileName] = [];
          }
          combinedErrorsByFile[fileName].push(...eventErrorsByFile[fileName]);
        });
      }
    } catch (error) {
      allErrors.push(`Sync events failed: ${error.message}`);
    }

    // Combine file-based errors and general errors
    let finalErrorMessage = "";

    // Add file-based errors
    if (Object.keys(combinedErrorsByFile).length > 0) {
      const fileErrorMessages = Object.keys(combinedErrorsByFile).map((fileName) => {
        const fileErrors = combinedErrorsByFile[fileName];
        return `<b>${fileName}:</b>\n${fileErrors.join("\n")}`;
      });
      finalErrorMessage += fileErrorMessages.join("\n\n");
    }

    // Add general errors
    if (allErrors.length > 0) {
      if (finalErrorMessage) finalErrorMessage += "\n\n";
      finalErrorMessage += `<b>General Errors:</b>\n${allErrors.join("\n")}`;
    }

    // If there are any errors, display them all
    if (finalErrorMessage) {
      setError(finalErrorMessage);
    }

    // dispatch(setOfflineStatus(false));
  } catch (error) {
    // Only catch critical errors like network connection
    setError(error ? error.message : "Sync data to server failed!");
    console.table(error);
  } finally {
    console.log("handlePushToServer - finally");
    setSyncCompleted(true);
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
  const { programMetadata, programMetadataMember } = useSelector((state) => state.metadata);

  const programMetadataNameMapping = getProgramMetadataNameMapping({
    programMetadata,
    programMetadataMember,
    locale: i18n.language,
  });

  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [pushData, setPushData] = useState(pushMapping.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {}));
  const [syncError, setSyncError] = useState(null);
  const [syncCompleted, setSyncCompleted] = useState(false);

  const handleCancelPush = () => {
    setPushModalOpen(false);
    setSyncError(null);
    setSyncCompleted(false);
  };

  const handlePushClose = () => {
    setPushModalOpen(false);
    setSyncError(null);
    setSyncCompleted(false);
  };

  const handlePush = async () => {
    if (Object.values(pushData).find(Boolean)) {
      setSyncError(null); // Clear any previous errors
      await handlePushToServer(dispatch, programMetadataNameMapping, setSyncError, setSyncCompleted);
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
        syncCompleted={syncCompleted}
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

      <ExcelImportButton />
    </>
  );
};

export default PushToServerButton;
