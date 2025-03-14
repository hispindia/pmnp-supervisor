import { useSelector } from "react-redux";
import { HAS_INITIAN_NOVALUE } from "../constants";
import { useState } from "react";

import _ from "lodash";
import InterviewTable from "../InterviewTable/InterviewTable";
import { HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID } from "@/constants/app-config";

const InterviewDetailForm = () => {
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

      // Set default value for Active memberz
      if (!Boolean(rows[rowIndex]["status"])) {
        rows[rowIndex]["status"] = "active";
      }
    }

    // FOR ALL ROWS
  };

  return (
    <InterviewTable
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
  // programMetadata.trackedEntityAttributes.forEach((attr) => {
  //   attr.code = attr.id;
  // });

  const programStagesDataElements = programMetadata.programStages.reduce(
    (acc, stage) => {
      if (stage.id !== HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID) {
        return acc;
      }

      stage.dataElements.forEach((de) => {
        de.code = de.id;
        de.hidden = HAS_INITIAN_NOVALUE.includes(de.id);
      });

      return [...acc, ...stage.dataElements];
    },
    []
  );

  return [
    // ...programMetadata.trackedEntityAttributes,
    ...programStagesDataElements,
  ];
};

export default InterviewDetailForm;
