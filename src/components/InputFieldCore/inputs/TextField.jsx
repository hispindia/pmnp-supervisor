import React from 'react';
import { TextField as MuiTextField } from '@material-ui/core';

const TextField = ({
    value,
    handleChange,
    handleBlur,
    type,
    disabled,
    onInput,
    maxLength,
    ...props
}) => {
    return (
        <MuiTextField
            disabled={disabled}
            fullWidth
            type={type}
            value={value}
            variant={disabled ? 'filled' : 'outlined'}
            size="small"
            onInput={onInput}
            maxLength={maxLength}
            onBlur={(event) => {
                handleBlur && handleBlur(event.target.value);
            }}
            onChange={(event) => {
                handleChange(event.target.value);
            }}
            {...props}
        />
    );
};

export default TextField;
