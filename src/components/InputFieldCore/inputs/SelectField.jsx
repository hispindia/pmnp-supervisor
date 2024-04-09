import React from 'react';
import Select from 'react-select';

const SelectField = (
    { valueSet, value, handleChange, handleBlur, locale, uiLocale, disabled },
    props
) => {
    // const { disabled = false, ...other } = props;

    const options = valueSet.map((e) => {
        e.label = locale
            ? locale != 'en'
                ? e.translations[locale]
                : e.label
            : e.label;
        return e;
    });

    return (
        <Select
            value={value}
            isDisabled={disabled}
            options={options}
            placeholder={value ? value : uiLocale && uiLocale.select}
            onChange={(selected) => {
                handleChange(selected.value);
                handleBlur && handleBlur(selected.value);
            }}
            styles={{
                control: (provided) => ({
                    ...provided,
                    height: 40,
                }),
            }}
        />
    );
};

export default SelectField;
