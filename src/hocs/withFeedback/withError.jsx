import React, { useEffect } from "react";
import { Alert, notification, Row } from "antd";
import { useTranslation } from "react-i18next";

const withError = (options) => (Component) => {
  return ({ errorMessage, disableAlert, errorDisplaying = null, afterError = () => {}, ...props }) => {
    const { t } = useTranslation();

    useEffect(() => {
      if (errorMessage && !disableAlert) {
        const args = {
          message: t("Error") + "!!!",
          description: errorMessage,
          placement: "bottomRight",
          duration: 0,
          ...options,
        };
        notification.error(args);
      }
    }, [errorMessage, disableAlert]);

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
