import { useSelector } from "react-redux";
import { HAS_INITIAN_NOVALUE } from "../constants";
import { useState } from "react";

import _ from "lodash";

const InterviewDetailForm = () => {
  const { programMetadata } = useSelector((state) => state.metadata);
  const originMetadata = convertOriginMetadata(programMetadata);

  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));

  console.log({ programMetadata, originMetadata });

  return <div>InterviewDetailForm</div>;
};

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

export default InterviewDetailForm;
