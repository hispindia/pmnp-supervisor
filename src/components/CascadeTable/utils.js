import React from "react";
import { generateUid } from "@/utils";
import _ from "lodash";

const transformMetadataToColumns = (metadata, locale, dataValuesTranslate) => {
  const cols = [];
  metadata
    .filter((e) => !e.hiddenCol)
    .forEach((ele) => {
      let textFields = !_.isEmpty(ele.translations)
        ? ele.translations[locale]
        : ele.displayName;
      const colC = {
        dataField: ele.code,
        text: textFields,
      };
      // additionCol
      if (ele.additionCol)
        colC.classes = (cell, row, rowIndex, colIndex) => {
          return "additionCol";
        };

      // Custom classes
      if (ele.classes) colC.classes = ele.classes;
      if (ele.formatter) colC.formatter = ele.formatter;
      if (ele.formatExtraData) colC.formatExtraData = ele.formatExtraData;

      if (ele.valueSet) {
        colC.formatter = (cellContent, row, rowIndex, extraData) => {
          let displayValue = cellContent;

          if (dataValuesTranslate) {
            displayValue = dataValuesTranslate[cellContent]
              ? dataValuesTranslate[cellContent][locale]
                ? dataValuesTranslate[cellContent][locale]
                : cellContent
              : cellContent;
          }
          return displayValue;
        };
      }

      cols.push(colC);
    });
  return cols;
};

const transformD = (metadata, data, dataValuesTranslate, locale) => {
  let d = JSON.parse(JSON.stringify(data));

  if (d.id == null) {
    d.id = generateUid();
  }

  metadata.forEach((md) => {
    let displayValue = d[md.code];
    if (dataValuesTranslate) {
      displayValue = dataValuesTranslate[d[md.code]]
        ? dataValuesTranslate[d[md.code]][locale]
          ? dataValuesTranslate[d[md.code]][locale]
          : d[md.code]
        : d[md.code];
    }
    d[md.code] = displayValue;
  });
  return d;
};

// Use to transform data to display in table. For example: head -> Head of family
const transformData = (metadata, datas, dataValuesTranslate, locale) => {
  let datas_clone = JSON.parse(JSON.stringify(datas));

  // missing uid
  datas_clone.forEach((d) => {
    if (d.id == null) {
      d.id = generateUid();
    }

    metadata
      .filter((e) => e.valueSet && e.valueSet.length > 0)
      .forEach((md) => {
        let displayValue = d[md.code];
        if (dataValuesTranslate) {
          displayValue = dataValuesTranslate[md.code][d[md.code]]
            ? dataValuesTranslate[md.code][d[md.code]][locale]
              ? dataValuesTranslate[md.code][d[md.code]][locale]
              : d[md.code]
            : d[md.code];
        }
        d[md.code] = displayValue;
      });
  });

  return datas_clone;
};

export { transformMetadataToColumns, transformData, transformD };
