import { lazy, Suspense } from "react";

import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import OrgUnitRequired from "../../skeletons/OrgUnitRequired";

const Report = lazy(() => import("../../modules/Report/containers/Layout"));
const ReportWithOrgUnitRequired = withOrgUnitRequired(OrgUnitRequired)(Report);

const ReportContainer = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportWithOrgUnitRequired />
    </Suspense>
  );
};

export default ReportContainer;
