import React, { useEffect } from "react";
import { Alert, notification, Row } from "antd";

const withError = (options) => (Component) => {
  return ({
    errorMessage,
    errorDisplaying = null,
    afterError = () => {},
    ...props
  }) => {
    useEffect(() => {
      if (errorMessage) {
        const args = {
          message: "Error!!!",
          description: errorMessage,
          placement: "bottomRight",
          duration: 0,
          ...options,
        };
        notification.error(args);
      }
    }, [errorMessage]);
    if (errorMessage && errorDisplaying) {
      return (
        <Row
          justify="center"
          style={{
            paddingTop: 24,
          }}
        >
          <Alert
            style={{
              display: "inline-block",
            }}
            message={errorDisplaying}
            type="error"
          />
        </Row>
      );
    }
    return <Component {...props} />;
  };
};

export default withError;
