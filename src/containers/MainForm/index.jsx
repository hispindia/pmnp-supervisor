import React, { useEffect } from "react";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import MainForm from "../../components/MainForm/MainForm";
import {
  clear,
  getTei,
  getTeiSuccessMessage,
} from "../../redux/actions/data/tei";
import Form from "../../skeletons/Form";
import { changeTab } from "../../redux/actions/data";
import { compose } from "redux";
import withFeedback from "../../hocs/withFeedback";
import { Button, Space } from "antd";

const LoadingFormContainer = compose(
  withFeedback(),
  withSkeletonLoading(Form)
)(MainForm);

const FormContainer = () => {
  const {
    loading,
    error,
    data: { currentTei },
    currentTab,
    isEditingAttributes,
    success,
  } = useSelector((state) => state.data.tei);

  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTei());
    return () => {
      dispatch(clear());
    };
  }, []);

  const onCloseClick = () => {
    history.push("/list");
  };

  const onTabChange = (tabId) => {
    dispatch(changeTab(tabId));
  };

  const backToListPage = () => {
    history.push("/list");
  };

  return (
    <LoadingFormContainer
      successMessage={success}
      errorMessage={error}
      errorDisplaying={
        <Space
          style={{
            textAlign: "center",
          }}
          direction="vertical"
        >
          <div>{error}</div>
          <Button onClick={backToListPage}>Back to List page</Button>
        </Space>
      }
      loading={loading}
      mask
      loaded={!!currentTei}
      onCloseClick={onCloseClick}
      currentTab={currentTab}
      onTabChange={onTabChange}
      isEditingAttributes={isEditingAttributes}
      afterSuccess={() => {
        dispatch(getTeiSuccessMessage(null));
      }}
    />
  );
};

export default FormContainer;
