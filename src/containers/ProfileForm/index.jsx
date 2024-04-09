import React from "react";
import ProfileForm from "../../components/ProfileForm";
import {
  changeTab,
  editingAttributes,
  submitAttributes,
} from "../../redux/actions/data";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import queryString from "query-string";

const ProfileFormContainer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isEditingAttributes = useSelector(
    (state) => state.data.tei.isEditingAttributes
  );

  const dispatchIsEditingAttributes = (state) => {
    dispatch(editingAttributes(state));
  };

  const onSubmit = (newAttributes) => {
    dispatch(submitAttributes(newAttributes));
  };

  const hasTeiParam = () => {
    const { tei } = queryString.parse(location.search);
    return !!tei;
  };

  const onNextClick = () => {
    dispatch(changeTab("2"));
  };

  return (
    <ProfileForm
      setIsEditingAttributes={dispatchIsEditingAttributes}
      isEditingAttributes={isEditingAttributes}
      onSubmit={onSubmit}
      hasTeiParam={hasTeiParam}
      onNextClick={onNextClick}
    />
  );
};

export default ProfileFormContainer;
