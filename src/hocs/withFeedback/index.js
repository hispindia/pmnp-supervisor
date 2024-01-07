import React, { useMemo } from "react";
import { compose } from "redux";
import withSuccess from "./withSuccess";
import withError from "./withError";

const withFeedback = (
  { successOptions = {}, errorOptions = {} } = {
    errorOptions: {},
    successOptions: {},
  }
) => (Component) => {
  return ({
    errorMessage,
    successMessage,
    afterError = () => {},
    afterSuccess = () => {},
    ...props
  }) => {
    const CombinedComponent = useMemo(
      () =>
        compose(
          withSuccess(successOptions),
          withError(errorOptions)
        )(Component),
      []
    );
    return (
      <CombinedComponent
        errorMessage={errorMessage}
        successMessage={successMessage}
        afterError={afterError}
        afterSuccess={afterSuccess}
        {...props}
      />
    );
  };
};

export default withFeedback;
