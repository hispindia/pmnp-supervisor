import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
} from "@/constants/app-config";
import { generateUid } from "@/utils";
import { useEffect, useState } from "react";
import { FORM_ACTION_TYPES, HAS_INITIAN_NOVALUE } from "../constants";
import { compareObject, updateMetadata } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { submitEvent } from "@/redux/actions/data";
import { transformEvent } from "@/utils/event";
import { useTranslation } from "react-i18next";
import { getQuarterlyFromDate } from "@/utils/date";
import CaptureForm from "../CaptureForm";
import _ from "lodash";
import { ca } from "date-fns/locale";
import { Next } from "react-bootstrap/esm/PageItem";

const InterviewResultForm = ({ interviewData = {}, onClose = () => {} }) => {
  const i18n = useTranslation();
  const locale = i18n.language || "en";

  const dispatch = useDispatch();
  const currentEvents = useSelector(
    (state) => state.data.tei.data.currentEvents
  );
  const { selectedOrgUnit, programMetadata } = useSelector(
    (state) => state.metadata
  );
  const foundProgramStage = programMetadata.programStages.find(
    (stage) => stage.id === HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID
  );
  const trackedEntity = useSelector(
    (state) => state.data.tei.data.currentTei.trackedEntity
  );
  const enrollment = useSelector(
    (state) => state.data.tei.data.currentEnrollment.enrollment
  );

  const originMetadata = convertOriginMetadata(foundProgramStage);

  const [data, setData] = useState(null);
  const [defaultData, setDefaultData] = useState({});
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));
  const [formStatus, setFormStatus] = useState(null);
  const [formDirty, setFormDirty] = useState(false);

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
      programStage: HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
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

  const InterviewResult_DEs = {
    ResultOfInterview_DE: "K2ySLF5Qnri",
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
    });

    metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].disabled = true;
    metadata[HOUSEHOLD_INTERVIEW_TIME_DE_ID].disabled = true;
    newData[HOUSEHOLD_INTERVIEW_TIME_DE_ID] = getQuarterlyFromDate(
      interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]
    );

    // InterviewResult_DEs
    metadata[InterviewResult_DEs.Order_DE].hidden = true;
    metadata[InterviewResult_DEs.NextVisitDate_DE].hidden = true;
    metadata[InterviewResult_DEs.NextVisitTime_DE].hidden = true;

    switch (data[InterviewResult_DEs.ResultOfInterview_DE]) {
      case "Others":
        metadata[InterviewResult_DEs.Order_DE].hidden = false;
        break;
      case "Postponed":
        metadata[InterviewResult_DEs.NextVisitDate_DE].hidden = false;
        metadata[InterviewResult_DEs.NextVisitTime_DE].hidden = false;
        break;
    }

    if (!newData[HOUSEHOLD_INTERVIEW_ID_DE_ID]) {
      newData[HOUSEHOLD_INTERVIEW_ID_DE_ID] =
        interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
      setFormDirty(true);
    }

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
        e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID] ===
          interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID]
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
