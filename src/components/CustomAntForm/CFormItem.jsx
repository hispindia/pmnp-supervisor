import React from "react";
import { Form } from "antd";

const withFormControlProps = (children) => ({ ...props }) => {
  return (
    React.Children.map(children, (child) =>
      React.cloneElement(child, { ...props, ...child.props })
    ) || null
  );
};

const CFormItem = ({
  id,
  displayFormName,
  compulsory = false,
  valueType,
  valueSet,
  children,
  preserve = false,
  disabled = false,
  ...props
}) => {
  const ForwardedFormControlProps = withFormControlProps(children);
  return (
    <Form.Item
      preserve={preserve}
      required={compulsory}
      name={id}
      label={displayFormName}
      {...props}
    >
      <ForwardedFormControlProps
        disabled={disabled}
        valueType={valueType}
        valueSet={valueSet}
      />
    </Form.Item>
  );
};
export default CFormItem;
