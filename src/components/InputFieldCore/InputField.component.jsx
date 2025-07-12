import { onKeyDown } from "@/utils";
import MomentUtils from "@date-io/moment";
import { Radio } from "@material-ui/core";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import HyperLink from "./HyperLink";
import "./InputField.styles.css";
import propTypes from "./InputField.types.js";
import { DateField, RadioField, SelectField, TextField } from "./inputs/index";
import MultipleTrueOnlyDEs from "./inputs/MultipleTrueOnlyDEs";

const InputField = ({
  displayOption,
  valueType,
  valueSet,
  label,
  value,
  warning,
  error,
  helperText,
  onChange,
  onBlur = null,
  changeValue,
  disabled,
  pattern,
  locale,
  attribute = null,
  onInput,
  description,
  isMultipleTrueOnlyDes,
  isSelectSearchable,
  ...props
}) => {
  const { t } = useTranslation();

  const generateSelectFieldValue = (valueSet, value) => {
    const v = valueSet.find((currentValue) => currentValue.value === value);
    return v ? v : null;
  };

  const generateInput = () => {
    if (isMultipleTrueOnlyDes) {
      return (
        <MultipleTrueOnlyDEs
          valueSet={valueSet}
          locale={locale}
          changeValue={changeValue}
          disabled={disabled}
          onBlur={onBlur}
          {...props}
        />
      );
    }

    if (valueSet) {
      return (
        <SelectField
          valueSet={valueSet}
          locale={locale}
          value={generateSelectFieldValue(valueSet, value)}
          handleBlur={onBlur}
          handleChange={onChange}
          disabled={disabled}
          isSearchable={isSelectSearchable}
          {...props}
        />
      );
    }

    if (valueType === "DATE" || valueType === "AGE") {
      return (
        <DateField
          {...(_.has(props, "periodType") && {
            periodType: props.periodType,
          })}
          valueSet={valueSet}
          value={value}
          locale={locale}
          handleBlur={onBlur}
          handleChange={onChange}
          disabled={disabled}
          {...props}
        />
      );
    }

    if (valueType === "QUARTERLY") {
      return (
        <DatePicker
          size="large"
          picker="quarter"
          locale={locale}
          disabled={disabled}
          value={value ? dayjs(value) : ""}
          onChange={(momentObject) => {
            if (momentObject) {
              onChange(momentObject.format("YYYY-MM-DD"));
              onBlur(momentObject.format("YYYY-MM-DD"));
            } else {
              onChange("");
              onBlur("");
            }
          }}
        />
      );
    }

    if (valueType === "BOOLEAN") {
      const vs = [
        { value: "true", label: t("yes") },
        { value: "false", label: t("no") },
      ];
      if (displayOption == "RADIO") {
        return (
          <RadioField
            value={value}
            valueSet={vs}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            {...props}
          />
        );
      }
      return (
        <SelectField
          value={generateSelectFieldValue(vs, value)}
          valueSet={vs}
          handleBlur={onBlur}
          handleChange={onChange}
          disabled={disabled}
          {...props}
        />
      );
    }

    if (valueType === "MASK") {
      return (
        <TextField
          type="text"
          value={value}
          handleChange={onChange}
          handleBlur={onBlur}
          disabled={disabled}
          maxLength={attribute && attribute.maxLength}
          onKeyDown={(e) => {
            onKeyDown(e, pattern);
          }}
          {...props}
        />
      );
    }

    switch (valueType) {
      case "INTEGER":
      case "INTEGER_POSITIVE":
      case "INTEGER_NEGATIVE":
      case "INTEGER_ZERO_OR_POSITIVE":
        return (
          <TextField
            type="number"
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            inputProps={{ min: "0", step: "1" }}
            maxLength={attribute && attribute.maxLength}
            onInput={(e) => {
              if (attribute && attribute.maxLength) {
                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, attribute.maxLength);
              }
              // check 1 decimal
              const value = e.target.value;
              if (value.includes(".")) {
                const [intPart, decimalPart] = value.split(".");
                if (decimalPart.length > 1) {
                  e.target.value = `${intPart}.${decimalPart.slice(0, 1)}`;
                }
              }
            }}
            {...props}
          />
        );
      case "TEXT":
      case "PERCENTAGE":
      case "EMAIL":
        return <TextField value={value} handleChange={onChange} handleBlur={onBlur} disabled={disabled} {...props} />;

      case "PHONE_NUMBER":
        return (
          <TextField
            onKeyDown={(e) => {
              onKeyDown(e, /^[0-9]+$/);
            }}
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            {...props}
          />
        );
      case "LONG_TEXT":
        return (
          <TextField
            multiline
            rows={3}
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            {...props}
          />
        );
      case "TRUE_ONLY":
        return (
          <Radio
            checked={value === "true"}
            onChange={(e) => {
              onChange(e.target.checked ? "true" : "false");
              if (onBlur) {
                onBlur(e.target.checked ? "true" : "false");
              }
            }}
            disabled={disabled}
            {...props}
          />
        );
      case "NUMBER":
        return (
          <TextField
            type="number"
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            inputProps={{ min: "0", step: "1" }}
            // maxLength={attribute && attribute.maxLength}
            onInput={(e) => {
              if (attribute && attribute.maxLength) {
                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, attribute.maxLength);
              }
              // check max
              if (attribute && attribute.max) {
                e.target.value = parseInt(e.target.value) > attribute.max ? attribute.max : parseInt(e.target.value);
              }
              // check 1 decimal
              const value = e.target.value;
              if (value.includes(".")) {
                const [intPart, decimalPart] = value.split(".");
                if (decimalPart.length > 1) {
                  e.target.value = `${intPart}.${decimalPart.slice(0, 1)}`;
                }
              }
            }}
            {...props}
          />
        );

      case "TIME":
        return (
          <MuiPickersUtilsProvider utils={MomentUtils} locale={locale || "en"}>
            <TimePicker
              clearable
              disabled={disabled}
              value={value ? moment(value, "HH:mm") : null}
              onChange={(momentObject) => {
                if (momentObject) {
                  onChange(momentObject.format("HH:mm"));
                  onBlur(momentObject.format("HH:mm"));
                } else {
                  onChange("");
                  onBlur("");
                }
              }}
              {...props}
            />
          </MuiPickersUtilsProvider>
        );

      case "PATTERNNUMBER":
        return (
          <TextField
            type="number"
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            maxLength={attribute.maxLength}
            onInput={(e) => {
              if (attribute && attribute.maxLength) {
                e.target.value = e.target.value.replace(/^0+/, "");
                if (e.target.value.split("").length <= attribute.maxLength && e.target.value.split("").length > 0) {
                  let arr = [];
                  e.target.value.split("").forEach((da) => {
                    arr.push(da);
                  });
                  let arrValue = [];
                  for (let i = 1; i <= attribute.maxLength - arr.length; i++) {
                    arrValue.push(0);
                  }
                  arr.forEach((da) => {
                    arrValue.push(da);
                  });
                  e.target.value = arrValue.join("");
                } else {
                  e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, attribute.maxLength);
                }
              }
            }}
            {...props}
          />
        );
    }
  };

  return (
    <div className="input-field-container" data-element-id={props["data-element-id"]}>
      {label && (
        <div className="input-field-label">
          {label}
          &nbsp;
          <HyperLink hyperlink={props.hyperlink} base64={props.base64} />
        </div>
      )}
      <div className="h-10">{generateInput()}</div>
      {warning && <div className="input-field-warning">{warning}</div>}
      {error && <div className="input-field-error">{error}</div>}
      {helperText && <div className="input-field-helper-text">{helperText}</div>}
      {description && <div className="input-field-helper-text">{description}</div>}
      {!warning && !error && !helperText && (
        <div className="input-field-error" style={{ visibility: "hidden" }}>
          align
        </div>
      )}
    </div>
  );
};

InputField.propTypes = propTypes;
export default InputField;
