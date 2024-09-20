import { toDhis2Enrollments } from "@/indexDB/data/enrollment";
import { toDhis2Events } from "@/indexDB/data/event";
import { toDhis2TrackedEntities } from "@/indexDB/data/trackedEntity"; // Import the color from Ant Design
import { blue } from "@ant-design/colors";
import {
  pushToServer,
  resetCurrentOfflineLoading,
} from "@/redux/actions/common";
import { UploadOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { findChangedData } from "./OfflineModeButton";
import PushModal, { pushMapping } from "./PushModal";

const PushToServerButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentDateTime = new Date().toLocaleString();

  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [pushData, setPushData] = useState(
    pushMapping.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {})
  );

  const handleCancelPush = () => {
    setPushModalOpen(false);
  };

  const handlePushClose = () => {
    setPushModalOpen(false);
  };

  const handlePush = async () => {
    if (Object.values(pushData).find(Boolean)) dispatch(pushToServer());
  };

  const handleExportExcel = async () => {
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

    // console.log({ enrs: results[0], events: results[1], teis: results[2] });
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
              message: "No data to push",
              description: "There is no data to push to the server",
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
        {t("push")}
      </Button>
      <Button
        onClick={handleExportExcel}
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
    </>
  );
};

export default PushToServerButton;
