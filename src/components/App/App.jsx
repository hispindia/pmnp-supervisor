import { Route, Switch, Redirect } from "react-router-dom";
import RegisteredTeiListContainer from "../../containers/RegisteredTeiList";
import ControlBar from "../ControlBar/ControlBar";
import MainForm from "../../containers/MainForm";
import ReportContainer from "./ReportContainer";
import AssignHouseholdContainer from "@/containers/AssignHousehold";
import { useAccessControl } from "@/hooks/useAccessControl";
import AccessRestrictionMessage from "../AccessRestrictionMessage";

const App = () => {
  const { isAccessAble, userRoleNames } = useAccessControl();

  // If user doesn't have access, show restriction message
  if (!isAccessAble) {
    return <AccessRestrictionMessage userRole={userRoleNames} />;
  }

  return (
    <>
      <Route path="/" render={() => <ControlBar />} />
      <Switch>
        <Route exact path="/">
          <Redirect to="/assign" />
        </Route>
        <Route path="/assign" component={AssignHouseholdContainer} />
        <Route path="/list" component={RegisteredTeiListContainer} />
        <Route path="/form" component={MainForm} />
        <Route path="/report" component={ReportContainer} />
        <Route path="/accessRestrictionMessage" component={AccessRestrictionMessage} />
      </Switch>
    </>
  );
};

export default App;
