import React from "react";
import { TextField as MuiTextField } from "@material-ui/core";

const TextField = ({ value, handleChange, handleBlur, type, disabled, onInput, maxLength, style, ...props }) => {
  return (
    <MuiTextField
      disabled={disabled}
      fullWidth
      type={type}
      value={value}
      variant={disabled ? "filled" : "outlined"}
      size="small"
      onInput={onInput}
      maxLength={maxLength}
      style={{ textTransform: "uppercase", ...style }}
      onBlur={(event) => {
        const uppercaseValue = event.target.value.toUpperCase();
        handleBlur && handleBlur(uppercaseValue);
      }}
      onChange={(event) => {
        const uppercaseValue = event.target.value.toUpperCase();
        handleChange(uppercaseValue);
      }}
      {...props}
    />
  );
};

export default TextField;
