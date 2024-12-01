import Select from "react-select";

const SelectField = (
  { options, value, handleChange, handleBlur, locale, uiLocale, disabled },
  props
) => {
  const translatedOptions = options.map((e) => {
    e.label = locale
      ? locale != "en"
        ? e.translations[locale]
        : e.name
      : e.name;

    e.value = e.code;
    return e;
  });

  return (
    <Select
      value={value}
      isDisabled={disabled}
      isClearable={true}
      options={translatedOptions}
      placeholder={value ? value : uiLocale && uiLocale.select}
      onChange={(selected) => {
        console.log(selected.code);
        if (!selected) {
          handleChange(null);
          handleBlur && handleBlur(null);
          return;
        }

        handleChange(selected.code);
        handleBlur && handleBlur(selected.code);
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
