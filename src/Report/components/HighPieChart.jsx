import React from "react";
import { COLORS } from "./styles";
import MyHighChart from "./HighChart";

function HighPieChart({ data, labels, title, isDonut = false, forwardingRef }) {
  const options = {
    legend: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}",
        },
      },
    },
    chart: {
      type: "pie",
    },
    title: {
      text: title,
    },
    series: [
      {
        showInLegend: true,
        innerSize: isDonut ? "50%" : 0,
        name: title,
        data: labels.map((label, index) => ({
          name: label,
          y: data[index],
          color: COLORS[index],
        })),
      },
    ],
  };
  return <MyHighChart forwardingRef={forwardingRef} options={options} />;
}

HighPieChart.propTypes = {};
HighPieChart.defaultProps = {};

export default HighPieChart;
