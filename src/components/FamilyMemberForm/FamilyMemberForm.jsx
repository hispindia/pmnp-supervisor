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
import { FAMILY_UID_ATTRIBUTE_ID, HOUSEHOLD_ID_ATTR_ID, SHOULD_NOT_CLEAR_LIST } from "@/constants/app-config";
import { getMaxHHMemberID } from "@/utils/member";
import { getOrganisationUnitById } from "@/utils/organisation";
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears, lastDayOfYear } from "date-fns";
import moment from "moment";
import "../../index.css";
import { HAS_INITIAN_NOVALUE, HOUSEHOLD_MEMBER_ID, MEMBER_HOUSEHOLD_UID, PMNP_ID } from "../constants";
import styles from "./FamilyMemberForm.module.css";
import { handleAgeAttrsOfTEI, hhMemberRules } from "./houseHoldMemberRules";
// import { filterFemalesIn15And49 } from "@/hooks/useInterviewCascadeData";

const { familyMemberFormContainer } = styles;
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

const FamilyMemberForm = ({
  currentEvent,
  changeEventDataValue,
  changeEvent,
  setEventDirty,
  blockEntry,
  externalComponents,
  setDisableCompleteBtn,
  ...props
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    programMetadataMember,
    selectedOrgUnit: { id: orgUnitId },
    orgUnits,
  } = useSelector((state) => state.metadata);
  const selectedOrgUnit = getOrganisationUnitById(orgUnitId, orgUnits);
  const { code: BarangayCode } = selectedOrgUnit;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const attributes = useSelector((state) => state.data.tei.data.currentTei.attributes);
  const currentCascade = useSelector((state) => state.data.tei.data.currentCascade);

  const originMetadata = convertOriginMetadata({
    programMetadata: programMetadataMember,
    eventIncluded: false,
    currentCascade,
    currentEvent,
    attributes,
  });

  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));

  useEffect(() => {
    // load from redux
    setLoading(true);

    const sorted = _.sortBy(currentCascade || [], (item) => Number(item["QAYXozgCOHu"] || 0));
    setData(sorted);

    setLoading(false);
  }, [currentCascade]);

  useEffect(() => {
    setLoading(true);

    const sorted = _.sortBy(currentCascade || [], (item) => Number(item["QAYXozgCOHu"] || 0));
    setData(sorted);

    if (metadata) {
      let cloneMetadata = metadata.reduce((obj, md) => {
        obj[md.id] = md;
        return obj;
      }, {});

      setMetadata([...Object.values(cloneMetadata)]);
    }

    setLoading(false);
  }, [currentEvent]);

  useEffect(() => {
    setMetadata(_.cloneDeep(originMetadata));
  }, [currentEvent, currentCascade]);

  const editRowCallback = (metadata, previousData, data, code, value) => {
    // keep selected member details
    console.log("FamilyMemberForm registerform", {
      metadata,
      previousData,
      data,
      currentCascade,
      code,
      value,
    });

    // clear all "error" and "warning" messages
    for (let meta in metadata) {
      if (metadata[meta].error) {
        metadata[meta].error = "";
      }
      if (metadata[meta].warning) {
        metadata[meta].warning = "";
      }
    }

    const householdHeadMember = currentCascade?.find((member) => member["QAYXozgCOHu"] === "1");

    // WARNING: if it's hidden, the data will be removed
    metadata[FAMILY_UID_ATTRIBUTE_ID].hidden = true;

    metadata[HOUSEHOLD_MEMBER_ID].disabled = true;
    data[HOUSEHOLD_MEMBER_ID] = data.isNew ? getMaxHHMemberID(currentCascade) : data[HOUSEHOLD_MEMBER_ID];

    metadata[MEMBER_HOUSEHOLD_UID].disabled = true;
    data[MEMBER_HOUSEHOLD_UID] = attributes[HOUSEHOLD_ID_ATTR_ID];

    // InterviewDetails - Household ID
    // metadata["C4b8S7zjs0g"].disabled = true;
    // data["C4b8S7zjs0g"] = attributes[HOUSEHOLD_ID_ATTR_ID];

    metadata[PMNP_ID].disabled = true;
    data[PMNP_ID] = `${BarangayCode}-${data[MEMBER_HOUSEHOLD_UID]}-${data[HOUSEHOLD_MEMBER_ID]}`;

    // const memberId = data[HOUSEHOLD_MEMBER_ID];
    // if (!memberId) {
    // random 3 digits
    // data["Cn37lbyhz6f"] = Math.floor(100 + Math.random() * 900);
    // }

    const enrollmentDate = data.isNew ? new Date() : lastDayOfYear(new Date(currentEvent.occurredAt));
    const dateOfbirth = new Date(data["fJPZFs2yYJQ"]);

    const years = differenceInYears(enrollmentDate, dateOfbirth);
    const months = differenceInMonths(enrollmentDate, dateOfbirth);
    const weeks = differenceInWeeks(enrollmentDate, dateOfbirth);
    const days = differenceInDays(enrollmentDate, dateOfbirth);
    const ages = { years, months, weeks, days };

    if (data["QAYXozgCOHu"] === "1") {
      // Household head should more than 18 years old
      if (years < 15) {
        metadata["QAYXozgCOHu"].error = "Household head should be more than 18 years old";
      }

      if (years >= 15 && years < 18) {
        metadata["QAYXozgCOHu"].warning = "Are you sure that this person is the Household Head?";
      }

      // Allow only one household head per household
      if (householdHeadMember && householdHeadMember.id != data.id) {
        metadata["QAYXozgCOHu"].error = "Only one household head is allowed";
      }
    }

    // If "Spouse" is selected; Age should be  >=15 , do not allow to add DOB less than 15 yrs
    if (data["QAYXozgCOHu"] === "2" && years < 15) {
      metadata["QAYXozgCOHu"].error = "Spouse should be more than 15 years old";
    }

    metadata["d2n5w4zpxuo"].hidden = true;
    metadata["xDSSvssuNFs"].hidden = true;
    metadata["X2Oln1OyP5o"].hidden = true;
    metadata["H42aYY9JMIR"].hidden = true;

    data["H42aYY9JMIR"] = years;

    // Show if 'Relationship with HH Head' has option code 1,2,3,4,5,6,7,8
    metadata["BbdQMKOObps"].hidden = data["QAYXozgCOHu"] == "1" || !data["QAYXozgCOHu"];

    hhMemberRules(metadata, data, ages);

    // clear data for hidden items
    for (let meta in metadata) {
      if (SHOULD_NOT_CLEAR_LIST.includes(meta)) {
        continue;
      }

      if (metadata[meta].hidden) {
        delete data[meta];
      }
    }

    handleAgeAttrsOfTEI(data, ages);
    dispatch(changeMember({ ...data, isUpdate: true })); //!important
  };

  const callbackFunction = (metadata, dataRows, rowIndex = null, actionType) => {
    console.log("FamilyMemberForm callbackFunction", {
      metadata,
      dataRows,
      rowIndex,
      actionType,
    });

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

  const initFunction = (metadata, dataRows, rowIndex = null) => {};

  return (
    <div className={familyMemberFormContainer}>
      {blockEntry && <div className={"modalBackdrop"}></div>}
      <Paper elevation={0} className={classes.paper}>
        <LoadingCascadeTable
          loading={loading}
          mask
          loaded={true}
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
          maxDate={`${moment().year()}-12-31`}
          minDate={props.minDate}
        />
      </Paper>
    </div>
  );
};

