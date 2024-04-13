// node_modules
import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ColumnByYear = ({ event, dataElementId }) => {
  return <td>{event.dataValues[`${dataElementId}`] || ""}</td>;
};

const Insurance = ({ transformedEvents }) => {
  const { t } = useTranslation();
  return (
    <table
      className="table table-bordered table-sm table-striped text-center"
      id="insuranceTable"
    >
      <tbody>
        <tr>
          <td>
            <strong>{t("insurance")}</strong>
          </td>
          {transformedEvents.map((e) => (
            <td>{moment(e.occurredAt).format("YYYY")}</td>
          ))}
        </tr>
        <tr>
          <td>{t("sasssso")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"bXy7dRTxSUN"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("mps")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"Pwttxh8qzbh"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("nhi")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"qMEd4h2s2jA"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("chi")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"SyPLRSV1NCn"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("phi")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"Oov8I1ZmXo3"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("dh")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"C2zynun5YMh"}
            ></ColumnByYear>
          ))}
        </tr>
        <tr>
          <td>{t("dn")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"fqdxmeIjMGq"}
            ></ColumnByYear>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default Insurance;
