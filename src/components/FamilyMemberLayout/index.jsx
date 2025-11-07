import { SnackbarProvider } from "notistack";

/* containers */
import FamilyMemberFormContainer from "../../containers/FamilyMemberForm";

/* styles */
import "./index.css";

const FamilyMemberLayout = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="wrapper mt-2">
        <div className="rightBar">
          <FamilyMemberFormContainer />
        </div>
      </div>
    </SnackbarProvider>
  );
};

export default FamilyMemberLayout;
