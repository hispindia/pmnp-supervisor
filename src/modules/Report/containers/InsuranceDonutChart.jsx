import HighPieChart from "../components/HighPieChart";
import React from "react";
import {
  calculateInsuranceAggregatedData,
  labels,
} from "../adapters/aggregate_insurance";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function InsuranceDonutChart({ data, forwardingRef }) {
  const insuranceAggregatedData = calculateInsuranceAggregatedData(data);

  const { t } = useTranslation();
  return (
    <HighPieChart
      forwardingRef={forwardingRef}
      isDonut={true}
      data={insuranceAggregatedData}
      labels={labels.map((key) => t(key))}
      title={t("insuranceDetails")}
    />
  );
}

InsuranceDonutChart.propTypes = {
  data: PropTypes.object.isRequired,
};
InsuranceDonutChart.defaultProps = {};

export default InsuranceDonutChart;
