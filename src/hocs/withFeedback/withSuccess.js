import React, { useEffect } from "react";
import { notification } from "antd";

const withSuccess = (options = {}) => (Component) => {
  return ({ successMessage, afterSuccess = () => {}, ...props }) => {
    useEffect(() => {
      if (successMessage) {
        const args = {
          message: "Success",
          description: successMessage,
          placement: "bottomRight",
          duration: 2,
          onClose: afterSuccess,
          ...options,
        };
        notification.success(args);
      }
      return afterSuccess;
    }, [successMessage]);
    return <Component {...props} />;
  };
};

export default withSuccess;
