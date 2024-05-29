import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import App from "../../components/App/App";
// import { setUpDatabase } from '../../libs/idb-handler';
import AppSkeleton from "../../skeletons/App";
import villages from "../../villages/villageOptions.json";

/* REDUX */
import withSkeletonLoading from "@/hocs/withSkeletonLoading";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrgUnitLevels,
  setOrgUnits,
  setProgramMetadata,
  setProgramMetadataMember,
  setSelectedOrgUnit,
} from "@/redux/actions/metadata";

import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import { getMetadataSet } from "@/utils/offline";

const AppSkeletonLoading = withSkeletonLoading(AppSkeleton)(App);

const AppContainer = () => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const metadata = useSelector((state) => state.metadata);
  const isOfflineMode = useSelector((state) => state.common.offlineStatus);

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
      // //  GET EVENTs by query
      // let memberEventsByYear = await eventManager.getEventsByQuery({
      //     programStage: 'Ux1dcyOiHe7',
      //     orgUnit: 'ia7PTbi01id',
      //     filters: [`filter=ig2YSpQdP55:EQ:maFOg35J5Hg`],
      //     startDate: `${2022}-01-01`,
      //     endDate: `${2022}-12-31`,
      // });
      // console.log({ memberEventsByYear });
      // TODO
      // console.log(await enrollmentManager.findOne('o69vgj9q3x0'));
      // console.log(
      //     await trackedEntityManager.findOne('APbHHVQxFWy')
      // );
      // console.log(await eventManager.findOne('sLKnpFaCJU9'));
      // console.log(
      //     await trackedEntityManager.find({
      //         paging: false,
      //         program: 'L0EgY4EomHv',
      //         page: true,
      //         pageSize: 10,
      //     })
      // );
      // Test code
      // console.log(await programManager.getPrograms());
      // console.log(await programManager.getProgramById('L0EgY4EomHv'));
      // console.log(await programManager.getProgramById('xvzrp56zKvI'));
      // console.log(
      //     await organisationUnitManager.getAllOrganisationUnits()
      // );
      // console.log(await organisationUnitManager.getUserOrgs());
      // console.log(
      //     await organisationUnitLevelsManager.getAllOrganisationUnitLevels()
      // );
      // console.log(await meManager.getMe());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);

      console.log("AppContainer", { isOfflineMode });

      Promise.all(getMetadataSet(isOfflineMode)).then(async (results) => {
        const programMetadata = {
          villageHierarchy: createVillageHierachy(villages, results[1]),
          ...results[0],
        };

        console.log({ programMetadata });

        dispatch(setProgramMetadata(programMetadata));
        dispatch(setProgramMetadataMember(results[4]));
        dispatch(setOrgUnitLevels(results[3].organisationUnitLevels));
        const savedSelectedOrgUnit = sessionStorage.getItem("selectedOrgUnit");
        i18n.changeLanguage(results[2].settings.keyUiLocale);
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

        dispatch(setOrgUnits(results[5].organisationUnits));
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
