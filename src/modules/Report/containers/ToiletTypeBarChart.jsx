import React from "react";
import {
  calculateToiletTypeAggregatedData,
  getOptionLabels
} from "../adapters/aggregate_toilet_type";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ColumnHighChart from "../components/ColumnHighChart";

function ToiletTypeBarChart({ data, forwardingRef }) {
  const labels = getOptionLabels(data);
  const toiletTypeAggregatedData = calculateToiletTypeAggregatedData(data);
  const { t } = useTranslation();

  return (
    <ColumnHighChart
      forwardingRef={forwardingRef}
      labels={labels}
      title={t("toiletType")}
      data={toiletTypeAggregatedData}
    />
  );
}

ToiletTypeBarChart.propTypes = {
  data: PropTypes.object.isRequired
};
ToiletTypeBarChart.defaultProps = {};

export default ToiletTypeBarChart;
