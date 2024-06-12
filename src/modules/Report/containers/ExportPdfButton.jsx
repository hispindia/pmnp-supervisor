import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
// import "svg2pdf.js";
import {
  exportHighChart,
  toImageData,
  convertSVGToBase64,
} from "../services/hightchart";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import "./fonts/Phetsarath-normal";

const PADDING_BOT = 5;
const PAGE_MARGIN = 10;

function ExportPdfButton({ forwardingRefs, selectedOrgUnit, year }) {
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const exportPdf = async (e) => {
    setIsSaving(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const getCanvasRatioSize = (canvas) => {
        const width = pdf.internal.pageSize.width - PAGE_MARGIN * 2;
        const height = (width * +canvas.height) / +canvas.width;
        return {
          width,
          height,
        };
      };
      const centeredText = (text, y) => {
        const dim = pdf.getTextDimensions(text);
        const xOffsetReport = pdf.internal.pageSize.width / 2 - dim.w / 2;
        pdf.text(text, xOffsetReport, y);
        return (y += dim.h + PADDING_BOT);
      };
      pdf.setFont("Phetsarath");
      let offsetY = PAGE_MARGIN;
      offsetY = centeredText(t("familyInformationReport"), offsetY);
      offsetY = centeredText(`${selectedOrgUnit.displayName}`, offsetY);
      offsetY = centeredText(`Year: ${year.split(";").join(" - ")}`, offsetY);
      for (let i = 0; i < forwardingRefs.length; i++) {
        const ref = forwardingRefs[i];
        if (ref.current) {
          switch (true) {
            case ref.current.tagName === "TABLE": {
              pdf.autoTable({
                html: ref.current,
                startY: offsetY,
                useCss: true,
                styles: {
                  align: "left",
                  font: "Phetsarath",
                },
                tableWidth: "auto",
                columnStyles: {
                  text: { cellWidth: "auto" },
                  id: {
                    align: "right",
                  },
                  0: {
                    cellWidth: 100,
                    bold: 500,
                  },
                },
              });
              offsetY = pdf.lastAutoTable.finalY + PADDING_BOT;
              break;
            }
            case !!ref.current.chartInstance: {
              const canvas = ref.current.chartInstance.canvas;
              const { width, height } = getCanvasRatioSize(canvas);
              const nextOffsetY = offsetY + height + PADDING_BOT;
              if (nextOffsetY > pdf.internal.pageSize.height) {
                pdf.addPage("a4");
                offsetY = PAGE_MARGIN;
              }
              pdf.addImage(
                canvas.toDataURL(),
                "PNG",
                PAGE_MARGIN,
                offsetY,
                width,
                height
              );
              offsetY += height + PADDING_BOT;
              break;
            }
            case !!ref.current.chart: {
              try {
                let svgString = ref.current.chart.getSVG();
                const imageData = await convertSVGToBase64(svgString);
                const width = 190;
                const height = 120;
                const nextOffsetY = offsetY + height + PADDING_BOT;
                if (nextOffsetY > pdf.internal.pageSize.height) {
                  pdf.addPage("a4");
                  offsetY = PAGE_MARGIN;
                }
                pdf.addImage(
                  imageData,
                  "PNG",
                  PAGE_MARGIN,
                  offsetY,
                  width,
                  height
                );
                offsetY += height + PADDING_BOT;
              } catch (error) {
                console.log(error);
              }
            }
          }
        }
      }
      pdf.save(
        `${t("familyInformationReport")}_${
          selectedOrgUnit.displayName
        }_${year}.pdf`
      );
    } catch (e) {
      console.log(e);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Button
        disabled={isSaving}
        onClick={exportPdf}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          transform: "translate(-25%, calc(100% + 25px))",
        }}
        variant="outline-primary"
      >
        {isSaving ? (
          <FontAwesomeIcon icon={faSpinner} size="lg" spin={true} />
        ) : (
          <FontAwesomeIcon icon={faFilePdf} size="lg" />
        )}
      </Button>
    </div>
  );
}

ExportPdfButton.propTypes = {};
ExportPdfButton.defaultProps = {
  isSaving: false,
};

export default ExportPdfButton;
