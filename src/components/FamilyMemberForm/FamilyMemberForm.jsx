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
import {
  FAMILY_UID_ATTRIBUTE_ID,
  HOUSEHOLD_ID_ATTR_ID,
  SHOULD_NOT_CLEAR_LIST,
} from "@/constants/app-config";
import { getMaxHHMemberID } from "@/utils/member";
import { getOrganisationUnitById } from "@/utils/organisation";
import { differenceInWeeks, differenceInYears, lastDayOfYear } from "date-fns";
import moment from "moment";
import "../../index.css";
import {
  HAS_INITIAN_NOVALUE,
  HOUSEHOLD_MEMBER_ID,
  MEMBER_HOUSEHOLD_UID,
  PMNP_ID,
} from "../constants";
import styles from "./FamilyMemberForm.module.css";

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

const convertOriginMetadata = ({ programMetadata, eventIncluded = true }) => {
  let trackedEntityAttributes = programMetadata.trackedEntityAttributes.map(
    (attr) => {
      return {
        ...attr,
        code: attr.id,
      };
    }
  );

  let programStagesDataElements = [];
  if (eventIncluded) {
    programStagesDataElements = programMetadata.programStages.reduce(
      (acc, stage) => {
        stage.dataElements.forEach((de) => {
          de.code = de.id;
          de.hidden = HAS_INITIAN_NOVALUE.includes(de.id);
        });

        return [...acc, ...stage.dataElements];
      },
      []
    );
  }

  return [...trackedEntityAttributes, ...programStagesDataElements];
};

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

  const originMetadata = convertOriginMetadata({
    programMetadata: programMetadataMember,
    eventIncluded: false,
  });

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

  useEffect(() => {
    // load from redux
    setLoading(true);

    setData(currentCascade || []);

    setLoading(false);
  }, [currentCascade]);

  useEffect(() => {
    setLoading(true);

    let cascadeData = currentCascade || [];

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
    console.log("FamilyMemberForm clicked", {
      metadata,
      previousData,
      data,
      currentCascade,
    });

    // WARNING: if it's hidden, the data will be removed
    metadata[FAMILY_UID_ATTRIBUTE_ID].hidden = true;
    // metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].hidden = true;

    metadata[HOUSEHOLD_MEMBER_ID].disabled = true;
    data[HOUSEHOLD_MEMBER_ID] = data.isNew
      ? getMaxHHMemberID(currentCascade)
      : data[HOUSEHOLD_MEMBER_ID];

    metadata[MEMBER_HOUSEHOLD_UID].disabled = true;
    data[MEMBER_HOUSEHOLD_UID] = attributes[HOUSEHOLD_ID_ATTR_ID];

    // InterviewDetails - Household ID
    // metadata["C4b8S7zjs0g"].disabled = true;
    // data["C4b8S7zjs0g"] = attributes[HOUSEHOLD_ID_ATTR_ID];

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

    // hide ages
    // if (weeks >= 52) {
    //   metadata["xDSSvssuNFs"].hidden = true;
    //   metadata["H42aYY9JMIR"].hidden = false;
    // } else {
    //   metadata["xDSSvssuNFs"].hidden = false;
    //   metadata["H42aYY9JMIR"].hidden = true;
    // }
    metadata["d2n5w4zpxuo"].hidden = true;
    metadata["xDSSvssuNFs"].hidden = true;
    metadata["X2Oln1OyP5o"].hidden = true;
    metadata["H42aYY9JMIR"].hidden = true;

    data["H42aYY9JMIR"] = years;

    // clear data for hidden items
    for (let meta in metadata) {
      if (SHOULD_NOT_CLEAR_LIST.includes(meta)) {
        continue;
      }

      if (metadata[meta].hidden) {
        delete data[meta];
      }
    }

    console.log("dispatch:data :>> ", data);
    dispatch(changeMember({ ...data, isUpdate: true })); //!important
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

  const initFunction = (metadata, dataRows, rowIndex = null) => {};

  return (
    <div className={familyMemberFormContainer}>
      {blockEntry && <div className={"modalBackdrop"}></div>}
      <Paper className={classes.paper}>
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

export default FamilyMemberForm;
