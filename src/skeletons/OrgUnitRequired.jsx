import React, { useMemo } from "react";
import withError from "../hocs/withFeedback/withError";
import { useTranslation } from "react-i18next";

const OrgUnitRequired = () => {
  const { t } = useTranslation();
  const Component = useMemo(() => withError()(() => null), []);
  return <Component errorMessage={t("orgUnitRequired")} errorDisplaying={t("orgUnitRequired")} />;
};

export default OrgUnitRequired;
