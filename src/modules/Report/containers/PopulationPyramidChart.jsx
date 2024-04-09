import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  calculatePopulationAggregatedData,
  labels,
} from "../adapters/aggregate_population";
import HighChart from "../components/HighChart";

const PopulationPyramidChart = ({ data, forwardingRef }) => {
  const [
    maleAggregatedData,
    femaleAggregatedData,
  ] = calculatePopulationAggregatedData(data);
  const { t } = useTranslation();
  return (
    <HighChart
      options={{
        chart: {
          type: "bar",
          height: 600,
        },
        title: {
          text: t("populationDetails"),
        },
        xAxis: [
          {
            categories: labels,
            reversed: true,
            labels: {
              step: 1,
            },
          },
          // {
          //   // mirror axis on right side
          //   opposite: true,
          //   reversed: false,
          //   categories: labels,
          //   linkedTo: 0,
          //   labels: {
          //     step: 1,
          //   },
          // },
        ],
        yAxis: {
          title: {
            text: null,
          },
          labels: {
            formatter: function () {
              return Math.abs(this.value);
            },
          },
        },

        plotOptions: {
          series: {
            stacking: "normal",
            // color: "red",
            pointWidth: 45,
            // pointPadding: 10,
            // groupPadding: 1,
            // pointPadding: 1,
          },
          bar: {
            // groupPadding: 1,
            // pointPadding: 10,
            dataLabels: {
              // verticalAlign: 'center',
              // align: 'center',
              // x: -10,
              inside: false,
              style: {
                color: "black",
              },
              // y: 0,
              // align: 'right',
              // allowOverlap: true,
              enabled: true,
              formatter: function () {
                return Math.abs(this.point.y);
              },
            },
          },
        },
        tooltip: {
          formatter: function () {
            return (
              "<b>" +
              this.series.name +
              ", age " +
              this.point.category +
              "</b><br/>" +
              "Population: " +
              Math.abs(this.point.y)
            );
          },
        },

        series: [
          {
            name: t("male"),
            data: maleAggregatedData.map((data) => -data),
            color: "#3349B1",
          },
          {
            name: t("female"),
            data: femaleAggregatedData,
            color: "#E46DCB",
          },
        ],
      }}
      forwardingRef={forwardingRef}
    />
  );
};

PopulationPyramidChart.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PopulationPyramidChart;
