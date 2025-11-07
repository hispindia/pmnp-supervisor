import { setSelectedOrgUnit } from "@/redux/actions/metadata";
import { filter } from "@/redux/actions/teis";
import { CheckCircleOutlined, LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, List, Modal, notification, Progress, Upload } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useExcel } from "./useExcel";

const ImportModal = ({ open, onCancel, onOk, onClose, pushData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [fileList, setFileList] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    currentFile: 0,
    totalFiles: 0,
    fileName: "",
    status: "idle", // 'idle', 'processing', 'completed', 'finished'
    processedFiles: [],
  });
  const { importExcel } = useExcel();
  const { selectedOrgUnit } = useSelector((state) => state.metadata);

  const handleCancel = () => {
    if (!importing) {
      setFileList([]);
      setImportProgress({
        currentFile: 0,
        totalFiles: 0,
        fileName: "",
        status: "idle",
        processedFiles: [],
      });
      onCancel && onCancel();
    }
  };

  const handleProgressUpdate = (progress) => {
    setImportProgress((prev) => {
      const newProcessedFiles = [...prev.processedFiles];

      if (progress.status === "completed") {
        // Add or update the completed file
        const existingIndex = newProcessedFiles.findIndex((f) => f.name === progress.fileName);
        if (existingIndex >= 0) {
          newProcessedFiles[existingIndex] = { name: progress.fileName, status: "completed" };
        } else {
          newProcessedFiles.push({ name: progress.fileName, status: "completed" });
        }
      } else if (progress.status === "processing") {
        // Add or update the processing file
        const existingIndex = newProcessedFiles.findIndex((f) => f.name === progress.fileName);
        if (existingIndex >= 0) {
          newProcessedFiles[existingIndex] = { name: progress.fileName, status: "processing" };
        } else {
          newProcessedFiles.push({ name: progress.fileName, status: "processing" });
        }
      }

      return {
        ...prev,
        currentFile: progress.currentFile,
        totalFiles: progress.totalFiles,
        fileName: progress.fileName,
        status: progress.status,
        processedFiles: newProcessedFiles,
      };
    });
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      notification.warning({
        message: t("warning"),
        description: t("noImportFileSelected"),
        placement: "bottomRight",
        duration: 10,
      });
      return;
    }

    setImporting(true);
    setImportProgress({
      currentFile: 0,
      totalFiles: fileList.length,
      fileName: "",
      status: "processing",
      processedFiles: [],
    });

    try {
      await importExcel(fileList, handleProgressUpdate);

      // Don't clear fileList immediately, keep it for display
      setImporting(false);
      setImportProgress((prev) => ({ ...prev, status: "finished" }));

      if (history.location.pathname === "/assign") {
        dispatch(setSelectedOrgUnit({ ...selectedOrgUnit }));
        dispatch(filter([]));
      }

      history.replace(`/assign`);
    } catch (error) {
      setImporting(false);
      setImportProgress((prev) => ({ ...prev, status: "error" }));
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
      if (importing) return false; // Prevent removal during import
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      if (importing) return false; // Prevent adding files during import
      setFileList((prevFileList) => [...prevFileList, file]);
      return false;
    },
    fileList,
    accept: ".xlsx",
    disabled: importing,
    multiple: true, // Enable multiple file selection
  };

  const getFileIcon = (fileName) => {
    const processedFile = importProgress.processedFiles.find((f) => f.name === fileName);
    if (processedFile?.status === "completed") {
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    } else if (processedFile?.status === "processing") {
      return <LoadingOutlined style={{ color: "#1890ff" }} />;
    }
    return null;
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
      okText={
        importing
          ? t("importing") || "Importing..."
          : importProgress.status === "finished"
            ? "Import Again"
            : t("import")
      }
      okButtonProps={{
        disabled: (fileList.length === 0 && importProgress.status !== "finished") || importing,
        loading: importing,
      }}
      cancelButtonProps={{ disabled: importing }}
    >
      <Upload {...props}>
        <Button icon={<UploadOutlined />} disabled={importing}>
          Select Files
        </Button>
      </Upload>

      {(importing || importProgress.status === "finished") && (
        <div style={{ marginTop: 16 }}>
          <Progress
            percent={Math.round((importProgress.currentFile / importProgress.totalFiles) * 100)}
            status={
              importProgress.status === "error"
                ? "exception"
                : importProgress.status === "finished"
                  ? "success"
                  : "active"
            }
            format={() => `${importProgress.currentFile}/${importProgress.totalFiles}`}
          />

          {importProgress.status === "processing" && importProgress.fileName && (
            <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>Processing: {importProgress.fileName}</div>
          )}

          {importProgress.status === "finished" && (
            <div style={{ marginTop: 8, fontSize: "12px", color: "#52c41a", fontWeight: "bold" }}>
              ✅ Import completed successfully!
            </div>
          )}

          {importProgress.processedFiles.length > 0 && (
            <List
              size="small"
              style={{ marginTop: 16, maxHeight: 150, overflow: "auto" }}
              dataSource={importProgress.processedFiles}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {getFileIcon(item.name)}
                    <span style={{ fontSize: "12px" }}>{item.name}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: item.status === "completed" ? "#52c41a" : "#1890ff",
                        marginLeft: "auto",
                      }}
                    >
                      {item.status === "completed" ? "Completed" : "Processing..."}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      )}

      <div style={{ marginBottom: 24 }}></div>
    </Modal>
  );
};

export default ImportModal;
