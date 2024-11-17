import { toDhis2Enrollments } from "@/indexDB/data/enrollment";
import { toDhis2Events } from "@/indexDB/data/event";
import { toDhis2TrackedEntities } from "@/indexDB/data/trackedEntity";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as XLSX from "xlsx";
import { setSelectedOrgUnit } from "@/redux/actions/metadata";
import { filter } from "@/redux/actions/teis";

const sheetNames = ["Events", "Enrollments", "Tracked Entities"];

const ImportModal = ({ open, onCancel, onOk, onClose, pushData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [fileList, setFileList] = useState([]);
  const { selectedOrgUnit } = useSelector((state) => state.metadata);

  const handleCancel = () => {
    setFileList([]);
    onCancel && onCancel();
  };

  const handleUpload = async () => {
    onOk && onOk();

    if (fileList.length === 0) {
      notification.warning({
        message: t("warning"),
        description: t("noImportFileSelected"),
        placement: "bottomRight",
        duration: 10,
      });
      return;
    }

    try {
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
          const enrsData = toDhis2Enrollments(
            XLSX.utils.sheet_to_json(enrSheet)
          );

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

      setFileList([]);

      if (history.location.pathname === "/list") {
        dispatch(setSelectedOrgUnit({ ...selectedOrgUnit }));
        dispatch(filter([]));
      }

      history.replace(`/list`);

      notification.success({
        message: t("success"),
        description: t("importSuccess"),
        placement: "bottomRight",
        duration: 10,
      });
    } catch (error) {
      notification.warning({
        message: t("warning"),
        description: `${t("somethingWentWrong")} : ${error.message}`,
        placement: "bottomRight",
        duration: 10,
      });
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
    accept: ".xlsx",
  };

  return (
    <Modal
      title={t("Import Excel")}
      open={open}
      centered
      closeIcon={null}
      maskClosable={false}
      onCancel={handleCancel}
      onOk={handleUpload}
      okText={t("import")}
      okButtonProps={{ disabled: fileList.length === 0 }}
    >
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      <div style={{ marginBottom: 24 }}></div>
    </Modal>
  );
};

export default ImportModal;
