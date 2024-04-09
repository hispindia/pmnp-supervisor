import React from "react";
import HighPieChart from "../components/HighPieChart";
import {
  calculatePersonnelAggregatedData,
  labels
} from "../adapters/aggregate_personnel";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const PersonnelPlacePieChart = ({ data, forwardingRef }) => {
  const personnelAggregatedData = calculatePersonnelAggregatedData(data);
  const { t } = useTranslation();

  return (
    <HighPieChart
      forwardingRef={forwardingRef}
      data={personnelAggregatedData}
      labels={labels.map(key => t(key))}
      title={t("deliveryByPersonnel")}
    />
  );
};

PersonnelPlacePieChart.propTypes = {
  data: PropTypes.object.isRequired
};

export default PersonnelPlacePieChart;
