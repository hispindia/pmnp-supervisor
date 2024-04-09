import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import withDatePickerDialog from '../../hocs/withDatePickerDialog';

import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useButtonStyle = makeStyles({
    root: {
        width: '100px',
        margin: '10px',
    },
});

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
        const buttonStyle = useButtonStyle();
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
                    classes={buttonStyle}
                    size="small"
                    variant="contained"
                    disableElevation
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
                    {t('addYear')}
                </AddYearButtonWithDatePickerDialog>
            </>
        );
    }
);

export default AddYearButton;
