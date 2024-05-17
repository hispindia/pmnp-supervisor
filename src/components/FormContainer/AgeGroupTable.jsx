// node_modules
import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ColumnByYear = ({ event, dataElementId }) => {
  return <td>{event.dataValues[`${dataElementId}`] || ""}</td>;
};

const AgeGroupTable = ({ transformedEvents }) => {
  const { t } = useTranslation();
  const rowSpan = 2;

  return (
    <table
      className="table table-bordered table-sm text-center"
      id="ageGroupTable"
    >
      <tbody>
        <tr>
          <td>
            <strong>{t("memberDetails")}</strong>
          </td>
          <td>{t("gender")}</td>
          {transformedEvents.map((e) => (
            <td>{moment(e.occurredAt).format("YYYY")}</td>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            &lt; 1 {t("years")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"Eqi1288N8Nd"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"eDwcbrF4Qsr"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            1 {t("years")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"hx5FKOqT18B"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>

          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"xllqsmDiexq"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            2-4 {t("years")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"cz6oa275ize"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>

          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"DG9EvDsL801"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            5-14 {t("years")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"S91BBc2Op9Z"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>

          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"qaAsAc4DBlE"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            15-44 {t("years")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"yHQ9LbhuLPh"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"CCtvT9h1yB4"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            45-49 {t("years")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"osp7h6GLyV8"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"Gf8F7hQqygz"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            50-59 {t("years")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"GTEknIuyEiO"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"AI5nHnkf5WR"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            60 {t("years")} &amp; up
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"y9zGBpMBAhQ"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"dE6mw0hXdAt"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" rowspan={rowSpan}>
            {t("total")}
          </td>
          <td name="translation">{t("male")}</td>
          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"SHCRzRWFaii"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation">{t("female")}</td>

          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"PFwymX0Io0y"}
            ></ColumnByYear>
          ))}
        </tr>

        <tr>
          <td name="translation" colspan="2">
            {t("grandTotal")}
          </td>

          {transformedEvents.map((e) => (
            <ColumnByYear
              event={e}
              dataElementId={"Va3FC8Io1b0"}
            ></ColumnByYear>
          ))}
        </tr>
      </tbody>
    </table>
  );

  // return (
  //   <div className="col-md-12 order-md-12 mb-12">
  //     <table className="table table-bordered table-sm table-striped text-center">
  //       <tbody>
  //         <tr>
  //           <td colSpan="20">Members by Age Group and Sex</td>
  //         </tr>
  //         <tr>
  //           <td colSpan="2">&lt; 1 year</td>
  //           <td colSpan="2">1 year old</td>
  //           <td colSpan="2">2-4 years</td>
  //           <td colSpan="2">5-14 years</td>
  //           <td colSpan="2">15-44 years</td>
  //           <td colSpan="2">45-49 years</td>
  //           <td colSpan="2">50-59 years</td>
  //           <td colSpan="2">60 years &amp; up</td>
  //           <td colSpan="2">Total</td>
  //           <td rowSpan="2">Grand Total</td>
  //         </tr>
  //         <tr>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //           <td class="contentTrans">{t("male")}</td>
  //           <td class="contentTrans">{t("female")}</td>
  //         </tr>

  //         <tr>
  //           <td>{currentEvent.dataValues["Eqi1288N8Nd"] || ""}</td>
  //           <td>{currentEvent.dataValues["eDwcbrF4Qsr"] || ""}</td>
  //           <td>{currentEvent.dataValues["hx5FKOqT18B"] || ""}</td>
  //           <td>{currentEvent.dataValues["xllqsmDiexq"] || ""}</td>
  //           <td>{currentEvent.dataValues["cz6oa275ize"] || ""}</td>
  //           <td>{currentEvent.dataValues["DG9EvDsL801"] || ""}</td>
  //           <td>{currentEvent.dataValues["S91BBc2Op9Z"] || ""}</td>
  //           <td>{currentEvent.dataValues["qaAsAc4DBlE"] || ""}</td>
  //           <td>{currentEvent.dataValues["yHQ9LbhuLPh"] || ""}</td>
  //           <td>{currentEvent.dataValues["CCtvT9h1yB4"] || ""}</td>
  //           <td>{currentEvent.dataValues["osp7h6GLyV8"] || ""}</td>
  //           <td>{currentEvent.dataValues["Gf8F7hQqygz"] || ""}</td>
  //           <td>{currentEvent.dataValues["GTEknIuyEiO"] || ""}</td>
  //           <td>{currentEvent.dataValues["AI5nHnkf5WR"] || ""}</td>
  //           <td>{currentEvent.dataValues["y9zGBpMBAhQ"] || ""}</td>
  //           <td>{currentEvent.dataValues["dE6mw0hXdAt"] || ""}</td>
  //           <td>{currentEvent.dataValues["SHCRzRWFaii"] || ""}</td>
  //           <td>{currentEvent.dataValues["PFwymX0Io0y"] || ""}</td>
  //           <td>{currentEvent.dataValues["Va3FC8Io1b0"] || ""}</td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>
  // );
};

export default AgeGroupTable;
