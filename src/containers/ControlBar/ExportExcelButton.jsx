import React from "react";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { blue } from "@ant-design/colors";
import { useTranslation } from "react-i18next";
import { useExcel } from "./useExcel";

const ExportExcelButton = () => {
  const { t } = useTranslation();
  const { exportExcel } = useExcel();

  return (
    <Button
      onClick={() => {
        if (exportExcel) {
          exportExcel();
        }
      }}
      style={{
        backgroundColor: blue[5],
      }}
      size="small"
      type="primary"
      icon={<UploadOutlined />}
    >
      {t("exportExcel")}
    </Button>
  );
};

export default ExportExcelButton;
