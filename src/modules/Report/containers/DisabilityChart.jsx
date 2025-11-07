import React from "react";
import PropTypes from "prop-types";
import {
  calculateAggregatedDisabilityData,
  labels,
} from "../adapters/aggregate_disability";
import { COLORS } from "../components/styles";
import { useTranslation } from "react-i18next";
import HighChart from "../components/HighChart";

function DisabilityChart({ data, forwardingRef }) {
  const aggregatedDisabilityData = calculateAggregatedDisabilityData(data);
  const { t } = useTranslation();

  return (
    <HighChart
      forwardingRef={forwardingRef}
      options={{
        chart: {
          type: "column",
        },
        title: {
          text: t("personWithTypeOfDisability"),
        },
        xAxis: {
          categories: labels.map((key) => t(key)),
        },
        yAxis: {
          min: 0,
          stackLabels: {
            enabled: true,
          },
          title: {
            text: null,
          },
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
            },
            pointWidth: 45,
          },
        },
        series: [
          {
            name: t("some"),
            data: aggregatedDisabilityData[0],
            color: COLORS[0],
          },
          {
            name: t("alot"),
            data: aggregatedDisabilityData[1],
            color: COLORS[1],
          },
          {
            name: t("fullyDisable"),
            data: aggregatedDisabilityData[2],
            color: COLORS[2],
          },
        ],
      }}
    />
  );
}

DisabilityChart.propTypes = {
  data: PropTypes.object.isRequired,
};
DisabilityChart.defaultProps = {};

export default DisabilityChart;
