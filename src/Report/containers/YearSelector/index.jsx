import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import options from "./options";
import { useTranslation } from "react-i18next";

const useFormControlStyle = makeStyles({
  root: {
    minWidth: 120
  }
});

function YearSelector({ year, setYear }) {
  const formControlStyle = useFormControlStyle();
  const { t } = useTranslation();
  const setYearOnChangeSelect = event => {
    setYear(event.target.value);
  };

  const optionItemComponents = options.map(({ value, label }) => (
    <MenuItem key={value} value={value}>
      {t(label) || label}
    </MenuItem>
  ));

  return (
    <FormControl classes={formControlStyle}>
      <InputLabel shrink id="year-label">
        {t("year")}
      </InputLabel>
      <Select
        labelId="year-label"
        value={year}
        onChange={setYearOnChangeSelect}
        label="Year"
      >
        {optionItemComponents}
      </Select>
    </FormControl>
  );
}

YearSelector.propTypes = {};
YearSelector.defaultProps = {};

export default YearSelector;
