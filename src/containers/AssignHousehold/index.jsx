import React, { useEffect } from "react";
/* REDUX */
import { useDispatch, useSelector } from "react-redux";
/*       */
/* Components */
import RegisteredTeiListAssign from "../../components/RegisteredTeiListAssign";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import TeiListSkeleton from "../../skeletons/TeiList";
import { useHistory } from "react-router-dom";
import OrgUnitRequired from "../../skeletons/OrgUnitRequired";
import { deleteTei } from "../../redux/actions/data/tei";
import { compose } from "redux";
import withFeedback from "../../hocs/withFeedback";
import {
  getTeis,
  getTeisErrorMessage,
  getTeisSuccessMessage,
  tableChangePage,
  tableFilter,
  tableSort,
} from "../../redux/actions/teis";
import { getUsers } from "@/redux/actions/metadata";

const LoadingRegisteredTeiList = compose(
  withFeedback(),
  withSkeletonLoading(TeiListSkeleton)
)(RegisteredTeiListAssign);

const AssignHouseholdContainer = () => {
  const dispatch = useDispatch();
  const onDeleteTei = (record) => dispatch(deleteTei(record.teiId));
  const { selectedOrgUnit, users } = useSelector((state) => state.metadata);
  const  user  = useSelector((state) => state.me);
 
  const trackedEntityAttributes = useSelector(
    (state) => state.metadata.programMetadata.trackedEntityAttributes
  );
  const {
    teis,
    loading,
    success,
    error,
    pager: { page, pageSize, total },
  } = useSelector((state) => state.teis);
  const history = useHistory();

  useEffect(() => {
    dispatch(getUsers(selectedOrgUnit.id))
    dispatch(getTeis());
    return () => {
      dispatch(getTeisSuccessMessage(null));
      dispatch(getTeisErrorMessage(null));
    };
  }, [selectedOrgUnit]);

  const onSort = (sorter) => {
    dispatch(tableSort(sorter));
  };

  const onChangePage = (page, pageSize) => {
    dispatch(tableChangePage(page, pageSize));
  };

  const onRowClick = (record) => {
    history.push({
      pathname: "/form",
      search: `?tei=${record.teiId}`,
    });
  };

  const onFilter = (value, teiId) => {
    dispatch(tableFilter(value, teiId));
  };

  return (
    
    <LoadingRegisteredTeiList
      errorMessage={error}
      successMessage={success}
      mask
      loading={loading}
      loaded={!!teis}
      teis={teis}
      page={page}
      pageSize={pageSize}
      total={total}
      trackedEntityAttributes={trackedEntityAttributes}
      onSort={onSort}
      onChangePage={onChangePage}
      onRowClick={onRowClick}
      onFilter={onFilter}
      user={user}
      users={users}
    />
  );
};

export default withOrgUnitRequired(OrgUnitRequired)(AssignHouseholdContainer);
