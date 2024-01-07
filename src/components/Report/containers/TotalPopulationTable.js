import React from "react";
import { useTranslation } from "react-i18next";
import { calculateTotalPopulation } from "../adapters/calculate_total_population";
import HorizontalTable from "../components/HorizontalTable";

function TotalPopulationTable({ data, forwardingRef }) {
  const { t } = useTranslation();
  const years = data.metaData.dimensions.pe;
  return (
    <HorizontalTable
      title={t("totalPopulation")}
      data={calculateTotalPopulation(data)}
      labels={years}
      forwardingRef={forwardingRef}
    />
  );
}

TotalPopulationTable.propTypes = {};
TotalPopulationTable.defaultProps = {};

export default TotalPopulationTable;
