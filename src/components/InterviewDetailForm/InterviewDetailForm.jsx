import { useSelector } from "react-redux";
import { HAS_INITIAN_NOVALUE } from "../constants";
import { useState } from "react";

import _ from "lodash";
import InterviewTable from "../InterviewTable/InterviewTable";

const InterviewDetailForm = () => {
  const { programMetadata } = useSelector((state) => state.metadata);
  const originMetadata = convertOriginMetadata(programMetadata);

  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));

  return (
    <InterviewTable
      data={data}
      setData={setData}
      metadata={metadata}
      setMetadata={setMetadata}
      originMetadata={originMetadata}
    />
  );
};

const convertOriginMetadata = (programMetadataMember) => {
  // programMetadataMember.trackedEntityAttributes.forEach((attr) => {
  //   attr.code = attr.id;
  // });

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
    // ...programMetadataMember.trackedEntityAttributes,
    ...programStagesDataElements,
  ];
};

export default InterviewDetailForm;
