import React, { useState } from "react";
import { useSelector } from "react-redux";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import FormNoInput from "../../components/ProfileForm/FormNoInput";
import { useTranslation } from "react-i18next";
import { useApi } from "../../hooks";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";

const LoadingFormNoInput = withSkeletonLoading()(FormNoInput);

const FormNoInputContainer = ({ id, initialValue, ...props }) => {
  const { programMetadata, selectedOrgUnit } = useSelector(
    (state) => state.metadata
  );

  const { offlineStatus } = useSelector((state) => state.common);

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  // const [validValue, setValidValue] = useState(initialValue || null);
  const { dataApi } = useApi();
  const checkUnique = (_, value, callback) => {
    if (value === initialValue) {
      return callback();
    }
    setLoading(true);

    let findTei = null;

    if (offlineStatus) {
      findTei = trackedEntityManager.getTrackedEntityInstances({
        orgUnit: selectedOrgUnit.id,
        filters: [`attribute=${id}:EQ:${value}`],
      });
    } else {
      console.log("???", programMetadata.id);
      findTei = dataApi.findTei(selectedOrgUnit.id, programMetadata.id, [
        {
          attribute: id,
          value,
        },
      ]);
    }

    return findTei.then((json) => {
      console.log({ json });
      setLoading(false);
      if (json.instances) {
        if (json.instances.length > 0) {
          return callback(
            new Error(
              t("uniqueFormNoError", {
                number: value,
                orgName: selectedOrgUnit.displayName,
              })
            )
          );
        }
      }
      callback();
      // setValidValue(value);
      // setUniqueFormNoNumber(value);
    });
  };

  return (
    <LoadingFormNoInput
      loading={loading}
      mask
      loaded={true}
      checkUnique={checkUnique}
      id={id}
      {...props}
    />
  );
};

export default FormNoInputContainer;
