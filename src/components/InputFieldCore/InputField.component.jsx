import _ from "lodash";
import "./InputField.styles.css";
import propTypes from "./InputField.types.js";
import { DateField, SelectField, TextField } from "./inputs/index";
import { onKeyDown } from "@/utils";
import { useTranslation } from "react-i18next";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import MultipleTrueOnlyDEs from "./inputs/MultipleTrueOnlyDEs";
import HyperLink from "./HyperLink";

const InputField = ({
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
  ...props
}) => {
  const { t } = useTranslation();

  const generateSelectFieldValue = (valueSet, value) => {
    const v = valueSet.find((currentValue) => currentValue.value === value);
    return v ? v : null;
  };

  const generateInput = () => {
    if (valueType === "MULTIPLE_TRUE_ONLY_DES") {
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
            }}
            {...props}
          />
        );
      case "TEXT":
      case "PERCENTAGE":
      case "PHONE_NUMBER":
      case "EMAIL":
        return <TextField value={value} handleChange={onChange} handleBlur={onBlur} disabled={disabled} {...props} />;
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
      case "NUMBER":
        return (
          <TextField
            type="number"
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            inputProps={{ min: "0" }}
            // maxLength={attribute && attribute.maxLength}
            onInput={(e) => {
              if (attribute && attribute.maxLength) {
                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, attribute.maxLength);
              }
              // check max
              if (attribute && attribute.max) {
                e.target.value = parseInt(e.target.value) > attribute.max ? attribute.max : parseInt(e.target.value);
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
