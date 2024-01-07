import React from "react";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import {
  calculatePopulationAggregatedData,
  labels
} from "../adapters/aggregate_population";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useTranslation } from "react-i18next";
import sum from 'lodash/sum';

const useTableCellStyles = makeStyles({
  root: {
    minWidth: 50,
    textAlign: "center",
    border: `1px solid rgba(224, 224, 224, 1)`
  }
});

function PopulationDetailTable({ data, forwardingRef }) {
  const tableCellStyle = useTableCellStyles();
  const [
    maleAggregatedData,
    femaleAggregatedData
  ] = calculatePopulationAggregatedData(data);
  const { t } = useTranslation();
  const TableRows = labels.map((label, index) => {
    return (
      <TableRow key={index}>
        <TableCell key={1} classes={tableCellStyle}>
          {label}
        </TableCell>
        <TableCell key={2} classes={tableCellStyle}>
          {maleAggregatedData[index] + femaleAggregatedData[index]}
        </TableCell>
      </TableRow>
    );
  }).concat([<TableRow key={"total"}>
      <TableCell key={1} classes={tableCellStyle}>
          {t("total")}
      </TableCell>
      <TableCell key={2} classes={tableCellStyle}>
          {sum(maleAggregatedData.concat(femaleAggregatedData))}
      </TableCell>
  </TableRow>]);
  return (
    <TableContainer component={Paper}>
      <Table ref={forwardingRef}>
        <TableHead>
          <TableRow>
            <TableCell key={1} classes={tableCellStyle}>
              {t("age")}
            </TableCell>
            <TableCell key={2} classes={tableCellStyle}>
              {t("total")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{TableRows}</TableBody>
      </Table>
    </TableContainer>
  );
}

PopulationDetailTable.propTypes = {};
PopulationDetailTable.defaultProps = {};

export default PopulationDetailTable;
