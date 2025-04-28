import { Checkbox } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

const MultipleTrueOnlyDEs = ({ valueSet, locale, disabled, changeValue, formData, onBlur = () => {}, ...props }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState([]);

  const handleChange = (newValue) => {
    if (newValue) {
      valueSet.forEach((option) => {
        const found = newValue.find((value) => value.trueOnlyDeId === option.trueOnlyDeId);
        if (found) {
          changeValue(option.trueOnlyDeId, "true");
        } else {
          changeValue(option.trueOnlyDeId, null);
        }
      });
    }

    onBlur && onBlur(null);
    setValue(newValue);
  };

  const renderValue = (props) => {
    if (props.index === value.length - 1) return props.data.label;
    return props.data.label + ", ";
  };

  const options = valueSet.map((e) => {
    e.label = locale ? (locale != "en" ? e.translations[locale] : e.label) : e.label;
    return e;
  });

  const valueStr = valueSet.map((v) => formData[v.trueOnlyDeId]).join(",");
  useEffect(() => {
    setValue(valueSet.filter((v) => formData[v.trueOnlyDeId]));
  }, [valueStr]);

  return (
    <Select
      isMulti
      value={value}
      isDisabled={disabled}
      isClearable={true}
      options={options}
      isSearchable={false}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      placeholder={value ? value : t("select")}
      components={{ MultiValue: renderValue, Option: CustomOption }}
      onChange={handleChange}
      styles={{
        control: (provided) => ({
          ...provided,
          height: 40,
        }),
        option: (provided, { isSelected }) => ({
          ...provided,
          ...(isSelected && { backgroundColor: "var(--primary)" }),
        }),
        valueContainer: (provided) => ({
          ...provided,
          whiteSpace: "nowrap",
          width: 100,
          overflow: "hidden",
          textOverflow: "ellipsis",
          flexWrap: "nowrap",
          height: 40,
          display: "flex",
          alignItems: "center",
        }),
      }}
      {...props}
    />
  );
};
const CustomOption = ({ children, ...props }) => {
  const { innerRef, innerProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        ...innerProps.style,
        display: "flex",
        alignItems: "center",
        padding: "8px",
        paddingTop: 0,
        cursor: "pointer",
      }}
    >
      <Checkbox checked={props.isSelected} />
      <span style={{ marginLeft: 8 }}>{children}</span>
    </div>
  );
};

export default MultipleTrueOnlyDEs;
