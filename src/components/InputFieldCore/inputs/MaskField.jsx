import React from "react";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function TextMaskCustom(props) {
  const { inputRef, pattern, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={pattern}
      // placeholderChar={"-"}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  pattern: PropTypes.func.isRequired,
};

const FormattedInputs = (
  { value, handleChange, handleBlur, pattern },
  props
) => {
  const { disabled = false, ...other } = props;

  return (
    <Input
      value={value}
      onChange={(event) => {
        handleChange(event.target.value);
      }}
      onBlur={(event) => {
        handleBlur && handleBlur(event.target.value);
      }}
      name="textmask"
      id="formatted-text-mask-input"
      inputProps={{
        pattern: pattern,
      }}
      inputComponent={TextMaskCustom}
    />
  );
};

export default FormattedInputs;
