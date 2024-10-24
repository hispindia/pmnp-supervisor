import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import withLoading from "../../../hocs/withLoading";
import Layout from "../components/Layout";
import {
  all_dx,
  getFamilyRegisteredData,
  getOptionDataByDeId,
} from "../services/api";
// import { AppContext } from "../../App/App.context";
import { useSelector } from "react-redux";
import { dataApi } from "../../../api";
import options from "./YearSelector/options";

const LOADING_BREAKPOINT = 10;

const WATER_SOURCE_DE_ID = "p2P8g0MnDBK";
const TOILET_TYPE_DE_ID = "BDi5vJcbiMv";

const LoadingLayout = withLoading(Layout);

function LayoutContainer(props) {
  const selectedOrgUnit = useSelector(
    (state) => state.metadata.selectedOrgUnit
  );

  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [year, setYear] = useState(options[0].value);
  const { t } = useTranslation();
  const refs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const getDataFromApi = async () => {
    setLoading(true);
    setData(null);

    /**
     * Why geting ${year}Q4?
     * - Because after new update, we have 2 events for each year (30/6 and 31/12), and each event have the same data, if we get full year data, we will get duplicate data.
     * - So, we get the last quarter of the year to avoid duplicate data.
     *  */
    try {
      const data = await Promise.all([
        dataApi.get(`/api/analytics.json`, { paging: false }, [
          `dimension=pe:${year}Q4&dimension=dx:${all_dx[0]}&&filter=ou:${selectedOrgUnit.id}&displayProperty=NAME`, // &filter=ou:LEVEL-${selectedOrgUnit.level};
        ]),
        getOptionDataByDeId(WATER_SOURCE_DE_ID)(year, selectedOrgUnit, dataApi),
        getOptionDataByDeId(TOILET_TYPE_DE_ID)(year, selectedOrgUnit, dataApi),
        getFamilyRegisteredData(year, selectedOrgUnit, dataApi),
      ]);

      setData(data);

      for (let index = 1; index < all_dx.length; index++) {
        await dataApi
          .get(`/api/analytics.json`, { paging: false }, [
            `dimension=pe:${year}Q4&dimension=dx:${all_dx[index]}&filter=ou:${selectedOrgUnit.id}&displayProperty=NAME`, // &filter=ou:LEVEL-${selectedOrgUnit.level};
          ])
          .then((res) => {
            const { rows } = res;
            const { dx } = res.metaData.dimensions;
            const acc = data[0];
            acc.rows = [...acc.rows, ...rows];
            acc.metaData.dimensions.dx = [...acc.metaData.dimensions.dx, ...dx];

            setData([acc, data[1], data[2], data[3]]);
            setLoadingPercent(((index + 1) * 100) / all_dx.length);
          });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoaded(true);
      setLoadingPercent(0);
    }
  };

  // useEffect(() => {
  //     if (!data) {
  //         return;
  //     }
  //     (async () => {
  //         for (let index = 1; index < all_dx.length; index++) {
  //             await dataApi
  //                 .get(`/api/analytics.json`, { paging: false }, [
  //                     `dimension=pe:${year}&dimension=dx:${all_dx[index]};&filter=ou:LEVEL-5;${selectedOrgUnit.id}&displayProperty=NAME`,
  //                 ])
  //                 .then((res) => {
  //                     const { rows } = res;
  //                     const { dx } = res.metaData.dimensions;
  //                     const acc = data[0];
  //                     acc.rows = [...acc.rows, ...rows];
  //                     acc.metaData.dimensions.dx = [
  //                         ...acc.metaData.dimensions.dx,
  //                         ...dx,
  //                     ];

  //                     setData([acc, data[1], data[2], data[3]]);
  //                     // setLoadingPercent(((index + 1) * 100) / all_dx.length);
  //                 });
  //         }
  //     })();
  // }, [loaded]);

  useEffect(() => {
    getDataFromApi();
  }, [year, selectedOrgUnit.id]);

  return (
    <LoadingLayout
      isLoading={!data || loading}
      errorMessage={error}
      percent={loadingPercent}
      variant={loadingPercent < LOADING_BREAKPOINT ? "indeterminate" : "static"}
      data={data}
      year={year}
      setYear={setYear}
      selectedOrgUnit={selectedOrgUnit}
      dataApi={dataApi}
      forwardingRefs={refs}
      isSaving={isSaving}
      setIsSaving={setIsSaving}
      reportTitle={t("familyInformationReport")}
      orgTitle={`${t("for")}: ${selectedOrgUnit.displayName}`}
      {...props}
    />
  );
}

LayoutContainer.propTypes = {};
LayoutContainer.defaultProps = {};

export default LayoutContainer;
