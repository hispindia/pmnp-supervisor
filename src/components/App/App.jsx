import { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import RegisteredTeiListContainer from "../../containers/RegisteredTeiList";
import ControlBar from "../ControlBar/ControlBar";

import MainForm from "../../containers/MainForm";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import OrgUnitRequired from "../../skeletons/OrgUnitRequired";

const Report = lazy(() => import("../../modules/Report/containers/Layout"));

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
          component={
            <Suspense fallback={<div>Loading...</div>}>
              {withOrgUnitRequired(OrgUnitRequired)(<Report />)}
            </Suspense>
          }
        />
      </Switch>
    </>
  );
};

export default App;
