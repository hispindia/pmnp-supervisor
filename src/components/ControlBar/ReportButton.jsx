import React from "react";
import { Button } from "antd";

const ReportButton = ({ onClick, children, type, icon, href, target }) => {
 return (
    <Button
      variant="contained"
      color="primary"
      type={type}
      icon={icon}
      // disableElevation
      onClick={onClick}
      href={href}
      target={target}
      start
    >
      {children}
    </Button>
  );
};

export default ReportButton;
