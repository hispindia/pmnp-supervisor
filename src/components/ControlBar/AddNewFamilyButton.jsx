import React from "react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddNewFamilyButton = ({ isAssignedToOrg, onClick, disabled, ...props }) => {
  return (
    <Button
      type="primary"
      // disableElevation
      disabled={disabled}
      onClick={onClick}
      icon={<FontAwesomeIcon icon={faPlus} />}
      {...props}
    />
  );
};

export default AddNewFamilyButton;
