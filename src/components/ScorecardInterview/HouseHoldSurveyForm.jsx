import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
  HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID,
} from "@/constants/app-config";
import { useInterviewCascadeData } from "@/hooks/useInterviewCascadeData";
import { submitEvent } from "@/redux/actions/data";
import { generateUid } from "@/utils";
import { getQuarterlyFromDate } from "@/utils/date";
import { transformEvent } from "@/utils/event";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CaptureForm from "../CaptureForm";
import { FORM_ACTION_TYPES, GOV_PROGRAMS_DE_ID, HAS_INITIAN_NOVALUE, SOCIAL_AND_BEHAVIOR_DE_ID } from "../constants";
import { calculateHouseHoldFields } from "./calculateHouseHoldFields";
import { houseHoldSurveyRules } from "./houseHoldSurveyRules";
import { clearHiddenFieldData, updateMetadata } from "./utils";

const HouseHoldSurveyForm = ({ interviewData = {}, onClose = () => {}, disabled }) => {
  const i18n = useTranslation();
  const locale = i18n.language || "en";

  const dispatch = useDispatch();
  const currentEvents = useSelector((state) => state.data.tei.data.currentEvents);
  const { interviewCascadeData } = useInterviewCascadeData(interviewData);
  const { selectedOrgUnit, programMetadata } = useSelector((state) => state.metadata);
  const foundProgramStage = programMetadata.programStages.find(
    (stage) => stage.id === HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID
  );
  const trackedEntity = useSelector((state) => state.data.tei.data.currentTei.trackedEntity);
  const enrollment = useSelector((state) => state.data.tei.data.currentEnrollment.enrollment);

  const originMetadata = convertOriginMetadata(foundProgramStage);

  const [data, setData] = useState(null);
  const [defaultData, setDefaultData] = useState({});
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));
  const [formStatus, setFormStatus] = useState(null);
  const [formDirty, setFormDirty] = useState(false);

  console.log("HouseHoldSurveyForm", { formDirty, interviewData, interviewCascadeData });

  const handleAddNew = (e, newData, continueAdd) => {
    console.trace("row:>>>", newData);

    // Add new data

    setData(newData);
    let updatedMetadata = updateMetadata(metadata, data);
    setMetadata([...updatedMetadata]);

    console.log("handleAddNew", { updatedMetadata, data });

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
      programStage: HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID,
      trackedEntity,
      orgUnit: selectedOrgUnit.id,
      program: programMetadata.id,
      dataValues,
      _isDirty: true,
    });

    dispatch(submitEvent(eventPayload));
    setFormDirty(false);
    onClose();
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

    dispatch(submitEvent(eventPayload));
    setFormDirty(false);
    onClose();
  };

  const editRowCallback = (metadata, previousData, newData, code, value) => {
    const editRowCallback = { defaultData, metadata, previousData, newData, code, value };
    console.log("HouseHoldSurveyForm change", editRowCallback);

    metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].disabled = true;

    // Quaterly update
    metadata[HOUSEHOLD_INTERVIEW_TIME_DE_ID].disabled = true;
    newData[HOUSEHOLD_INTERVIEW_TIME_DE_ID] = getQuarterlyFromDate(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    if (!newData[HOUSEHOLD_INTERVIEW_ID_DE_ID]) {
      newData[HOUSEHOLD_INTERVIEW_ID_DE_ID] = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
      setFormDirty(true);
    }

    // Calculate fields
    // Score_Number of 4Ps Members
    houseHoldSurveyRules(metadata, newData);
    calculateHouseHoldFields(
      newData,
      interviewCascadeData.map((d) => d.memberData),
      interviewData
    );

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
        e.programStage === HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID &&
        e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID] === interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID]
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
        formName="HouseHoldSurveyForm"
      />
    )
  );
};

const convertOriginMetadata = (foundProgramStage) => {
  const dataElements = foundProgramStage.dataElements.map((de) => {
    const cloned = { ...de };
    cloned.code = de.id;
    cloned.hidden = HAS_INITIAN_NOVALUE.includes(de.id);

    return cloned;
  });

  return dataElements;
};

export default HouseHoldSurveyForm;
