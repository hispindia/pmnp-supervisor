import { setSelectedOrgUnit } from "@/redux/actions/metadata";
import { filter } from "@/redux/actions/teis";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, notification } from "antd";
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
  const { importExcel } = useExcel();
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
      await importExcel(fileList);

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
