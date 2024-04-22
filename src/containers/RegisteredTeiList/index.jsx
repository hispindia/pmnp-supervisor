import React, { useEffect } from "react";
/* REDUX */
import { useDispatch, useSelector } from "react-redux";
/*       */
/* Components */
import RegisteredTeiList from "../../components/RegisteredTeiList";
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

const LoadingRegisteredTeiList = compose(
  withFeedback(),
  withSkeletonLoading(TeiListSkeleton)
)(RegisteredTeiList);

const RegisteredTeiListContainer = () => {
  const dispatch = useDispatch();
  const onDeleteTei = (record) => dispatch(deleteTei(record.teiId));
  const { selectedOrgUnit } = useSelector((state) => state.metadata);
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
      onDeleteTei={onDeleteTei}
      onSort={onSort}
      onChangePage={onChangePage}
      onRowClick={onRowClick}
      onFilter={onFilter}
    />
  );
};

export default withOrgUnitRequired(OrgUnitRequired)(RegisteredTeiListContainer);
