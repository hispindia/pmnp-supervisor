import { useTranslation } from "react-i18next";
import Select from "react-select";

const customStyles = {
  control: (provided) => ({
    ...provided,
    maxWidth: 20, // Adjust as needed
    overflow: "hidden",
  }),
  option: (provided) => ({
    ...provided,
    maxWidth: 20, // Adjust as needed
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  }),
};

const SelectField = ({
  valueSet,
  value,
  handleChange,
  handleBlur,
  locale,
  disabled,
  isSearchable = false,
  ...props
}) => {
  const { t } = useTranslation();

  const options = valueSet.map((e) => {
    if (!locale || locale === "en" || !e.translations) return e;
    const found = e.translations.find((t) => t.locale === locale && t.property === "FORM_NAME");
    if (!found) return e;
    return { ...e, label: found.value };
  });

  return (
    <Select
      value={value}
      isDisabled={disabled}
      isClearable={true}
      options={options}
      placeholder={value ? value : t("select")}
      onChange={(selected) => {
        if (!selected) {
          handleChange("");
          handleBlur && handleBlur("");
          return;
        }
        handleChange(selected.value);
        handleBlur && handleBlur(selected.value);
      }}
      isSearchable={isSearchable}
      styles={{
        control: (provided, state) => {
          return {
            ...provided,
            // how to show full selected text
            height: 40,
            whiteSpace: "pre-wrap",
          };
        },
        singleValue: (provided, state) => ({
          ...provided,
          ...(state.data.color && {
            backgroundColor: state.data.color,
            borderRadius: "4px",
            padding: "0 4px",
            color: "#000",
          }),
        }),
        option: (provided, state) => ({
          ...provided,
          ...(state.data.color && {
            backgroundColor: state.data.color,
            color: "#000",
          }),
        }),
        cursor: "pointer",
        // textOverflow: "ellipsis",
        // overflow: "hidden",
        // whiteSpace: "nowrap",
      }}
    />
  );
};

export default SelectField;
