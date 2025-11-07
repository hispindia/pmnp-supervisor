// node_modules
import React from "react";
import moment from "moment";

import { useTranslation } from "react-i18next";

const ColumnByYear = ({ event, dataElementId }) => {
  return <td>{event.dataValues[`${dataElementId}`] || ""}</td>;
};

const Ethnicity = ({ transformedEvents }) => {
  const { t } = useTranslation();
  return (
    <table
      className="table table-bordered table-sm table-striped text-center"
      id="ethnicityTable"
    >
      <tbody>
        <tr>
          <td>
            <strong>{t("ethnicity")}</strong>
          </td>
          {transformedEvents.map((e) => (
            <td>{moment(e.occurredAt).format("YYYY")}</td>
          ))}
        </tr>
        <tr>
          <td>{t("laoTai")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"HJCjFyZe3fd"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("monKhmer")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"ueeqalP1NnB"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("hmongMien")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"NnsZ7Yq0ZMl"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("chineseTibet")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"AZULo0fgAPA"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("others")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"jObBjI31SHJ"}
            ></ColumnByYear>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default Ethnicity;
