import React from "react";
import HighPieChart from "../components/HighPieChart";
// import PieChart from "../components/PieChart";
import {
  calculateDeliveryPlaceAggregatedData,
  labels
} from "../adapters/aggregate_delivery_place";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const DeliveryPlacePieChart = ({ data, forwardingRef }) => {
  const deliveryPlaceAggregatedData = calculateDeliveryPlaceAggregatedData(
    data
  );
  const { t } = useTranslation();

  return (
    <HighPieChart
      forwardingRef={forwardingRef}
      data={deliveryPlaceAggregatedData}
      labels={labels.map(key => t(key))}
      title={t("placeOfDelivery")}
    />
  );
};

DeliveryPlacePieChart.propTypes = {
  data: PropTypes.object.isRequired
};

export default DeliveryPlacePieChart;
