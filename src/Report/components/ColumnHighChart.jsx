import React from "react";
import MyHighChart from "./HighChart";

function ColumnHighChart({ data, labels, title, forwardingRef }) {
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: title,
    },
    xAxis: {
      categories: labels,
      title: {
        text: null,
      },
      labels: {
        overflow: "justify",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: null
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
        formatter: function () {
            return this.y;
        },
        enabled: false
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
        },
        pointWidth: 45
      },
    },
    legend: {
      enabled: false
    },
    series: [
      {
        data,
        color: "#3349B1",
      },
    ],
  };
  return <MyHighChart forwardingRef={forwardingRef} options={options} />;
}

ColumnHighChart.propTypes = {};
ColumnHighChart.defaultProps = {};

export default ColumnHighChart;
