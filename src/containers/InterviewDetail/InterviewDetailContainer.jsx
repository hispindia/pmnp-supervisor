import { HAS_INITIAN_NOVALUE } from "@/components/constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import InterviewDetailTable from "@/components/ScorecardInterview/InterviewDetailTable";
import {
  HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID,
  HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
} from "@/constants/app-config";
import { getHouseholdMemberIDs } from "@/utils/member";
import _ from "lodash";

const InterviewDetailContainer = () => {
  const currentEvents = useSelector((state) => state.data.tei.data.currentEvents);
  const { programMetadata } = useSelector((state) => state.metadata);
  const currentCascade = useSelector((state) => state.data.tei.data.currentCascade);
  const originMetadata = convertOriginMetadata(programMetadata, currentCascade);

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

  useEffect(() => {
    const interviewEvents = currentEvents.filter(
      (e) => e.programStage === HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID
    );
    const interviewResultEvents = currentEvents.filter(
      (e) => e.programStage === HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID
    );

    // if having event => disabled = true, except the "partially completed"
    const disabledInterviews = interviewResultEvents.reduce((acc, curr) => {
      const interviewId = curr.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID];
      acc[interviewId] = true;
      if (
        curr.dataValues[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID] === "Partially Completed" ||
        curr.dataValues[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID] === "Needs_updates" ||
        !curr.dataValues[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID]
      ) {
        acc[interviewId] = false;
      }
      return acc;
    }, {});

    const transformed = interviewEvents.map((e) => ({
      id: e.event,
      ...e.dataValues,
      disabled: disabledInterviews[e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID]] || false,
    }));

    setData(_.orderBy(transformed, (event) => Number(event["Wdg76PCqsBn"]), ["desc"]));
  }, [currentEvents]);

  return (
    <InterviewDetailTable
      data={data}
      setData={setData}
      metadata={metadata}
      setMetadata={setMetadata}
      originMetadata={originMetadata}
      callbackFunction={callbackFunction}
    />
  );
};

const convertOriginMetadata = (programMetadata, currentCascade) => {
  // programMetadata.trackedEntityAttributes.forEach((attr) => {
  //   attr.code = attr.id;
  // });

  const householdMemberIDs = getHouseholdMemberIDs(currentCascade);

  const householdMembersValueSet = householdMemberIDs.map((id) => ({
    value: id,
    label: id,
  }));

  const interviewDetailsProgramStage = programMetadata.programStages.find(
    (stage) => stage.id === HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID
  );

  const dataElements = interviewDetailsProgramStage.dataElements.map((de) => {
    // Respondent ID
    if (de.id === "SrFa2O3m6ff") {
      return {
        ...de,
        code: de.id,
        valueSet: householdMembersValueSet,
      };
    }

    return {
      ...de,
      code: de.id,
      hidden: HAS_INITIAN_NOVALUE.includes(de.id),
      valueType: de.id === HOUSEHOLD_INTERVIEW_TIME_DE_ID ? "QUARTERLY" : de.valueType,
    };
  });

  return [
    // ...programMetadata.trackedEntityAttributes,
    ...dataElements,
  ];
};

export default InterviewDetailContainer;
