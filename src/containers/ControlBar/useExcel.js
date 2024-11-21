import { toDhis2Enrollments } from "@/indexDB/data/enrollment";
import { toDhis2Events } from "@/indexDB/data/event";
import { toDhis2TrackedEntities } from "@/indexDB/data/trackedEntity";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import { findChangedData } from "@/utils/offline";
import { notification } from "antd";
import * as XLSX from "xlsx";

const sheetNames = ["Events", "Enrollments", "Tracked Entities"];

export const useExcel = () => {
  const importExcel = async (fileList) => {
    for (let i = 0; i < fileList.length; i++) {
      const data = await fileList[i].arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      // TEIs
      const teiSheetName = workbook.SheetNames[2];
      const teiSheet = workbook.Sheets[teiSheetName];

      // ENROLLMENTS
      const enrSheetName = workbook.SheetNames[1];
      const enrSheet = workbook.Sheets[enrSheetName];

      if (
        sheetNames.includes(teiSheetName) &&
        teiSheet &&
        sheetNames.includes(enrSheetName) &&
        enrSheet
      ) {
        const teisData = toDhis2TrackedEntities(
          XLSX.utils.sheet_to_json(teiSheet)
        );
        const enrsData = toDhis2Enrollments(XLSX.utils.sheet_to_json(enrSheet));

        teisData.forEach((tei) => {
          const enr = enrsData.find(
            (enr) => enr.trackedEntity === tei.trackedEntity
          );

          if (enr) {
            tei.enrollments = [enr];
          }
        });

        await trackedEntityManager.setTrackedEntityInstances({
          trackedEntities: teisData,
        });
      }

      // EVENTS
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      if (sheetNames.includes(sheetName) && sheet) {
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const eventsData = toDhis2Events(jsonData);
        await eventManager.setEvents({ events: eventsData });
      }
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
    link.download = `OfflineData-${currentDateTime}.xlsx`;
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
    console.log({ exportPath });

    // const exportPath =
  };

  return { exportExcel, importExcel, autoExportExcel };
};
