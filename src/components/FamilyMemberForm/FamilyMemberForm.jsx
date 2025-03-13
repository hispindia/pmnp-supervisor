import CascadeTable from "@/components/CascadeTable";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import i18n from "i18next";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";

/* REDUX */
import { useDispatch, useSelector } from "react-redux";

/* SELECTOR */
import { changeMember } from "../../redux/actions/data/tei";

// Import utils

// Styles
import { getMaxHHMemberID } from "@/utils/member";
import { getOrganisationUnitById } from "@/utils/organisation";
import { differenceInWeeks, differenceInYears, lastDayOfYear } from "date-fns";
import "../../index.css";
import {
  HAS_INITIAN_NOVALUE,
  HOUSEHOLD_MEMBER_ID,
  MEMBER_HOUSEHOLD_UID,
  PMNP_ID,
} from "../constants";
import styles from "./FamilyMemberForm.module.css";

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
  setEventDirty,
  blockEntry,
  events,
  externalComponents,
  setDisableCompleteBtn,
  ...props
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { year } = useSelector((state) => state.data.tei.selectedYear);

  const {
    programMetadataMember,
    selectedOrgUnit: { id: orgUnitId },
    orgUnits,
  } = useSelector((state) => state.metadata);
  const selectedOrgUnit = getOrganisationUnitById(orgUnitId, orgUnits);
  const { code: BarangayCode } = selectedOrgUnit;

  const originMetadata = convertOriginMetadata(programMetadataMember);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const attributes = useSelector(
    (state) => state.data.tei.data.currentTei.attributes
  );
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

  const editRowCallback = (metadata, previousData, data, code, value) => {
    // keep selected member details
    console.log("editRowCallback clicked", {
      metadata,
      previousData,
      data,
      currentCascade,
    });

    metadata[HOUSEHOLD_MEMBER_ID].disabled = true;
    data[HOUSEHOLD_MEMBER_ID] = getMaxHHMemberID(currentCascade);

    metadata[MEMBER_HOUSEHOLD_UID].disabled = true;
    data[MEMBER_HOUSEHOLD_UID] = attributes["IKOSsYJJZis"];

    metadata[PMNP_ID].disabled = true;
    data[
      PMNP_ID
    ] = `${BarangayCode}-${data[MEMBER_HOUSEHOLD_UID]}-${data[HOUSEHOLD_MEMBER_ID]}`;

    const memberId = data[HOUSEHOLD_MEMBER_ID];
    if (!memberId) {
      // random 3 digits
      // data["Cn37lbyhz6f"] = Math.floor(100 + Math.random() * 900);
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

    // IMPORTANT
    setEventDirty(true);

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
