import React from "react";
import { Input, Radio, Checkbox, DatePicker, Select } from "antd";
import moment from "moment";
import "./index.css";
const { TextArea } = Input;
const { Option } = Select;

const InputField = (props) => {
  const {
    label,
    error,
    helper,
    warning,
    value,
    valueType,
    valueSet,
    click,
    addonBefore,
    onChange,
    disabled,
    addonAfter,
    inputRef,
  } = props;

  const generateField = () => {
    if (valueSet) {
      return (
        <Select
          disabled={disabled}
          value={value}
          allowClear
          showSearch
          style={{ width: "100%" }}
          onChange={(selected) => {
            onChange(selected);
          }}
        >
          {valueSet.map((set) => (
            <Option value={set.value}>{set.label}</Option>
          ))}
        </Select>
      );
    }
    switch (valueType) {
      case "TEXT":
      case "INTEGER_POSITIVE":
      case "INTEGER_NEGATIVE":
      case "INTEGER_ZERO_OR_POSITIVE":
      case "PERCENTAGE":
      case "NUMBER":
      case "INTEGER":
      case "PHONE_NUMBER":
      case "EMAIL":
        return (
          <Input
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            value={value || ""}
            onClick={click}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            disabled={disabled}
            ref={inputRef}
          />
        );
      case "LONG_TEXT":
        return (
          <TextArea
            disabled={disabled}
            value={value || ""}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          />
        );
      case "DATE":
        return (
          <DatePicker
            value={value ? moment(value) : ""}
            onChange={(momentObject) => {
              momentObject && onChange(momentObject.format("YYYY-MM-DD"));
            }}
          />
        );
      case "AGE":
        return (
          <DatePicker
            value={value}
            onChange={(momentObject) => {
              onChange(momentObject);
            }}
          />
        );
      case "DATETIME":
        return <div>hello</div>;
      case "TIME":
        return <div>hello</div>;
      case "BOOLEAN":
        return (
          <Radio.Group
            disabled={disabled}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          >
            <Radio value="true" style={{ fontSize: "13.5px" }}>
              Yes
            </Radio>
            <Radio value="false" style={{ fontSize: "13.5px" }}>
              No
            </Radio>
          </Radio.Group>
        );
      case "TRUE_ONLY":
        return (
          <Checkbox
            checked={value}
            onChange={(event) => {
              onChange(event.target.checked);
            }}
            disabled={disabled}
          ></Checkbox>
        );

      default:
        return <span>UNSUPPORTED VALUE TYPE</span>;
    }
  };

  return (
    <div className="input-container">
      {label && <div className="input-label">{label}</div>}
      <div className="input-field">{generateField()}</div>
      {error && <div className="input-error">{error}</div>}
      {helper && <div className="input-helper">{helper}</div>}
      {warning && <div className="input-warning">{warning}</div>}
    </div>
  );
};

export default InputField;
