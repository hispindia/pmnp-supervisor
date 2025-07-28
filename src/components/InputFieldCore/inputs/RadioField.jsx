import { Radio } from "antd";

const RadioField = ({
    value, 
    valueSet, 
    disabled, 
    handleBlur,
    handleChange, 
}) => {
  const handleClick = (clickedValue) => {
    if (clickedValue === value) {
      handleChange("");   
      handleBlur("");
    }
  };

  return (
    <Radio.Group
      disabled={disabled}
      value={value}
      onChange={(e) => {
        if(e.target.value !== value) {
          handleChange(e.target.value)
          handleBlur(e.target.value)
        }
      }}
    >
    { valueSet.map(vs => <Radio value={vs.value} onClick={() => handleClick(vs.value)}>{vs.label}</Radio>) }
    </Radio.Group>
  );
};

export default RadioField;