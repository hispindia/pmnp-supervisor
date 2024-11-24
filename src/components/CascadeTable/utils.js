import React from "react";
import { generateUid } from "@/utils";
import _ from "lodash";

const transformMetadataToColumns = (metadata, locale, dataValuesTranslate) => {
  const cols = [];
  metadata
    .filter((e) => e.displayInList)
    .forEach((e) => {
      const ele = e.trackedEntityAttribute;

      let textFields = !_.isEmpty(ele.translations)
        ? ele.translations[locale]
        : ele.displayName;
      const colC = {
        dataField: ele.id,
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
    let displayValue = d[md.id];
    if (dataValuesTranslate) {
      displayValue = dataValuesTranslate[d[md.id]]
        ? dataValuesTranslate[d[md.id]][locale]
          ? dataValuesTranslate[d[md.id]][locale]
          : d[md.id]
        : d[md.id];
    }
    d[md.id] = displayValue;
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
        let displayValue = d[md.id];
        if (dataValuesTranslate) {
          displayValue = dataValuesTranslate[md.id][d[md.id]]
            ? dataValuesTranslate[md.id][d[md.id]][locale]
              ? dataValuesTranslate[md.id][d[md.id]][locale]
              : d[md.id]
            : d[md.id];
        }
        d[md.id] = displayValue;
      });
  });

  return datas_clone;
};

export { transformMetadataToColumns, transformData, transformD };
