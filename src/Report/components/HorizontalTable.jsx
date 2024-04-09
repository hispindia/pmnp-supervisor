import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { sum } from "../adapters/utils";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const useTableCellStyles = makeStyles({
  root: {
    minWidth: 50,
    textAlign: "center",
    border: `1px solid rgba(224, 224, 224, 1)`,
  },
});

const useTableStyles = makeStyles({
  root: {
    width: "auto",
    textAlign: "center",
    tableLayout: "auto",
  },
});

function HorizontalTable({ forwardingRef, labels, title, data }) {
  const tableCellStyle = useTableCellStyles();
  const tableStyle = useTableStyles();
  const { t } = useTranslation();
  const totalTitle = t("total");
  let HeaderCells = [];
  let DataCells = [];
  if (labels.length > 1) {
    HeaderCells = HeaderCells.concat(
      <TableCell key="head" classes={tableCellStyle} rowSpan={2}>
        <strong>{title}</strong>
      </TableCell>,
      labels.map((label) => (
        <TableCell key={label} classes={tableCellStyle}>
          {label}
        </TableCell>
      )),
      <TableCell key="total" classes={tableCellStyle}>
        {totalTitle}
      </TableCell>
    );
    DataCells = DataCells.concat(
      labels.map((year, index) => (
        <TableCell key={year} classes={tableCellStyle}>
          {data[index]}
        </TableCell>
      ))
    );
  } else {
    DataCells = DataCells.concat(
      <TableCell key="total-head" classes={tableCellStyle}>
        <strong>{title}</strong>
      </TableCell>
    );
  }
  DataCells = DataCells.concat(
    <TableCell key="total-cell" classes={tableCellStyle}>
      <strong>{sum(data)}</strong>
    </TableCell>
  );

  return (
    <TableContainer>
      <Table ref={forwardingRef} classes={tableStyle}>
        <TableBody>
          {HeaderCells.length ? (
            <TableRow key={1}>{HeaderCells}</TableRow>
          ) : null}
          <TableRow key={2}>{DataCells}</TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

HorizontalTable.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.number),
  title: PropTypes.string.isRequired,
};
HorizontalTable.defaultProps = {
  labels: [],
  data: [],
};

export default HorizontalTable;
