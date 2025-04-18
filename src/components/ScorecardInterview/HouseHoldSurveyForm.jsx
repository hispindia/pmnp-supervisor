import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
  HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID,
} from "@/constants/app-config";
import { generateUid } from "@/utils";
import { useEffect, useState } from "react";
import { FORM_ACTION_TYPES, HAS_INITIAN_NOVALUE } from "../constants";
import { clearHiddenFieldData, compareObject, updateMetadata } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { submitEvent } from "@/redux/actions/data";
import { transformEvent } from "@/utils/event";
import CaptureForm from "../CaptureForm";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { getQuarterlyFromDate } from "@/utils/date";
import { useInterviewCascadeData } from "@/hooks/useInterviewCascadeData";
import { calculateHouseHoldFields } from "./calculateHouseHoldFields";

const HouseHoldSurveyForm = ({ interviewData = {}, onClose = () => {} }) => {
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

  console.log({ originMetadata });

  const [data, setData] = useState(null);
  const [defaultData, setDefaultData] = useState({});
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));
  const [formStatus, setFormStatus] = useState(null);
  const [formDirty, setFormDirty] = useState(false);

  console.log("HouseHoldSurveyForm", {
    formDirty,
    interviewData,
    interviewCascadeData,
  });

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

    console.log({ eventPayload });
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

    console.log({ eventPayload });
    dispatch(submitEvent(eventPayload));
    setFormDirty(false);
    onClose();
  };

  const DEs = {
    Q801: "dtTG7cjn1CH",
    Q802: "RC5B8EETrOM",
    PleaseSpecifyTheOtherGovernment: "b918Rl73Eu0",

    Q900: "dxag8YT8w46",
    Q901: "gNBFmUFtW6a",
  };

  const editRowCallback = (metadata, previousData, newData, code, value) => {
    console.log("HouseHoldSurveyForm change", {
      defaultData,
      metadata,
      previousData,
      newData,
      code,
      value,
    });

    metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].disabled = true;

    // Quaterly update
    metadata[HOUSEHOLD_INTERVIEW_TIME_DE_ID].disabled = true;
    newData[HOUSEHOLD_INTERVIEW_TIME_DE_ID] = getQuarterlyFromDate(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    if (!newData[HOUSEHOLD_INTERVIEW_ID_DE_ID]) {
      newData[HOUSEHOLD_INTERVIEW_ID_DE_ID] = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
      setFormDirty(true);
    }

    metadata[DEs.Q802].hidden = newData[DEs.Q801] !== "true";
    metadata[DEs.PleaseSpecifyTheOtherGovernment].hidden = newData[DEs.Q802] !== "Others";

    metadata[DEs.Q901].hidden = newData[DEs.Q900] !== "true";
    // SHOW 'Other social and behaviour Change (SBC) sessions' if 'social and behaviour Change (SBC) sessions (Q 901)' = 'Others'
    metadata["S6aWPoAIthD"].hidden = newData["gNBFmUFtW6a"] !== "5";

    // Calculate fields
    // Score_Number of 4Ps Members
    calculateHouseHoldFields(newData, interviewCascadeData);

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
      console.log("form unmounted");
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
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        handleEditRow={handleEdit}
        handleAddNewRow={handleAddNew}
        editRowCallback={editRowCallback}
        maxDate={new Date()}
        minDate={new Date(`1900-12-31`)}
      />
    )
  );
};

const convertOriginMetadata = (foundProgramStage) => {
  const dataElements = foundProgramStage.dataElements.map((de) => {
    return {
      ...de,
      code: de.id,
      hidden: HAS_INITIAN_NOVALUE.includes(de.id),
    };
  });

  return dataElements;
};

export default HouseHoldSurveyForm;
