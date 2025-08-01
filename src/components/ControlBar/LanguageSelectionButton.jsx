import { baseApi } from "@/api";
import { LOCALE_CODES, LOCALE_LABELS } from "@/constants/app-config";
import { Select } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelectionButton = () => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState();
  return (
    <Select
      size="small"
      loading={loading}
      className="[&_.ant-select-selector]:!rounded-full min-w-[110px]"
      value={i18n.language}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      onChange={async (value) => {
        setLoading(true);
        await baseApi.purePush("/api/userSettings/keyDbLocale", value);
        localStorage.removeItem("optionSets");
        window.location.reload();
      }}
    >
      {Object.values(LOCALE_CODES).map((code) => (
        <Select.Option value={code}>{LOCALE_LABELS[code]}</Select.Option>
      ))}
    </Select>
  );
};

export default LanguageSelectionButton;
