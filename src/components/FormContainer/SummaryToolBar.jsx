// node_modules
import React from "react";
import { Button, Card, Modal } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

import "./fonts/Phetsarath-normal";

// Styles
import styles from "./FormContainer.module.css";
const {} = styles;

const SummaryToolBar = ({}) => {
  const doc = new jsPDF("l", "pt", "a4");

  const centeredText = (text, y) => {
    var xOffsetReport =
      doc.internal.pageSize.width / 2 -
      (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / 2;

    doc.setFont("Phetsarath");
    doc.text(text, xOffsetReport, y);
  };

  const exportPDFSummaryReport = (idTable) => {
    const finalY = doc.lastAutoTable.finalY || 10;
    doc.setFont("Phetsarath");
    idTable.forEach((ite, position) => {
      doc.autoTable({
        html: ite,
        startY: position == 0 && finalY + 75,
        pageBreak: "auto",
        useCss: true,
        styles: {
          halign: "left",
          paddingTop: "30px",
          font: "Phetsarath",
        },
        columnStyles: {
          text: { cellWidth: "auto" },
          id: {
            halign: "right",
          },
          0: {
            cellWidth: 100,
            bold: 500,
          },
        },
        willDrawCell: (data) => {
          doc.setFont("Phetsarath");
        },
      });
      if (position < idTable.length - 1) {
        // doc.addPage();
      }
    });
    doc.save(`Family Summary Report.pdf`);
  };

  const exportPDF = () => {
    let idTable = ["#ageGroupTable", "#ethnicityTable", "#insuranceTable"];
    exportPDFSummaryReport(idTable);
  };

  return (
    <Grid item xs={12}>
      <Button variant="outline-primary" onClick={(e) => exportPDF()}>
        <FontAwesomeIcon icon={faFilePdf} size="lg" />
      </Button>
    </Grid>
  );
};

SummaryToolBar.propTypes = {};

export default SummaryToolBar;
