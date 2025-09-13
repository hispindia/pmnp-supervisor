import { useUser } from "@/hooks/useUser";
import { gold } from "@ant-design/colors";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ImportModal from "./ImportModal";

const ExcelImportButton = () => {
  const { t } = useTranslation();
  const { isSuperuser } = useUser();
  const { offlineStatus } = useSelector((state) => state.common);
  const [isOpen, setIsOpen] = useState(false);

  if (!offlineStatus && !isSuperuser) {
    return null;
  }

  return (
    <>
      <ImportModal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
      />

      <Button
        onClick={() => setIsOpen(true)}
        style={{
          marginRight: "10px",
          marginTop: "10px",
          backgroundColor: gold[5],
        }}
        shape="round"
        size="small"
        type="primary"
        icon={<UploadOutlined />}
      >
        {t("importExcel")}
      </Button>
    </>
  );
};

export default ExcelImportButton;
