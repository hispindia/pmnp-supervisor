import React from "react";
import { Form } from "antd";

const withFormControlProps =
  (children) =>
  ({ ...props }) => {
    return (
      React.Children.map(children, (child) =>
        React.cloneElement(child, { ...props, ...child.props })
      ) || null
    );
  };

const CFormControl = ({
  id,
  dependentFields = [],
  showFieldFunc = () => true, // true - show input / false - hide input
  onDependentFieldsChange = () => {}, // callback on dependent fields change
  childPropsFunc = () => {}, // return props for children if child props depend values on form,
  setValuesFunc = () => {}, // set fields values on dependent fields change
  children,
  preserve = false,
  compulsory = false,
  displayFormName,
  valueType,
  valueSet,
  rules = [],
  ...props
}) => {
  let forwardedForm = null;
  const ForwardedFormControlProps = withFormControlProps(children);
  const shouldUpdate = (prevValues, curValues) => {
    return dependentFields.some(
      (field) => prevValues[field] !== curValues[field]
    );
  };
  return (
    <Form.Item noStyle shouldUpdate={shouldUpdate}>
      {(form) => {
        forwardedForm = form;
        const dependentValues = dependentFields.map((field) =>
          form.getFieldValue(field)
        );
        const childProps = childPropsFunc(dependentValues) || {};
        const isShow = showFieldFunc(dependentValues);
        onDependentFieldsChange(dependentValues);
        const newValues = setValuesFunc(dependentValues) || {};

        // Must be called to auto calculate dependent fields
        form.setFieldsValue(newValues);

        return (typeof isShow === "boolean" ? isShow : true) ? (
          id ? (
            <Form.Item
              rules={
                compulsory
                  ? [
                      {
                        required: true,
                        message: `${displayFormName} is required!`,
                      },
                    ].concat(rules)
                  : rules
              }
              preserve={preserve}
              required={compulsory}
              name={id}
              label={displayFormName}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              form={form}
              {...props}
            >
              <ForwardedFormControlProps
                valueType={valueType}
                valueSet={valueSet}
                form={form}
                {...childProps}
              />
            </Form.Item>
          ) : (
            <ForwardedFormControlProps
              // valueType={valueType}
              // valueSet={valueSet}
              // form={form}
              {...childProps}
            />
          )
        ) : null;
      }}
    </Form.Item>
  );
};

export default CFormControl;
