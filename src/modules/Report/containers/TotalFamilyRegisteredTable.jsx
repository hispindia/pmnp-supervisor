import React from "react";
import { useTranslation } from "react-i18next";
import { calculateTotalFamilyRegisteredData } from "../adapters/calculate_total_family_registered";
import HorizontalTable from "../components/HorizontalTable";

function TotalFamilyRegisteredTable({ data, forwardingRef }) {
  const { t } = useTranslation();
  const years = data.metaData.dimensions.pe;
  console.log(calculateTotalFamilyRegisteredData(data));
  return (
    <HorizontalTable
      title={t("totalFamilyRegistered")}
      data={calculateTotalFamilyRegisteredData(data)}
      labels={years}
      forwardingRef={forwardingRef}
    />
  );
  // const tableCellStyle = useTableCellStyles();
  // const tableStyle = useTableStyles();
  // const { t } = useTranslation();
  // const years = data.metaData.dimensions.pe;
  // const totals = calculatePopulationTotalData(data);
  // const totalFamilyRegisteredText = t("totalFamilyRegistered");
  // const totalText = t("total");
  // let HeaderCells = [];
  // let DataCells = [];
  // if (years.length > 1) {
  //   HeaderCells = HeaderCells.concat(
  //     <TableCell key="head" classes={tableCellStyle} rowSpan={2}>
  //       <strong>{totalFamilyRegisteredText}</strong>
  //     </TableCell>,
  //     years.map((year) => (
  //       <TableCell key={year} classes={tableCellStyle}>
  //         {year}
  //       </TableCell>
  //     )),
  //     <TableCell key="total" classes={tableCellStyle}>
  //       {totalText}
  //     </TableCell>
  //   );
  //   DataCells = DataCells.concat(
  //     years.map((year, index) => (
  //       <TableCell key={year} classes={tableCellStyle}>
  //         {totals[index]}
  //       </TableCell>
  //     ))
  //   );
  // } else {
  //   DataCells = DataCells.concat(
  //     <TableCell key="total-head" classes={tableCellStyle}>
  //       <strong>{totalFamilyRegisteredText}</strong>
  //     </TableCell>
  //   );
  // }
  // DataCells = DataCells.concat(
  //   <TableCell key="total-cell" classes={tableCellStyle}>
  //     <strong>{sum(totals)}</strong>
  //   </TableCell>
  // );
  //
  // return (
  //   <TableContainer>
  //     <Table ref={forwardingRef} classes={tableStyle}>
  //       <TableBody>
  //         {HeaderCells.length ? (
  //           <TableRow key={1}>{HeaderCells}</TableRow>
  //         ) : null}
  //         <TableRow key={2}>{DataCells}</TableRow>
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );
}

TotalFamilyRegisteredTable.propTypes = {};
TotalFamilyRegisteredTable.defaultProps = {};

export default TotalFamilyRegisteredTable;
