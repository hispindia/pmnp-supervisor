import CascadeTable from "@/components/CascadeTable";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import i18n from "i18next";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import originMetadata from "./originMetadata.jsx";

/* REDUX */
import { useDispatch, useSelector } from "react-redux";

/* SELECTOR */
import { changeMember } from "../../redux/actions/data/tei";

// Import utils
import { calculateAgeGroup } from "./FormCalculationUtils";

// Styles
import "../../index.css";
import styles from "./FamilyMemberForm.module.css";
import {
  AREANUT_CONSUMPTION,
  BLOOD_PRESSURE_READING1,
  BLOOD_PRESSURE_READING2,
  BLOOD_PRESSURE_READING3,
  DEMOGRAPHIC_DETAILS,
  FAMILY_MEMBER_METADATA_CUSTOMUPDATE,
  FAMILY_MEMBER_VALUE,
  FULL_ALCOHAL_CONSUMPTION,
  HAS_INITIAN_NOVALUE,
  HEIGHT_WEIGHT,
  HHM2_ALCOHAL_CONSUMPTION12_MONTH,
  HHM2_ALCOHOL_CONSUMPTION,
  HHM2_ALCOHOL_CONSUMTION_FREQUENCY,
  HHM2_ARECANUT_CONSUMPTION,
  HHM2_ARECANUT_CONSUMPTION_FREQUENCY,
  HHM2_BLOODSUGER_MEASERD_SECTION,
  HHM2_BLOODSUGER_MEASERDBY_DOCTOR,
  HHM2_DIABETESDOCTOR_SECTION,
  HHM2_DIET,
  HHM2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR,
  HHM2_INTENSE_SPORTS,
  HHM2_MINS_CYCLING,
  HHM2_MODERATE_EXERTION,
  HHM2_PRENGENT,
  HHM2_SMOKED_TOBACCO_PRODUCTS,
  HHM2_SMOKING_FREQUENCY,
  HHM2_SPORTS_MODERATE_INTENSITY,
  HHM2_TABACCO_PRODUCTS_FREQUENCY,
  HHM2_TOBACCO_PRODUCTS,
  HHM2_WEEKLY_FRUIT_CONSUMTION,
  HHM2_WEEKLY_VEGETABLE_CONSUMTION,
  HHM2_WORK_RELATED_PHYSICAL_EXERTION,
  HISTORY_OF_CARDIOVASCULAR,
  HISTORY_OF_CHOLESTEROL,
  HISTORY_OF_DIABETES,
  HISTORY_RISEDBLOOD_PRESSURE,
  MORTALITY_INFORMATION,
  MOTHER_CHILD_SECTION,
  PHYSICAL_ACTIVITY_RECREATIONAL,
  PHYSICAL_ACTIVITY_TRAVEL,
  PHYSICAL_ACTIVITY_WORK,
  PHYSICAL_MEASUREMENT_BLOOD_PRESSURE,
  TOBACCO_USE,
  TYPE_OF_ACTION,
  WAISE_HIP_CIRCUMFERENCE,
  WG_SORT_SET,
} from "../constants";
import { calculateAge } from "@/utils/event";
import {
  differenceInWeeks,
  differenceInYears,
  format,
  lastDayOfYear,
} from "date-fns";

const { familyMemberFormContainer, cascadeTableWrapper } = styles;
const LoadingCascadeTable = withSkeletonLoading()(CascadeTable);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: "5px",
  },
}));

const convertOriginMetadata = (programMetadataMember) => {
  programMetadataMember.trackedEntityAttributes.forEach((attr) => {
    attr.code = attr.id;
  });

  const programStagesDataElements = programMetadataMember.programStages.reduce(
    (acc, stage) => {
      stage.dataElements.forEach((de) => {
        de.code = de.id;
        de.hidden = HAS_INITIAN_NOVALUE.includes(de.id);
      });

      return [...acc, ...stage.dataElements];
    },
    []
  );

  return [
    ...programMetadataMember.trackedEntityAttributes,
    ...programStagesDataElements,
  ];
};

