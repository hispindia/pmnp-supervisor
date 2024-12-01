import React, { useState } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DatePicker,
} from "@material-ui/pickers";
import moment from "moment";

// Date Picker
import MomentUtils from "@date-io/moment";
import "moment/locale/lo";

const DateField = (
  {
    value,
    handleChange,
    periodType,
    handleBlur,
    maxDate,
    minDate,
    maxDateMessage,
    minDateMessage,
    locale,
    variant,
    uiLocale,
  },
  props
) => {
  const { disabled = false, ...other } = props;
  let fieldValue = value;
  if (moment(value, "YYYY-MM-DD", true).isValid()) {
    fieldValue = moment(value, "YYYY-MM-DD");
  }

  const switchFormat = (periodType) => {
    switch (periodType) {
      case "year":
        return "yyyy";
      default:
        return "dd/MM/yyyy";
    }
  };

  const switchFormatMoment = (periodType) => {
    switch (periodType) {
      case "year":
        return "YYYY";
      default:
        return "YYYY-MM-DD";
    }
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={locale || "en"}>
      <DatePicker
        clearable={false}
        {...(periodType && {
          views: [periodType],
        })}
        variant={variant}
        disabled={disabled}
        value={moment(fieldValue, switchFormatMoment(periodType))}
        defaultValue=""
        onChange={(date) => {
          handleChange(moment(date).format(switchFormatMoment(periodType)));
          handleBlur &&
            handleBlur(moment(date).format(switchFormatMoment(periodType)));
        }}
        format={switchFormatMoment(periodType)}
        invalidDateMessage={value ? "Invalid Date Format" : ""}
        maxDate={maxDate}
        minDate={minDate}
        maxDateMessage={maxDateMessage}
        minDateMessage={minDateMessage}
        clearLabel={React.createElement(
          "span",
          null,
          uiLocale && uiLocale.clear
        )}
        cancelLabel={React.createElement(
          "span",
          null,
          uiLocale && uiLocale.cancel
        )}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateField;
