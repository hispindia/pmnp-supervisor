import React from "react";
import PropTypes from "prop-types";
import {
  calculateAggregatedMortalityData,
  labels,
} from "../adapters/aggregate_mortality";
import { useTranslation } from "react-i18next";
import ColumnHighChart from "../components/ColumnHighChart";

function MortalityBarChart({ data, forwardingRef }) {
  const aggregatedMortalityData = calculateAggregatedMortalityData(data);
  const { t } = useTranslation();

  return (
    <ColumnHighChart
      labels={labels.map((key) => t(key))}
      title={t("mortalityDetails")}
      data={aggregatedMortalityData}
      forwardingRef={forwardingRef}
    />
  );
}

MortalityBarChart.propTypes = {
  data: PropTypes.object.isRequired,
};
MortalityBarChart.defaultProps = {};

export default MortalityBarChart;
