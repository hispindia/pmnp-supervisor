import { Route, Switch } from "react-router-dom";
import RegisteredTeiListContainer from "../../containers/RegisteredTeiList";
import ControlBar from "../ControlBar/ControlBar";
import MainForm from "../../containers/MainForm";
import ReportContainer from "./ReportContainer";

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
        <Route path="/report" component={ReportContainer} />
      </Switch>
    </>
  );
};

export default App;
