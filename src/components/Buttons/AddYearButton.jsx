import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import withDatePickerDialog from "../../hocs/withDatePickerDialog";

import { Button } from "antd";
import { useTranslation } from "react-i18next";

const AddYearButtonWithDatePickerDialog = withDatePickerDialog(Button);

const AddYearButton = forwardRef(
  (
    {
      selectedYear,
      handleAddSelectedYear,
      tei,
      setWarningText,
      warningText,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();

    useEffect(() => {
      return () => {
        setWarningText(null);
      };
    }, []);
    const childRef = useRef();

    useImperativeHandle(ref, () => ({
      close() {
        childRef.current.close();
      },
    }));

    return (
      <>
        <AddYearButtonWithDatePickerDialog
          style={{ width: "100px", margin: "10px auto" }}
          // size="small"
          type="primary"
          // variant="contained"
          // disableElevation
          selectedDate={selectedYear}
          onChange={handleAddSelectedYear}
          onClick={(e) => e.stopPropagation()}
          minDate={props.minDate}
          maxDate={props.maxDate}
          messageText={warningText}
          setMessageText={setWarningText}
          ref={childRef}
          {...props}
        >
          {t("addYear")}
        </AddYearButtonWithDatePickerDialog>
      </>
    );
  }
);

export default AddYearButton;
