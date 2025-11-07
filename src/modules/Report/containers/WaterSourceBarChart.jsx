import React from "react";
import {
  calculateWaterSourceAggregatedData,
  getOptionLabels
} from "../adapters/aggregate_water_source";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ColumnHighChart from "../components/ColumnHighChart";

function WaterSource({ data, forwardingRef }) {
  const labels = getOptionLabels(data);
  const waterSourceAggregatedData = calculateWaterSourceAggregatedData(data);
  const { t } = useTranslation();
  return (
    <ColumnHighChart
      forwardingRef={forwardingRef}
      labels={labels}
      title={t("familyDrinkingWaterSource")}
      data={waterSourceAggregatedData}
    />
  );
}

WaterSource.propTypes = {
  data: PropTypes.object.isRequired
};
WaterSource.defaultProps = {};

export default WaterSource;
