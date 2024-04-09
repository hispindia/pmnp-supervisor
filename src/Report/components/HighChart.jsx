import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import exporting from "highcharts/modules/exporting";

exporting(Highcharts);

function HighChart({
  options,
  forwardingRef,
}) {
  return (
    <HighchartsReact
      ref={forwardingRef}
      highcharts={Highcharts}
      options={options}
    />
  );
}

HighChart.propTypes = {};
HighChart.defaultProps = {};

export default HighChart;
