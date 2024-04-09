import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ControlBar from '../ControlBar/ControlBar';
import RegisteredTeiListContainer from '../../containers/RegisteredTeiList';

import MainForm from '../../containers/MainForm';
import Report from '../../modules/Report/containers/Layout';
import withOrgUnitRequired from '../../hocs/withOrgUnitRequired';
import OrgUnitRequired from '../../skeletons/OrgUnitRequired';

// import RegisteredTeiFormContainer from "../../containers/RegisteredTeiForm";

// const { appContentContainer } = styles;

const App = () => {
    return (
        <>
            <Route path="/" render={() => <ControlBar />} />
            <Switch>
                <Route path="/list" component={RegisteredTeiListContainer} />
                <Route path="/form" component={MainForm} />
                {/* <Route path="/form1" component={FamilyMemberFormContainer} /> */}
                {/* <Route path="/form1" component={FMLayout} /> */}

                {/*<Route*/}
                {/*  path="/form"*/}
                {/*  render={() => <FormContainer programMetadata={programMetadata} />}*/}
                {/*/>*/}
                <Route
                    path="/report"
                    component={withOrgUnitRequired(OrgUnitRequired)(Report)}
                />
            </Switch>
        </>
    );
};

export default App;
