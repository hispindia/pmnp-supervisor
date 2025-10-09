import _ from "lodash";
import moment from "moment";
import CaptureForm from "../CaptureForm";
import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID,
  HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
} from "@/constants/app-config";
import { submitEvent, submitAttributes } from "@/redux/actions/data";
import { generateUid } from "@/utils";
import { getQuarterlyFromDate } from "@/utils/date";
import { transformEvent } from "@/utils/event";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FORM_ACTION_TYPES, HH_STATUS_ATTR_ID, HH_STATUSES } from "../constants";
import { clearHiddenFieldData, updateMetadata, updateMetadataValueSet, getHHStatus } from "./utils";
import { useInterviewCascadeData } from "@/hooks/useInterviewCascadeData";

const InterviewResultForm = ({ interviewData = {}, onClose = () => {}, disabled }) => {
  const i18n = useTranslation();
  const locale = i18n.language || "en";

  const dispatch = useDispatch();
  const currentEvents = useSelector((state) => state.data.tei.data.currentEvents);
  const { isAllMemberEventsCompleted } = useInterviewCascadeData(interviewData);
  const { selectedOrgUnit, programMetadata } = useSelector((state) => state.metadata);
  const foundProgramStage = programMetadata.programStages.find(
    (stage) => stage.id === HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
  );
  const attributes = useSelector((state) => state.data.tei.data.currentTei.attributes);
  const trackedEntity = useSelector((state) => state.data.tei.data.currentTei.trackedEntity);
  const enrollment = useSelector((state) => state.data.tei.data.currentEnrollment.enrollment);

  const originMetadata = convertOriginMetadata(foundProgramStage);
  const noEligibleMember = interviewData["WBZ6d5BF26K"] === "No eligible HH member";
  const informedConsentForInterview = interviewData["X28FSoTIkGv"];

  const [data, setData] = useState(null);
  const [defaultData, setDefaultData] = useState({});
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));
  const [formStatus, setFormStatus] = useState(null);
  const [formDirty, setFormDirty] = useState(false);

  const handleAddNew = (e, newData, continueAdd) => {
    setData(newData);
    let updatedMetadata = updateMetadata(metadata, newData);
    setMetadata([...updatedMetadata]);

    // submit new event
    const { id: event, ...dataValues } = newData;

    // init new event
    const occurredAt = interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID];

    const eventPayload = transformEvent({
      event,
      enrollment,
      occurredAt,
      dueDate: occurredAt,
      status: "ACTIVE",
      programStage: HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
      trackedEntity,
      orgUnit: selectedOrgUnit.id,
      program: programMetadata.id,
      dataValues,
      _isDirty: true,
    });

    const hhStatus = getHHStatus(newData[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID]);

    dispatch(submitAttributes({ ...attributes, [HH_STATUS_ATTR_ID]: hhStatus }));
    dispatch(submitEvent(eventPayload));
    setFormDirty(false);
  };

  const handleEdit = (e, newData, rowIndex) => {
    // Update data
    setData(newData);

    let updatedMetadata = updateMetadata(metadata, newData);
    console.log("handleEdit", { updatedMetadata, newData });

    setMetadata([...updatedMetadata]);

    // save event
    const currentEvent = currentEvents.find((e) => e.event === newData.id);
    const { id, ...dataValues } = newData;

    const occurredAt = interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID];
    const eventPayload = transformEvent({
      ...currentEvent,
      _isDirty: true,
      occurredAt,
      dueDate: occurredAt,
      dataValues,
    });

    const hhStatus = getHHStatus(newData[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID]);
    dispatch(submitAttributes({ ...attributes, [HH_STATUS_ATTR_ID]: hhStatus }));
    dispatch(submitEvent(eventPayload));
    setFormDirty(false);
  };

  const InterviewResult_DEs = {
    ResultOfInterview_DE: HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID,
    Order_DE: "S2zDqwE1XYa",
    NextVisitDate_DE: "eIXjCbOESKK",
    NextVisitTime_DE: "Z7BdeNfK9r6",
  };

  const editRowCallback = (metadata, previousData, newData, code, value) => {
    console.log("InterviewResultForm change", {
      defaultData,
      metadata,
      previousData,
      newData,
      code,
      value,
      interviewData,
    });

    if (!isAllMemberEventsCompleted) {
      updateMetadataValueSet(metadata[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID], "Completed", "isDisabled", true);
    }

    // Update data per logic
    if (noEligibleMember) {
      newData[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID] = "Non-Eligible";
    }

    if (informedConsentForInterview != "Yes") {
      newData[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID] = "Refused";
    }

    metadata["JzxYzLgo0P9"].disabled = true;
    metadata["upZKsrkhYmb"].disabled = true;
    metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].disabled = true;
    metadata[HOUSEHOLD_INTERVIEW_TIME_DE_ID].disabled = true;
    newData[HOUSEHOLD_INTERVIEW_TIME_DE_ID] = getQuarterlyFromDate(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    if (code == HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID) {
      newData["JzxYzLgo0P9"] = "";
    }

    // InterviewResult_DEs
    metadata[InterviewResult_DEs.Order_DE].hidden = true;
    metadata[InterviewResult_DEs.NextVisitDate_DE].hidden = true;
    metadata[InterviewResult_DEs.NextVisitTime_DE].hidden = true;

    switch (data[InterviewResult_DEs.ResultOfInterview_DE]) {
      case "Others":
        metadata[InterviewResult_DEs.Order_DE].hidden = false;
        break;
      case "Postponed":
        // future date
        metadata[InterviewResult_DEs.NextVisitDate_DE].maxDate = moment().add(1, "Y").format("YYYY-MM-DD");
        metadata[InterviewResult_DEs.NextVisitDate_DE].hidden = false;

        metadata[InterviewResult_DEs.NextVisitTime_DE].maxDate = moment().add(1, "Y").format("YYYY-MM-DD");
        metadata[InterviewResult_DEs.NextVisitTime_DE].hidden = false;
        break;
    }

    if (!newData[HOUSEHOLD_INTERVIEW_ID_DE_ID]) {
      newData[HOUSEHOLD_INTERVIEW_ID_DE_ID] = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
      setFormDirty(true);
    }

    newData["Zk72MWfJJKU"] = format(new Date(), "HH:mm");

    clearHiddenFieldData(metadata, data);
    if (previousData) setFormDirty(true);
  };

  const clearForm = () => {
    setData({});
    setMetadata(originMetadata);
    setFormDirty(false);
  };

  useEffect(() => {
    const found = currentEvents.find(
      (e) =>
        e.programStage === HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID &&
        e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID] === interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID],
    );

    if (found) {
      const formData = { id: found.event, ...found.dataValues };
      setData(formData);
      setDefaultData(_.cloneDeep(formData));
      setFormStatus(FORM_ACTION_TYPES.EDIT);
    } else {
      const formData = { id: generateUid() };
      setData(formData);
      setDefaultData(_.cloneDeep(formData));
      setFormStatus(FORM_ACTION_TYPES.ADD_NEW);
    }

    return () => {
      clearForm();
    };
  }, [currentEvents]);

  return (
    data && (
      <CaptureForm
        saveDisabled={!formDirty}
        onCancel={onClose}
        rowIndex={0}
        locale={locale}
        metadata={metadata}
        data={data}
        formProgramMetadata={{ programStages: [foundProgramStage] }}
        formStatus={!disabled ? formStatus : FORM_ACTION_TYPES.VIEW}
        setFormStatus={setFormStatus}
        handleEditRow={handleEdit}
        handleAddNewRow={handleAddNew}
        editRowCallback={editRowCallback}
        maxDate={new Date()}
        minDate={new Date(`1900-12-31`)}
        formName="InterviewResultForm"
      />
    )
  );
};

const convertOriginMetadata = (programMetadata) => {
  const dataElements = programMetadata.dataElements.map((de) => {
    return {
      ...de,
      code: de.id,
    };
  });

  return dataElements;
};

export default InterviewResultForm;
