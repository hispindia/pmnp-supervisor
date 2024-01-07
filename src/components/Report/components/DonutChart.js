import { Doughnut } from "react-chartjs-2";
import React from "react";
import { COLORS } from "./styles";

function DonutChart({ data, title, labels, forwardingRef }) {
  const options = {
    plugins: {
      // Change options for ALL labels of THIS CHART
      datalabels: {
        anchor: "end",
        color: "#36A2EB",
        align: "-45"
      }
    },
    title: {
      position: "top",
      fontSize: 18,
      display: true,
      text: title
    },
    responsive: true
  };
  return (
    <Doughnut
      ref={forwardingRef}
      data={{
        labels,
        datasets: [
          {
            maxBarThickness: 45,
            backgroundColor: COLORS,
            data
          }
        ]
      }}
      options={options}
      legend={{
        position: "bottom"
      }}
    />
  );
}

DonutChart.propTypes = {};
DonutChart.defaultProps = {};

export default DonutChart;
