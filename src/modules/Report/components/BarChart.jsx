import { Bar } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import React from "react";

function BarChart({ data, title, labels, forwardingRef }) {
  const options = {
    title: {
      position: "top",
      fontSize: 18,
      display: true,
      text: title
    },
    plugins: {
      // Change options for ALL labels of THIS CHART
      datalabels: {
        anchor: "end",
        color: "#111111",
        align: "top"
      }
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            maxBarThickness: 45,
            backgroundColor: "#3349B1",
            data
          }
        ]
      }}
      options={options}
      legend={{
        display: false
      }}
      ref={forwardingRef}
    />
  );
}

BarChart.propTypes = {};
BarChart.defaultProps = {};

export default BarChart;
