import React, { forwardRef } from "react";
import { HorizontalBar } from "react-chartjs-2";
import { PropTypes } from "prop-types";

const PyramidChart = ({ groupLabels, labels, data, title, forwardingRef }) => {
  const maxDataValue = Math.max(Math.max(...data[0]), Math.max(...data[1]));
  let step =
    "5" +
    Array.from(
      {
        length: maxDataValue.toString().length - 2
      },
      () => "0"
    ).join("");
  step = +step;
  let bound = Math.ceil(maxDataValue / step) * step;
  const barChartData = {
    labels,
    datasets: [
      {
        barPercentage: 1,
        label: groupLabels[0],
        stack: "Stack 0",
        backgroundColor: "#3349B1",
        data: data[0].map(k => -k)
      },
      {
        barPercentage: 1,
        label: groupLabels[1],
        stack: "Stack 0",
        backgroundColor: "#E46DCB",
        data: data[1]
      }
    ]
  };
  return (
    <HorizontalBar
      ref={forwardingRef}
      data={barChartData}
      options={{
        plugins: {
          datalabels: {
            formatter: function(value) {
              return Math.abs(value);
            },
            color: "#fff"
          }
        },
        title: {
          position: "top",
          fontSize: 18,
          display: true,
          text: title
        },
        tooltips: {
          intersect: false,
          callbacks: {
            label: c => {
              const value = Number(c.value);
              const positiveOnly = value < 0 ? -value : value;
              let retStr = "";
              if (c.datasetIndex === 0) {
                retStr += `${groupLabels[0]}: ${positiveOnly.toString()}`;
              } else {
                retStr += `${groupLabels[1]}: ${positiveOnly.toString()}`;
              }
              return retStr;
            }
          }
        },
        responsive: true,
        legend: {
          position: "bottom"
        },
        scales: {
          xAxes: [
            {
              stacked: false,
              ticks: {
                beginAtZero: true,
                callback: (v, index, values) => {
                  return v < 0 ? -v : v;
                },
                max: bound,
                min: -bound
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true
              },
              position: "left"
            }
          ]
        }
      }}
    />
  );
};

PyramidChart.propTypes = {
  groupLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.array.isRequired,
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  title: PropTypes.string
};

PyramidChart.defaultPropTypes = {
  title: ""
};

export default forwardRef(PyramidChart);
