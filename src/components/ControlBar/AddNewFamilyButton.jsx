import React from 'react';
import { Button } from 'antd';

const AddNewFamilyButton = ({
    isAssignedToOrg,
    onClick,
    disabled,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            color="primary"
            // disableElevation
            disabled={disabled}
            onClick={onClick}
            {...props}
        />
    );
};

export default AddNewFamilyButton;
