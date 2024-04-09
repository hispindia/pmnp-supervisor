import React from 'react';
import { SnackbarProvider } from 'notistack';

import { Col, Row } from 'antd';

/* containers */
import FamilyMemberFormContainer from '../../containers/FamilyMemberForm';
import SideBarContainer from '../../containers/SideBar';

/* styles */
import './index.css';

const FamilyMemberLayout = () => {
    return (
        <SnackbarProvider maxSnack={3}>
            <Row wrap={false} gutter={16}>
                <Col className="leftBar">
                    <SideBarContainer />
                </Col>
                <Col className="rightBar">
                    <FamilyMemberFormContainer />
                </Col>
            </Row>
        </SnackbarProvider>
    );
};

export default FamilyMemberLayout;