const convertOriginMetadata = ({ programMetadata, currentEvent, eventIncluded = true, attributes, currentCascade }) => {
  const valueSetListOfFemales = createValueSet(currentCascade, currentEvent, "PIGLwIaw0wy", "Cn37lbyhz6f");

  let trackedEntityAttributes = programMetadata.trackedEntityAttributes.map((attr) => {
    // The "Family Number" must be drop down, not an input field.
    if (attr.id === "BbdQMKOObps") {
      const familyCount = attributes["ZGPJg7g997n"];
      const valueSet = Array.from({ length: familyCount }, (_, i) => ({
        value: i + 1 + "",
        label: `${i + 1}`,
      }));
      attr.valueSet = valueSet;
    }
    if (attr.id === "q0WEgMBwi0p") {
      attr.valueSet = [
        ...valueSetListOfFemales,
        { value: "Not part of the Household", label: "Not part of the Household" },
      ];
    }

    return {
      ...attr,
      code: attr.id,
    };
  });

  let programStagesDataElements = [];
  if (eventIncluded) {
    programStagesDataElements = programMetadata.programStages.reduce((acc, stage) => {
      stage.dataElements.forEach((de) => {
        de.code = de.id;
        de.hidden = HAS_INITIAN_NOVALUE.includes(de.id);
      });

      return [...acc, ...stage.dataElements];
    }, []);
  }

  return [...trackedEntityAttributes, ...programStagesDataElements];
};

const filterFemalesIn15And49 = (eventDate) => (member) => {
  const dateOfbirth = new Date(member["fJPZFs2yYJQ"]);
  const ageInYears = differenceInYears(eventDate, dateOfbirth);
  return member["Qt4YSwPxw0X"] == "1" && ageInYears >= 15 && ageInYears <= 49;
};

const createValueSet = (cascadeMembers, currentEvent, labelID, valueID) => {
  return cascadeMembers.reduce((acc, curr) => {
    const label = curr[labelID];
    const value = curr[valueID];

    const enrollmentDate = acc.isNew ? new Date() : lastDayOfYear(new Date(currentEvent.occurredAt));

    if (filterFemalesIn15And49(enrollmentDate)(curr)) {
      acc.push({
        value,
        label,
      });
    }

    return acc;
  }, []);
};

export default FamilyMemberForm;