const FamilyMemberForm = ({
  currentEvent,
  changeEventDataValue,
  changeEvent,
  blockEntry,
  events,
  externalComponents,
  setDisableCompleteBtn,
  ...props
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { year } = useSelector((state) => state.data.tei.selectedYear);
  const { programMetadataMember } = useSelector((state) => state.metadata);
  const originMetadata = convertOriginMetadata(programMetadataMember);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const currentCascade = useSelector(
    (state) => state.data.tei.data.currentCascade
  );

  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));

  const getCascadeData = () => {
    let cascadeData = [];
    if (currentCascade && currentCascade[year]) {
      cascadeData = currentCascade?.[year];
    }
    return cascadeData;
  };

  useEffect(() => {
    // load from redux
    setLoading(true);

    setData(getCascadeData());

    setLoading(false);
  }, [currentCascade]);

  useEffect(() => {
    (async () => {})();

    setLoading(true);

    let cascadeData = getCascadeData();

    setData(cascadeData);

    if (metadata) {
      let cloneMetadata = metadata.reduce((obj, md) => {
        obj[md.id] = md;
        return obj;
      }, {});

      setMetadata([...Object.values(cloneMetadata)]);
    }

    setLoading(false);
  }, [currentEvent]);

  console.log({ programMetadataMember });

  const editRowCallback = (metadata, previousData, data, code, value) => {
    // keep selected member details
    console.log("editRowCallback clicked", { metadata, previousData, data });

    metadata["Cn37lbyhz6f"].isDisabled = true;

    switch (code) {
      // handle form validation on besis of DOB
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB:
        const age = calculateAge(value);
        data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE] = age;

        if (age < 16) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER
          ].hidden = true;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACTIVITY_LAST6MONTH
          ].hidden = true;
        } else {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER
          ].hidden = false;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACTIVITY_LAST6MONTH
          ].hidden = false;
        }

        if (age < 2) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MORDEN_EDUCATION
          ].hidden = true;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ATTENDING_TRADITIONAL_LERNING
          ].hidden = true;
        } else {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MORDEN_EDUCATION
          ].hidden = false;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ATTENDING_TRADITIONAL_LERNING
          ].hidden = false;
        }

        if (age < 18 || age > 75) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING
          ].hidden = true;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = true;
        } else {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING
          ].hidden = false;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = false;
        }
        break;

      // handle form validation on besis of membership status
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MEMBERSHIP_STATUS:
        switch (value) {
          case FAMILY_MEMBER_VALUE.PRESENT:
            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO
            ].hidden = true;

            MORTALITY_INFORMATION.forEach(
              (hhm2) => (metadata[hhm2].hidden = true)
            );

            // DEMOGRAPHIC_DETAILS.forEach(hhm2 => metadata[hhm2].hidden = false)
            // WG_SORT_SET.forEach(hhm2 => metadata[hhm2].hidden = false)
            // MOTHER_CHILD_SECTION.forEach(hhm2 => metadata[hhm2].hidden = false)
            // PHYSICAL_MEASUREMENT_BLOOD_PRESSURE.forEach(hhm2 => metadata[hhm2].hidden = false)
            // BLOOD_PRESSURE_READING1.forEach(hhm2 => metadata[hhm2].hidden = false)
            // BLOOD_PRESSURE_READING2.forEach(hhm2 => metadata[hhm2] ? metadata[hhm2].hidden = false : '')
            // BLOOD_PRESSURE_READING3.forEach(hhm2 => metadata[hhm2] ? metadata[hhm2].hidden = false : '')

            break;

          case FAMILY_MEMBER_VALUE.DEMISE:
            MORTALITY_INFORMATION.forEach(
              (hhm2) => (metadata[hhm2].hidden = false)
            );

            DEMOGRAPHIC_DETAILS.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            WG_SORT_SET.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            MOTHER_CHILD_SECTION.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            PHYSICAL_MEASUREMENT_BLOOD_PRESSURE.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            BLOOD_PRESSURE_READING1.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            BLOOD_PRESSURE_READING2.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            BLOOD_PRESSURE_READING3.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );

            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO
            ].hidden = true;
            break;

          default:
            data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO] = value;

            data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO] = value;
            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO
            ].hidden = false;

            MORTALITY_INFORMATION.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            DEMOGRAPHIC_DETAILS.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            WG_SORT_SET.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            MOTHER_CHILD_SECTION.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            PHYSICAL_MEASUREMENT_BLOOD_PRESSURE.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            BLOOD_PRESSURE_READING1.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            BLOOD_PRESSURE_READING2.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );
            BLOOD_PRESSURE_READING3.forEach((hhm2) =>
              metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
            );

            break;
        }
        break;
      // data[code] = value;

      // handle form validation on besis of membership gender
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX:
        const userAge = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE];

        switch (value) {
          case TYPE_OF_ACTION.MALE:
            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER
            ].hidden = true;
            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER
            ].hidden = true;
            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
            ].hidden = true;
            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
            ].hidden = true;
            metadata[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
            ].hidden = true;

            // if ((userAge > 15) && (userAge < 49)) {
            MOTHER_CHILD_SECTION.forEach(
              (item) => (metadata[item].hidden = true)
            );
            // }
            //  else {
            //   MOTHER_CHILD_SECTION.forEach(item => metadata[item].hidden = false)
            // }
            break;

          case TYPE_OF_ACTION.FEMALE:
            if (userAge < 40 && userAge > 65) {
              metadata[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER
              ].hidden = true;
              metadata[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
              ].hidden = true;
            }

            if (userAge < 30 && userAge > 65) {
              metadata[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER
              ].hidden = true;
              // metadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST].hidden = true
              metadata[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
              ].hidden = true;
            }

            if (userAge < 18 || userAge > 75) {
              metadata[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING
              ].hidden = true;
              metadata[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
              ].hidden = true;
            }

            if (userAge > 15 && userAge < 49) {
              MOTHER_CHILD_SECTION.forEach(
                (item) => (metadata[item].hidden = true)
              );
            }
            // else {
            //   MOTHER_CHILD_SECTION.forEach(item => metadata[item].hidden = false)
            // }
            break;

          default:
            break;
        }
        break;

      // handle the form validation on the besis of tranferd ot filed
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO:
        const sex = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX];
        const useAge = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE];

        if (
          sex == TYPE_OF_ACTION.FEMALE &&
          useAge > 15 &&
          useAge < 49 &&
          value == FAMILY_MEMBER_VALUE.EX_COUNTRY
        ) {
          MORTALITY_INFORMATION.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
          DEMOGRAPHIC_DETAILS.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
          WG_SORT_SET.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
          MOTHER_CHILD_SECTION.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
          PHYSICAL_MEASUREMENT_BLOOD_PRESSURE.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
          BLOOD_PRESSURE_READING1.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
          BLOOD_PRESSURE_READING2.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
          BLOOD_PRESSURE_READING3.forEach((hhm2) =>
            metadata[hhm2] ? (metadata[hhm2].hidden = true) : ""
          );
        } else if (
          sex == TYPE_OF_ACTION.FEMALE &&
          (useAge < 15 || useAge > 49) &&
          value == FAMILY_MEMBER_VALUE.EX_COUNTRY
        ) {
          for (let meta in metadata) {
            metadata[meta].hidden = true;
          }
        } else if (
          sex == TYPE_OF_ACTION.MALE &&
          value == FAMILY_MEMBER_VALUE.EX_COUNTRY
        ) {
          for (let meta in metadata) {
            metadata[meta].hidden = true;
          }
        }

        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CURRENT_MARITAL_STATUS:
        if (value == TYPE_OF_ACTION.NEVER_MARRIED) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE
          ].hidden = true;
        } else {
          // data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE] = value;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER:
        if (value == TYPE_OF_ACTION.NO) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
          ].hidden = true;
        } else {
          data[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
          ] = value;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER:
        if (value == TYPE_OF_ACTION.NO) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
          ].hidden = true;
        } else {
          data[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
          ] = value;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING:
        if (value == TYPE_OF_ACTION.NO) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = true;
        } else {
          data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST] =
            value;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_GLASSES_OR_CONTANT_LENCES:
        if (value == TYPE_OF_ACTION.YES) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING
          ].hidden = true;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING_GLASSES
          ].hidden = false;
        }
        if (value == TYPE_OF_ACTION.NO) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING_GLASSES
          ].hidden = true;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_HEARING_AID:
        if (value == TYPE_OF_ACTION.YES) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING
          ].hidden = true;
        }
        if (value == TYPE_OF_ACTION.NO) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING
          ].hidden = false;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING_WITH_AID
          ].hidden = true;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MANNER_OF_DEATH:
        if (value != TYPE_OF_ACTION.ACCIDENTAL) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL
          ].hidden = true;
        } else {
          data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL] = value;
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_PREGNANT:
        if (value == TYPE_OF_ACTION.YES) {
          HHM2_PRENGENT.forEach((hhm2) => (metadata[hhm2].hidden = true));
        } else HHM2_PRENGENT.forEach((hhm2) => (metadata[hhm2].hidden = false));
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_DIABETES_DIAGNOSEDBY_DOCTOR:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_DIABETESDOCTOR_SECTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_DIABETESDOCTOR_SECTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_BLOODSUGER_MEASURED:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_BLOODSUGER_MEASERD_SECTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_BLOODSUGER_MEASERD_SECTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_BLOOD_PRESSURE_MEASUREDBY_DOCTOR:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_BLOODSUGER_MEASERDBY_DOCTOR.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_BLOODSUGER_MEASERDBY_DOCTOR.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_SPORTS_MODERATE_INTENSITY:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_SPORTS_MODERATE_INTENSITY.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_SPORTS_MODERATE_INTENSITY.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_INTENSE_SPORTS:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_INTENSE_SPORTS.forEach((hhm2) => (metadata[hhm2].hidden = true));
        } else
          HHM2_INTENSE_SPORTS.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_MINS_CYCLING:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_MINS_CYCLING.forEach((hhm2) => (metadata[hhm2].hidden = true));
        } else
          HHM2_MINS_CYCLING.forEach((hhm2) => (metadata[hhm2].hidden = false));
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_MODERATE_EXERTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_MODERATE_EXERTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_MODERATE_EXERTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_WORK_RELATED_PHYSICAL_EXERTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_WORK_RELATED_PHYSICAL_EXERTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_WORK_RELATED_PHYSICAL_EXERTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_WEEKLY_VEGETABLE_CONSUMTION:
        if (value == 0) {
          HHM2_WEEKLY_VEGETABLE_CONSUMTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_WEEKLY_VEGETABLE_CONSUMTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_WEEKLY_FRUIT_CONSUMTION:
        if (value == 0) {
          HHM2_WEEKLY_FRUIT_CONSUMTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_WEEKLY_FRUIT_CONSUMTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ALCOHOL_CONSUMTION_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_ALCOHOL_CONSUMTION_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_ALCOHOL_CONSUMTION_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ALCOHAL_CONSUMPTION12_MONTH:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_ALCOHAL_CONSUMPTION12_MONTH.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_ALCOHAL_CONSUMPTION12_MONTH.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ALCOHOL_CONSUMPTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_ALCOHOL_CONSUMPTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_ALCOHOL_CONSUMPTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ARECANUT_CONSUMPTION_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_ARECANUT_CONSUMPTION_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_ARECANUT_CONSUMPTION_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ARECANUT_CONSUMPTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_ARECANUT_CONSUMPTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_ARECANUT_CONSUMPTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_TABACCO_PRODUCTS_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_TABACCO_PRODUCTS_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_TABACCO_PRODUCTS_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_TOBACCO_PRODUCTS:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_TOBACCO_PRODUCTS.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_TOBACCO_PRODUCTS.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_SMOKING_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_SMOKING_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else
          HHM2_SMOKING_FREQUENCY.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_SMOKED_TOBACCO_PRODUCTS:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_SMOKED_TOBACCO_PRODUCTS.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else {
          HHM2_SMOKED_TOBACCO_PRODUCTS.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MISCARRIAGE_OR_ABORTION_LASTYEAR:
        if (value)
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_INCIDENCE
          ].hidden = false;
        else {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_INCIDENCE
          ].hidden = true;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM2_2_DATE_OF_DEATH:
        const deadAge = calculateAge(value);
        const mermberAge = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE];
        const userSex = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX];

        if (userSex == TYPE_OF_ACTION.FEMALE && deadAge) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
          ].hidden = true;
        }
        if (deadAge > mermberAge) {
          data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM2_2_AGE_OF_DEATH] =
            deadAge - mermberAge;
        } else {
          delete data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM2_2_AGE_OF_DEATH];
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_STILL_BIRTH_LASTYEAR:
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LIVE_BIRTH_LASTYEAR:
        if (value) {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_DELIVERY
          ].hidden = false;
        } else {
          metadata[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_DELIVERY
          ].hidden = true;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL:
        if (value == TYPE_OF_ACTION.NO) {
          TOBACCO_USE.forEach((hhm2) => (metadata[hhm2].hidden = true));
          AREANUT_CONSUMPTION.forEach((hhm2) => (metadata[hhm2].hidden = true));
          FULL_ALCOHAL_CONSUMPTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
          HHM2_DIET.forEach((hhm2) => (metadata[hhm2].hidden = true));
          PHYSICAL_ACTIVITY_WORK.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
          PHYSICAL_ACTIVITY_TRAVEL.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
          PHYSICAL_ACTIVITY_RECREATIONAL.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
          HISTORY_RISEDBLOOD_PRESSURE.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
          HISTORY_OF_DIABETES.forEach((hhm2) => (metadata[hhm2].hidden = true));
          HISTORY_OF_CHOLESTEROL.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
          HISTORY_OF_CARDIOVASCULAR.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
          HEIGHT_WEIGHT.forEach((hhm2) => (metadata[hhm2].hidden = true));
          WAISE_HIP_CIRCUMFERENCE.forEach(
            (hhm2) => (metadata[hhm2].hidden = true)
          );
        } else {
          TOBACCO_USE.forEach((hhm2) => (metadata[hhm2].hidden = false));
          AREANUT_CONSUMPTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          FULL_ALCOHAL_CONSUMPTION.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          HHM2_DIET.forEach((hhm2) => (metadata[hhm2].hidden = false));
          PHYSICAL_ACTIVITY_WORK.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          PHYSICAL_ACTIVITY_TRAVEL.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          PHYSICAL_ACTIVITY_RECREATIONAL.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          HISTORY_RISEDBLOOD_PRESSURE.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          HISTORY_OF_DIABETES.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          HISTORY_OF_CHOLESTEROL.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          HISTORY_OF_CARDIOVASCULAR.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
          HEIGHT_WEIGHT.forEach((hhm2) => (metadata[hhm2].hidden = false));
          WAISE_HIP_CIRCUMFERENCE.forEach(
            (hhm2) => (metadata[hhm2].hidden = false)
          );
        }

      default:
        console.log("default found");
        break;
      // data[code] = value;
    }

    const enrollmentDate = lastDayOfYear(new Date(currentEvent.occurredAt));
    const dateOfbirth = new Date(data["fJPZFs2yYJQ"]);
    const years = differenceInYears(enrollmentDate, dateOfbirth);
    const weeks = differenceInWeeks(enrollmentDate, dateOfbirth);
    data["xDSSvssuNFs"] = weeks;
    data["H42aYY9JMIR"] = years;

    let shownSections = [];
    let hiddenSections = [
      "IxbqFSJPfEN",
      "A2TBfLOW8HG",
      "tlNWZDOWfP2",
      "jV8O1ZITgIn",
      "E4FpYkBzAsW",
    ];

    const pregnancyStatus = data["ycBIHr9bYyw"];
    if (pregnancyStatus === "1") {
      hiddenSections = hiddenSections.filter((h) => h !== "IxbqFSJPfEN");
      shownSections.push("IxbqFSJPfEN");
    }
    if (pregnancyStatus === "2") {
      hiddenSections = hiddenSections.filter((h) => h !== "A2TBfLOW8HG");
      shownSections.push("A2TBfLOW8HG");
    }
    if (dateOfbirth) {
      if (years <= 5) {
        hiddenSections = hiddenSections.filter(
          (h) => h !== "tlNWZDOWfP2" || h !== "jV8O1ZITgIn"
        );
        shownSections.push("tlNWZDOWfP2");
        shownSections.push("jV8O1ZITgIn");
      }

      const sex = data["Qt4YSwPxw0X"];
      if (
        years >= 10 &&
        years <= 49 &&
        sex === "1" &&
        (pregnancyStatus === "2" || pregnancyStatus === "3")
      ) {
        hiddenSections = hiddenSections.filter((h) => h !== "E4FpYkBzAsW");
        shownSections.push("E4FpYkBzAsW");
      }
    }

    const scorecardSurveyStage = programMetadataMember.programStages.find(
      (ps) => ps.id === "QfXSvc9HtKN"
    );

    if (scorecardSurveyStage) {
      scorecardSurveyStage.programStageSections.forEach((pss) => {
        if (hiddenSections.includes(pss.id)) {
          pss.dataElements.forEach((de) => {
            metadata[de.id].hidden = true;
          });
        }
        if (shownSections.includes(pss.id)) {
          pss.dataElements.forEach((de) => {
            metadata[de.id].hidden = false;
          });
        }
      });
    }

    // clear data for hidden items
    for (let meta in metadata) {
      if (metadata[meta].hidden) {
        delete data[meta];
      }
    }

    console.log("dispatch:data :>> ", data);
    dispatch(changeMember({ ...data, isUpdate: true })); //!important

    // // UPDATE METADATA
    // if (data["agetype"] != null) {
    //   metadata[mapping[data["agetype"]]].hidden = false;
    //   metadata[mapping[data["agetype"]]].compulsory = true;
    // }

    // if (data["agetype"] == "DOB" || data["agetype"] == "dob") {
    //   metadata["birthyear"].hidden = true;
    //   metadata["birthyear"].compulsory = false;
    //   metadata["age"].hidden = true;
    //   metadata["age"].compulsory = false;
    // } else if (data["agetype"] == "birthyear") {
    //   metadata["DOB"].hidden = true;
    //   metadata["DOB"].compulsory = false;
    //   metadata["age"].hidden = true;
    //   metadata["age"].compulsory = false;
    // } else if (data["agetype"] == "age") {
    //   metadata["birthyear"].hidden = true;
    //   metadata["birthyear"].compulsory = false;
    //   metadata["DOB"].hidden = true;
    //   metadata["DOB"].compulsory = false;
    // } else {
    //   metadata["DOB"].hidden = true;
    //   metadata["DOB"].compulsory = false;
    //   metadata["age"].hidden = true;
    //   metadata["age"].compulsory = false;
    //   metadata["birthyear"].hidden = true;
    //   metadata["birthyear"].compulsory = false;
    // }

    // UPDATE DATA
    if (code == "DOB") {
      data["birthyear"] = null;
      data["age"] = null;
    }
    if (code == "birthyear") {
      data["DOB"] = null;
      data["age"] = null;
    }
    if (code == "age") {
      data["birthyear"] = null;
      data["DOB"] = null;
    }

    // Automatically select Femail if it's Wife
    if (code == "relation") {
      if (data["relation"] == "wife") {
        data["sex"] = "F";
      } else {
        if (previousData["relation"] == "wife") {
          data["sex"] = "";
        }
      }
    }

    // For Initial
    if (data["sex"] === "M") {
      metadata["firstname"].prefix = t("Mr");
    } else if (data["sex"] === "F") {
      metadata["firstname"].prefix = t("Mrs");
    }
  };

  const callbackFunction = (
    metadata,
    dataRows,
    rowIndex = null,
    actionType
  ) => {
    // clean selected member
    if (actionType === "clean") {
      dispatch(changeMember({}));
      return;
    }

    // set selected member is about to be deleted
    if (actionType === "delete_member_selected") {
      const memberData = JSON.parse(JSON.stringify(dataRows)); // only for delete case
      console.log({ memberData });
      dispatch(changeMember({ ...memberData, isDelete: true })); // only for data
      console.log("callbackFunction rowIndex delete", rowIndex, actionType);
      return;
    }

    // on deleted member
    if (actionType === "delete_member") {
      console.log("delete_member");
      return;
    }

    // disable complete button
    // setDisableCompleteBtn(dataRows["rows"].length <= 0);

    // FOR PARTICULAR ROW
    if (rowIndex != null) {
      console.log("callbackFunction rowIndex", dataRows["rows"][rowIndex].id);

      // Set default value for Active memberz
      if (!Boolean(dataRows["rows"][rowIndex]["status"])) {
        dataRows["rows"][rowIndex]["status"] = "active";
      }
    }
    // FOR ALL ROWS
    // Calculate Age Group
    let tempValues = calculateAgeGroup(dataRows["rows"], currentEvent);
    console.log("calculateAgeGroup", dataRows["rows"], tempValues);
    Object.entries(tempValues).forEach((v) => {
      if (v[1] === 0) {
        v[1] = "";
      }
      changeEventDataValue(v[0], v[1]);
    });
    dataRows["rows"] = _.sortBy(dataRows["rows"], function (item) {
      return item["relation"] === "head" ? 0 : 1;
    });
  };

  const initFunction = (metadata, dataRows, rowIndex = null) => {
    // if (metadata) {
    //   if (events && events.length > 1) {
    //     metadata["Status"].hidden = false;
    //   }
    // }
  };

  if (!events && events.length <= 0) {
    return <Paper className={classes.paper}>Add Event</Paper>;
  }

  return (
    events &&
    events.length > 0 && (
      <div className={familyMemberFormContainer}>
        {blockEntry && <div className={"modalBackdrop"}></div>}
        <Paper className={classes.paper}>
          <LoadingCascadeTable
            loading={loading}
            mask
            loaded={true}
            // uiLocale={{
            //   addNewMember: t("addNewMember"),
            //   save: t("save"),
            //   select: t("select"),
            //   cancel: t("cancel"),
            //   clear: t("resetFilter"),
            //   familyMemberDetails: t("familyMemberDetails"),
            //   delete: t("delete"),
            //   deleteDialogContent: t("deleteDialogContent"),
            //   thisFieldIsRequired: t("thisFieldIsRequired"),
            // }}
            locale={i18n.language || "en"}
            metadata={metadata}
            data={data}
            currentEvent={currentEvent}
            changeEventDataValue={changeEventDataValue}
            initFunction={initFunction}
            editRowCallback={editRowCallback}
            callbackFunction={callbackFunction}
            originMetadata={originMetadata}
            setMetadata={setMetadata}
            setData={setData}
            t={t}
            externalComponents={externalComponents}
            maxDate={`${year}-12-31`}
            minDate={props.minDate}
          />
        </Paper>
      </div>
    )
  );
};

export default FamilyMemberForm;
