import { useState, useEffect } from "react";

const useProfile = (currentTei) => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (currentTei) {
      initProfile(currentTei);
    }
  }, []);

  const initProfile = (initTei) => {
    profile.orgUnit = initTei.orgUnit;
    profile.trackedEntityType = initTei.trackedEntityType;
    profile.trackedEntity = initTei.trackedEntity;
    profile.featureType = "NONE";
    profile.attributes = initTei.attributes
      ? initTei.attributes.reduce((accumulator, currentAttribute) => {
          accumulator[currentAttribute.attribute] = currentAttribute.value;
          return accumulator;
        }, {})
      : {};
    profile.enrollment = initTei.enrollments ? initTei.enrollments[0] : {};
    profile._isDirty = false;
    profile.isNew = initTei.isNew || false;
    profile.isPass = initTei.isPass || false;
    setProfile({ ...profile });
  };

  const changeProfile = (property, value) => {
    profile[property] = value;
    profile._isDirty = true;
    setProfile({ ...profile });
  };

  const changeEnrollment = (property, value) => {
    profile.enrollment[property] = value;
    profile._isDirty = true;
    setProfile({ ...profile });
  };

  const setProfileDirty = (isDirty) => {
    profile._isDirty = isDirty;
    setProfile({ ...profile });
  };

  const changeProfileAttributeValue = (attribute, value) => {
    profile.attributes[attribute] = value;
    profile._isDirty = true;
    setProfile({ ...profile });
  };

  const transformProfile = () => {
    const transformed = { ...profile };
    transformed.attributes = Object.keys(transformed.attributes)
      .filter((attribute) => {
        if (transformed.attributes[attribute]) return true;
        else return false;
      })
      .map((attribute) => {
        const attr = {
          attribute,
          value: transformed.attributes[attribute],
        };
        return attr;
      });
    delete transformed.enrollment.events;
    transformed.enrollments = [transformed.enrollment];
    // delete transformed.enrollment;
    return transformed;
  };

  return {
    profile,
    initProfile,
    changeProfile,
    changeProfileAttributeValue,
    changeEnrollment,
    setProfileDirty,
    transformProfile,
  };
};

export default useProfile;
