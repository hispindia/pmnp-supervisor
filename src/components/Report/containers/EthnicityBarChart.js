import React from "react";
import {
  calculateEthnicityAggregatedData,
  labels,
} from "../adapters/aggregate_ethnicity";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ColumnHighChart from "../components/ColumnHighChart";

function EthnicityBarChart({ data, forwardingRef }) {
  const ethnicityAggregatedData = calculateEthnicityAggregatedData(data);
  const { t } = useTranslation();
  return (
    <ColumnHighChart
      labels={labels.map((key) => t(key))}
      data={ethnicityAggregatedData}
      title={t("ethnicityDetails")}
      forwardingRef={forwardingRef}
    />
  );
}

EthnicityBarChart.propTypes = {
  data: PropTypes.object.isRequired,
};
EthnicityBarChart.defaultProps = {};

export default EthnicityBarChart;
