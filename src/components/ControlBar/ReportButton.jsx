import React from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";

const ReportButton = ({ onClick, children }) => {
  const { offlineStatus } = useSelector((state) => state.common);

  if (offlineStatus) {
    return null;
  }

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
