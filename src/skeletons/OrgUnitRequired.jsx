import React, { useMemo } from "react";
import withError from "../hocs/withFeedback/withError";

const OrgUnitRequired = () => {
  const Component = useMemo(() => withError()(() => null), []);
  return (
    <Component
      errorMessage={"Please select barangay continue"}
      errorDisplaying={"Please select barangay to continue"}
    />
  );
};

export default OrgUnitRequired;
