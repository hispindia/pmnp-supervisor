import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import App from "../../components/App/App";
// import { setUpDatabase } from '../../libs/idb-handler';
import AppSkeleton from "../../skeletons/App";

import villages from "../../villages/villageOptions.json";

/* REDUX */
import { useDispatch, useSelector } from "react-redux";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import {
  setOrgUnitLevels,
  setOrgUnits,
  setProgramMetadata,
  setProgramMetadataMember,
  setSelectedOrgUnit,
} from "../../redux/actions/metadata";

import { metadataApi } from "../../api";
import { addIdbByKey } from "../../libs/idb-handler";

const AppSkeletonLoading = withSkeletonLoading(AppSkeleton)(App);

const AppContainer = () => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const metadata = useSelector((state) => state.metadata);

  const findAttribute = (attributes, attributeId) => {
    const found = attributes.find((attr) => attr.attribute.id === attributeId);
    if (found) {
      return found.value;
    } else {
      return null;
    }
  };

  const createVillageHierachy = (villageOptions, organisationUnits) => {
    const hierarchy = [];
    const villages = villageOptions.options;
    const orgUnits = organisationUnits.organisationUnits;
    // const provinces = result[0].options;
    // const districts = result[1].options;
    // const villages = result[2].options;

    villages.forEach((village) => {
      const coordinates = findAttribute(village.attributeValues, "E4BKRTaQKot");
      const provinceCode = findAttribute(
        village.attributeValues,
        "REMLxBe9c4w"
      );
      const districtCode = findAttribute(
        village.attributeValues,
        "GabcHXoJJWG"
      );
      const province = orgUnits.find((ou) => ou.code === provinceCode);
      const district = orgUnits.find((ou) => ou.code === districtCode);
      if (!province || !district) return;
      const foundProvince = hierarchy.find((ou) => ou.value === provinceCode);
      const foundDistrict = hierarchy.find((ou) => ou.value === districtCode);
      if (!foundProvince) {
        hierarchy.push({
          value: province.code,
          data: null,
          path: province.code,
          label: province.displayName,
        });
      }
      if (!foundDistrict) {
        hierarchy.push({
          value: district.code,
          data: null,
          path: province.code + "/" + district.code,
          label: district.displayName,
        });
      }
      hierarchy.push({
        value: village.code,
        data: coordinates
          ? {
              latitude: parseFloat(coordinates.split(",")[0]),
              longitude: parseFloat(coordinates.split(",")[1]),
            }
          : null,
        path: provinceCode + "/" + districtCode + "/" + village.code,
        label: village.displayName,
      });
    });
    hierarchy.sort(function (a, b) {
      var nameA = a.label.toUpperCase();
      var nameB = b.label.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return hierarchy;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      // await setUpDatabase();

      // let villages = await getIdbByKey('villages');
      // let programMetadataCache = await getIdbByKey('program');
      // let programMemberMetadataCache = await getIdbByKey('programMember');

      await metadataApi.getProgramMetadataTest("L0EgY4EomHv");
      // await metadataApi.getProgramMetadata('xvzrp56zKvI');

      Promise.all([
        null,
        metadataApi.getProgramMetadata("L0EgY4EomHv"),
        metadataApi.get(`/api/organisationUnits`, {}, [
          "filter=level:in:[1,2,3]&paging=false&fields=id,code,path,displayName",
        ]),
        metadataApi.getMe(),
        null, //metadataApi.getOrgUnitGroups(),
        metadataApi.getOrgUnitLevels(),
        metadataApi.getProgramMetadata("xvzrp56zKvI"),
        metadataApi.getUserOrgUnits(),
      ]).then(async (results) => {
        // if (process.env.NODE_ENV == 'development') results[0] = villages
        // if (results[0])
        //     await addIdbByKey('villages', JSON.stringify(results[0]));
        // if (results[1])
        //     await addIdbByKey('program', JSON.stringify(results[1]));
        // if (results[6])
        // await addIdbByKey('programMember', JSON.stringify(results[6]));
        // await DB.addIdbByKey('programMember', JSON.stringify(payload));

        const programMetadata = {
          villageHierarchy: createVillageHierachy(villages, results[2]),
          ...results[1] /*|| JSON.parse(programMetadataCache.value)*/,
        };
        dispatch(setProgramMetadata(programMetadata));
        dispatch(
          setProgramMetadataMember(
            results[6] /*|| JSON.parse(programMemberMetadataCache.value)*/
          )
        );
        // dispatch(setOrgUnitGroups(results[4].organisationUnitGroups));
        dispatch(setOrgUnitLevels(results[5].organisationUnitLevels));
        const savedSelectedOrgUnit = sessionStorage.getItem("selectedOrgUnit");
        i18n.changeLanguage(results[3].settings.keyUiLocale);
        if (savedSelectedOrgUnit) {
          let orgUnitJsonData = null;
          try {
            orgUnitJsonData = JSON.parse(savedSelectedOrgUnit);
          } catch (e) {
            console.log(e);
          }
          dispatch(setSelectedOrgUnit(orgUnitJsonData));
          // history.push("/list");
        }
        const ouSelectorFilter = [];
        results[7].organisationUnits.forEach((ou) => {
          const found = programMetadata.organisationUnits.find((pou) =>
            pou.path.includes(ou.id)
          );
          if (!found) {
            ouSelectorFilter.push(ou.path);
          }
        });
        dispatch(setOrgUnits(ouSelectorFilter));
        setLoading(false);
        setLoaded(true);
      });
    })();
  }, []);

  return (
    <AppSkeletonLoading
      loading={loading}
      loaded={loaded}
      mask={true}
      metadata={metadata}
    />
  );
};
export default AppContainer;
