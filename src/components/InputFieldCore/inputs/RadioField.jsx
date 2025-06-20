import { Radio } from "antd";

const RadioField = ({
    value, 
    valueSet, 
    disabled, 
    handleBlur,
    handleChange, 
}) => {
  return (
    <Radio.Group
      disabled={disabled}
      value={value}
      onChange={(e) => {
        handleChange(e.target.value)
        handleBlur(e.target.value)
      }}
    >
    {valueSet.map(vs => <Radio value={vs.value}>{vs.label}</Radio>)}
    </Radio.Group>
  );
};

export default RadioField;