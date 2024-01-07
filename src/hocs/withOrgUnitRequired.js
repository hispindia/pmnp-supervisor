import React from "react";
import { connect } from "react-redux";

const withOrgUnitRequired = (Placeholder = () => null) => (Component) => {
  const OrgUnitRequiredComponent = ({ selectedOrgUnit, ...props }) => {
    if (!selectedOrgUnit) {
      return <Placeholder />;
    }
    return <Component {...props} />;
  };
  const mapStateToProps = (state) => ({
    selectedOrgUnit: state.metadata.selectedOrgUnit,
  });
  const ConnectedStoreComponent = connect(mapStateToProps)(
    OrgUnitRequiredComponent
  );
  return ConnectedStoreComponent;
};

export default withOrgUnitRequired;
