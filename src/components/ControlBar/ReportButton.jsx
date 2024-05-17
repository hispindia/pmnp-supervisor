import React from "react";
import { Button } from "antd";

const ReportButton = ({ onClick, children }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      // disableElevation
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ReportButton;
