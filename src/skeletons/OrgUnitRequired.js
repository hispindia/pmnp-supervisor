import React, { useMemo } from "react";
import withError from "../hocs/withFeedback/withError";

const OrgUnitRequired = () => {
  const Component = useMemo(() => withError()(() => null), []);
  return (
    <Component
      errorMessage={"Please select org unit to continue"}
      errorDisplaying={"Please select org unit to continue"}
    />
  );
};

export default OrgUnitRequired;
