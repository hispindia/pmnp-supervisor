import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import withDatePickerDialog from "../../hocs/withDatePickerDialog";

import { IconButton } from "@material-ui/core";
import { useTranslation } from "react-i18next";
// Icons
import EventIcon from "@material-ui/icons/Event";

const EditYearButtonWithDatePickerDialog = withDatePickerDialog(IconButton);

const EditYearButton = ({
  event,
  handleEditEventDate,
  selectedYear,
  handleAddSelectedYear,
  tei,
  setWarningText,
  warningText,
  ...props
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      setWarningText(null);
    };
  }, []);

  return (
    <EditYearButtonWithDatePickerDialog
      size="small"
      color="primary"
      disableFocusRipple={true}
      disableRipple={true}
      disabled={event.status != "ACTIVE"}
      // onClick={(e) => buttonEditYearOnClick(e, eventID)}
      selectedDate={selectedYear}
      onChange={handleEditEventDate}
      onClick={(e) => e.stopPropagation()}
      minDate={props.minDate}
      maxDate={props.maxDate}
      messageText={warningText}
      setMessageText={setWarningText}
    >
      <EventIcon fontSize="small" />
    </EditYearButtonWithDatePickerDialog>
  );
};

export default EditYearButton;
