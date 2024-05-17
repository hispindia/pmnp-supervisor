import React from "react";
import { SnackbarProvider } from "notistack";

import { Col, Row, Flex } from "antd";

/* containers */
import FamilyMemberFormContainer from "../../containers/FamilyMemberForm";
import SideBarContainer from "../../containers/SideBar";

/* styles */
import "./index.css";

const FamilyMemberLayout = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="wrapper mt-2">
        <div className="leftBar mr-3">
          <SideBarContainer />
        </div>
        <div className="rightBar">
          <FamilyMemberFormContainer />
        </div>
      </div>
    </SnackbarProvider>
  );
};

export default FamilyMemberLayout;
