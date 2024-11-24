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

const mapping = {
  "Date of birth": "DOB",
  "Birth Year": "birthyear",
  "Age in years": "age",
  dob: "DOB",
  DOB: "DOB",
  birthyear: "birthyear",
  age: "age",
  ageinyears: "age",
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const currentCascade = useSelector(
    (state) => state.data.tei.data.currentCascade
  );

  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));

  useEffect(() => {
    return () => {
      console.log("FamilyMemberForm - unmounted");

      // TODO: why crash here???
      // dispatch(clear());
      // setData([]);
    };
  }, []);

  useEffect(() => {
    console.log("checking data", { data });
  }, [data]);

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

    const mappingNewCode = {
      "First name": "firstname",
      "Last name": "lastname",
      "Relation with head": "relation",
      Sex: "sex",
      Ethnicity: "ethnicity",
      Nationality: "nationality",
      "Highest Education of head of the Family": "education",
      "Type of Insurance scheme": "insurance",
      "Marital status": "maritalstatus",
      "Date of birth": "DOB",
      dob: "DOB",
      "Birth Year": "birthyear",
      "Age in years": "age",
      ageinyears: "age",
      Status: "status",
      "Type of Age": "agetype",
    };

    cascadeData.forEach((obj) => {
      Object.entries(obj).forEach(([key, val]) => {
        if (Object.keys(mappingNewCode).includes(key)) {
          obj[mappingNewCode[key]] = obj[key];
          delete obj[key];
        }
      });
    });

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
            uiLocale={{
              addNewMember: t("addNewMember"),
              save: t("save"),
              select: t("select"),
              cancel: t("cancel"),
              clear: t("resetFilter"),
              familyMemberDetails: t("familyMemberDetails"),
              delete: t("delete"),
              deleteDialogContent: t("deleteDialogContent"),
              thisFieldIsRequired: t("thisFieldIsRequired"),
            }}
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
