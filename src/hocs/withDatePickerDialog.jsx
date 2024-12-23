import React, {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import moment from "moment";

// Date Picker
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/lo";

import { Dialog } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const withDatePickerDialog = (Component) =>
  forwardRef(
    (
      {
        onCancel,
        onChange,
        onClick,
        closeOnClick,
        selectedDate,
        messageText,
        setMessageText,
        ...props
      },
      ref
    ) => {
      const [open, setOpen] = useState(false);

      const handleClick = (event) => {
        onClick && onClick(event);
        setOpen(true);
      };

      useImperativeHandle(ref, () => ({
        close() {
          setOpen(false);
        },
      }));

      useLayoutEffect(() => {
        return () => {
          setMessageText && setMessageText(null);
        };
      }, []);

      const handleClose = (e) => {
        setOpen(false);
        setMessageText && setMessageText(null);
      };

      return (
        <>
          <Component onClick={handleClick} {...props} />
          <Dialog
            open={open}
            onClose={(e) => handleClose(e)}
            aria-labelledby="Year Picker"
          >
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              // locale={i18n.language || "en"}
              locale={"en"}
            >
              <DatePicker
                id="addDatePicker"
                variant="static"
                views={["year"]}
                label="Year only"
                value={new Date(`${selectedDate}/01/01`)}
                onChange={(date) => {
                  onChange && onChange(moment(date).year());
                }}
                minDate={new Date(`${props.minDate}`)}
                maxDate={new Date(`${props.maxDate}`)}
                disableToolbar={props.disableToolbar}
              />
              {messageText && <Alert severity="error">{messageText}</Alert>}
            </MuiPickersUtilsProvider>
          </Dialog>
        </>
      );
    }
  );

export default withDatePickerDialog;
