import { toDhis2Enrollments } from "@/indexDB/data/enrollment";
import { toDhis2Events } from "@/indexDB/data/event";
import { toDhis2TrackedEntities } from "@/indexDB/data/trackedEntity";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as importFileManager from "@/indexDB/ImportFileManager/ImportFileManager";
import { findChangedData } from "@/utils/offline";
import { notification } from "antd";
import * as XLSX from "xlsx";
import { useUser } from "@/hooks/useUser";
import { useSelector } from "react-redux";
import packageJson from "../../../package.json";
import manifestJson from "../../../manifest.webapp.json";

const sheetNames = ["Events", "Enrollments", "Tracked Entities"];

export const useExcel = () => {
  const { user } = useUser();
  const { selectedOrgUnit } = useSelector((state) => state.metadata);

  const importExcel = async (fileList, progressCallback = null) => {
    try {
      // Clear all tables before importing
      await trackedEntityManager.clearTable();
      await enrollmentManager.clearTable();
      await eventManager.clearTable();
      await importFileManager.clearTable();

      notification.info({
        message: "Import Started",
        description: `Starting import of ${fileList.length} file(s)`,
        placement: "bottomRight",
        duration: 3,
      });

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        console.log(`Processing file ${i + 1}/${fileList.length}: ${file.name}`);

        // Create import file record with just fileName
        await importFileManager.createImportFile({
          fileName: file.name,
        });

        // Report progress for current file
        if (progressCallback) {
          progressCallback({
            currentFile: i + 1,
            totalFiles: fileList.length,
            fileName: file.name,
            status: "processing",
          });
        }

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" }); // TEIs
        const teiSheetName = workbook.SheetNames[2];
        const teiSheet = workbook.Sheets[teiSheetName];

        if (sheetNames.includes(teiSheetName) && teiSheet) {
          const teisData = toDhis2TrackedEntities(XLSX.utils.sheet_to_json(teiSheet));

          await trackedEntityManager.setTrackedEntityInstances({
            trackedEntities: teisData,
          });
        }

        // ENROLLMENTS
        const enrSheetName = workbook.SheetNames[1];
        const enrSheet = workbook.Sheets[enrSheetName];

        if (sheetNames.includes(enrSheetName) && enrSheet) {
          const enrsData = toDhis2Enrollments(XLSX.utils.sheet_to_json(enrSheet));

          // Import enrollments using setEnrollment from EnrollmentManager
          for (const enrollment of enrsData) {
            await enrollmentManager.setEnrollment({
              enrollment,
              program: enrollment.program,
            });
          }
        }

        // EVENTS
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        if (sheetNames.includes(sheetName) && sheet) {
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          const eventsData = toDhis2Events(jsonData);
          await eventManager.setEvents({ events: eventsData });
        }

        // Report progress for completed file
        if (progressCallback) {
          progressCallback({
            currentFile: i + 1,
            totalFiles: fileList.length,
            fileName: file.name,
            status: "completed",
          });
        }
      }

      // Report final completion
      if (progressCallback) {
        progressCallback({
          currentFile: fileList.length,
          totalFiles: fileList.length,
          fileName: "",
          status: "finished",
        });
      }

      notification.success({
        message: "Import Completed",
        description: `Successfully imported ${fileList.length} file(s)`,
        placement: "bottomRight",
        duration: 5,
      });
    } catch (error) {
      console.error("Error importing Excel files:", error);
      notification.error({
        message: "Import Failed",
        description: `Error importing files: ${error.message}`,
        placement: "bottomRight",
        duration: 5,
      });
    }
  };

  const exportExcel = async () => {
    const currentDateTime = new Date().toLocaleString();
    const results = await findChangedData();
    const found = results.find((r) => r.length > 0);
    if (!found) {
      notification.info({
        message: "No data to export",
        description: "There is no data to export to Excel",
        placement: "bottomRight",
        duration: 5,
      });
      return;
    }

    const [enrs, events, teis] = results;

    // Prepare data for Excel
    const workbook = XLSX.utils.book_new();

    // Add events sheet
    const eventsSheet = XLSX.utils.json_to_sheet(events);
    XLSX.utils.book_append_sheet(workbook, eventsSheet, "Events");

    // Add enrollments sheet
    const enrollmentsSheet = XLSX.utils.json_to_sheet(enrs);
    XLSX.utils.book_append_sheet(workbook, enrollmentsSheet, "Enrollments");

    // Add tracked entities sheet
    const teisSheet = XLSX.utils.json_to_sheet(teis);
    XLSX.utils.book_append_sheet(workbook, teisSheet, "Tracked Entities");

    // Add UserInfo sheet first
    const userInfo = [
      { Property: "User Agent", Value: navigator.userAgent },
      { Property: "App Version (Package)", Value: packageJson.version },
      { Property: "App Version (Manifest)", Value: manifestJson.version },
      { Property: "Export Date/Time", Value: currentDateTime },
      { Property: "Username", Value: user?.displayName || user?.name || "Unknown-User" },
      { Property: "Organization Unit", Value: selectedOrgUnit?.displayName || "Unknown-OrgUnit" },
    ];
    const userInfoSheet = XLSX.utils.json_to_sheet(userInfo);
    XLSX.utils.book_append_sheet(workbook, userInfoSheet, "UserInfo");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create download link and trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(data);

    // Create filename with organization unit and username
    const orgUnitName = selectedOrgUnit?.displayName || "Unknown-OrgUnit";
    const username = user?.displayName || user?.name || "Unknown-User";
    const sanitizedOrgUnit = orgUnitName.replace(/[^a-zA-Z0-9]/g, "-");
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, "-");

    link.download = `OfflineData-${sanitizedOrgUnit}-${sanitizedUsername}-${currentDateTime}.xlsx`;
    link.click();

    notification.success({
      message: "Export successful",
      description: "Data has been exported to Excel",
      placement: "bottomRight",
      duration: 5,
    });
  };

  const autoExportExcel = async () => {
    // get user local folder path
    const exportPath = dialog.showOpenDialog({ properties: ["openDirectory"] });

    // const exportPath =
  };

  return { exportExcel, importExcel, autoExportExcel };
};
