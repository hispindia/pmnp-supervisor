import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HAS_INITIAN_NOVALUE } from "../constants";

import _ from "lodash";

import {
  HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID,
  HOUSEHOLD_SURVEY_TIME_DE_ID,
} from "@/constants/app-config";
import HouseHoldSurveyTable from "./HouseHoldSurveyTable";

const HouseHoldSurveyForm = () => {
  const currentEvents = useSelector(
    (state) => state.data.tei.data.currentEvents
  );
  const { programMetadata } = useSelector((state) => state.metadata);
  const originMetadata = convertOriginMetadata(programMetadata);

  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));

  const callbackFunction = (metadata, rows, rowIndex = null, actionType) => {
    // clean selected member
    if (actionType === "clean") {
      console.log("clean");
      // dispatch(changeMember({}));
      return;
    }

    // set selected member is about to be deleted
    if (actionType === "delete_member_selected") {
      // const memberData = JSON.parse(JSON.stringify(dataRows)); // only for delete case
      // console.log({ memberData });
      // dispatch(changeMember({ ...memberData, isDelete: true })); // only for data
      console.log("callbackFunction rowIndex delete", rowIndex, actionType);
      return;
    }

    // on deleted member
    if (actionType === "delete_member") {
      console.log("delete_member");
      return;
    }

    // disable complete button
    // setDisableCompleteBtn(rows.length <= 0);

    // FOR PARTICULAR ROW
    if (rowIndex != null) {
      console.log("callbackFunction rowIndex", rows[rowIndex].id);
    }

    // FOR ALL ROWS
  };

  const interviewEvents = currentEvents.filter(
    (e) => e.programStage === HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID
  );

  useEffect(() => {
    const transformed = interviewEvents.map((e) => ({
      id: e.event,
      ...e.dataValues,
    }));

    setData(transformed);
  }, [JSON.stringify(interviewEvents)]);

  return (
    <HouseHoldSurveyTable
      data={data}
      setData={setData}
      metadata={metadata}
      setMetadata={setMetadata}
      originMetadata={originMetadata}
      callbackFunction={callbackFunction}
    />
  );
};

const convertOriginMetadata = (programMetadata) => {
  const interviewDetailsProgramStage = programMetadata.programStages.find(
    (stage) => stage.id === HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID
  );

  const dataElements = interviewDetailsProgramStage.dataElements.map((de) => {
    return {
      ...de,
      code: de.id,
      hidden: HAS_INITIAN_NOVALUE.includes(de.id),
      valueType:
        de.id === HOUSEHOLD_SURVEY_TIME_DE_ID ? "QUARTERLY" : de.valueType,
    };
  });

  return [
    // ...programMetadata.trackedEntityAttributes,
    ...dataElements,
  ];
};

export default HouseHoldSurveyForm;
