import React from 'react';

const withDhis2Field = (dhis2Fields) => (Component) => {
    const Dhis2FieldComponent = ({ id, ...props }) => {
        const field = dhis2Fields.find((tei) => tei.id === id);
        if (!field) {
            return `${id} not found`;
        }
        return (
            <Component
                valueSet={field.valueSet}
                valueType={field.valueType}
                id={field.id}
                compulsory={field.compulsory}
                displayFormName={field.displayFormName}
                {...props}
            />
        );
    };
    return Dhis2FieldComponent;
};

export default withDhis2Field;
