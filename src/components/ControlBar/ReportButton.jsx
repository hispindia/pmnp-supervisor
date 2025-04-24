import React from "react";
import { Button } from "antd";

const ReportButton = ({ onClick, children, type, icon }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      type={type}
      icon={icon}
      // disableElevation
      onClick={onClick}
      start
    >
      {children}
    </Button>
  );
};

export default ReportButton;
