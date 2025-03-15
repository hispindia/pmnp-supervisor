import { Box, TextField, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
const LIST_HOURS = Array.from({ length: 24 }, (_, index) => ({
  label: index.toString().padStart(2, "0"),
  value: index,
}));

const LIST_MINUTES = Array.from({ length: 60 }, (_, index) => ({
  label: index.toString().padStart(2, "0"),
  value: index,
}));
const TimePicker = ({ change, disabled, value = "", disableClearable }) => {
  const { t } = useTranslation();
  const [hours, minutes] = useMemo(() => value.split(":"), [value]);

  return (
    <Box sx={{ display: "flex", gap: "10px", maxWidth: "250px" }}>
      <Box sx={{ flex: "1" }}>
        <Typography>{t("selectHour")}</Typography>
        <Autocomplete
          sx={{
            input: { padding: "2.5px 4px 2.5px 5px !important" },
            "& .MuiInputBase-root": {
              paddingY: "6px !important",
              paddingLeft: "6px !important",
            },
          }}
          disableClearable={disableClearable}
          value={LIST_HOURS.find((item) => item.label === hours) || null}
          disabled={disabled}
          onChange={(event, value) => {
            if (!value) {
              change("");
            } else {
              change(`${value.label}:${minutes || "00"}`);
            }
          }}
          isOptionEqualToValue={(option, value) => {
            return value ? option.value === value.value : false;
          }}
          options={LIST_HOURS}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
      <Typography
        sx={{
          height: "40px",
          alignSelf: "end",
          display: "flex",
          alignItems: "center",
          fontWeight: "700",
          fontSize: "20px",
        }}
      >
        :
      </Typography>
      <Box sx={{ flex: "1" }}>
        <Typography>{t("selectMinute")}</Typography>
        <Autocomplete
          sx={{
            input: { padding: "2.5px 4px 2.5px 5px !important" },
            "& .MuiInputBase-root": {
              paddingY: "6px !important",
              paddingLeft: "6px !important",
            },
          }}
          disabled={disabled || !hours}
          value={LIST_MINUTES.find((item) => item.label === minutes) || null}
          onChange={(event, value) => {
            change(`${hours}:${value?.label || "00"}`);
          }}
          isOptionEqualToValue={(option, value) => {
            return value ? option.value === value.value : false;
          }}
          options={LIST_MINUTES}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </Box>
  );
};

export default TimePicker;
