import { generateUid } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FORM_ACTION_TYPES, HAS_INITIAN_NOVALUE, MEMBER_HOUSEHOLD_UID } from "../constants";

// Icon

import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
  MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
  MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID,
  MEMBER_TRACKED_ENTITY_TYPE_ID,
} from "@/constants/app-config";
import { submitEvent } from "@/redux/actions/data";
import { deleteEvent } from "@/redux/actions/data/tei";
import { transformEvent } from "@/utils/event";
import _ from "lodash";
import withDeleteConfirmation from "../../hocs/withDeleteConfirmation";
import CaptureForm from "../CaptureForm";
import { transformData, transformMetadataToColumns } from "../CascadeTable/utils";
import "../CustomStyles/css/bootstrap.min.css";
import "./interview-detail-table.css";
import { clearHiddenFieldData, updateMetadata } from "./utils";
import { differenceInMonths, differenceInWeeks, differenceInYears, differenceInDays } from "date-fns";
import { getQuarterlyFromDate } from "@/utils/date";
import {
  childHeathRules,
  childNutritionRules,
  demographicDetailRules,
  handleAgeFields,
  hideSectionRules,
} from "./houseHoldMemberRules";

const DeleteConfirmationButton = withDeleteConfirmation(Button);

const HouseHoldMemberTable = ({ interviewData, onClose = () => {}, disabled }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const locale = i18n.language || "en";
  const interviewId = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];

  const { currentInterviewCascade } = useSelector((state) => state.data.tei.data);

  const { programMetadataMember, selectedOrgUnit, programMetadata } = useSelector((state) => state.metadata);

  const getInterviewCascadeData = () => {
    if (!currentInterviewCascade?.[interviewId]) return [];
    return currentInterviewCascade?.[interviewId].map((r) => r.memberData);
  };

  const [originMetadata, stageDataElements] = convertOriginMetadata(programMetadataMember);

  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));
  const [dataValuesTranslate, setDataValuesTranslate] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

  const [columns, setColumns] = useState(transformMetadataToColumns(metadata, locale));

  const showData = useMemo(() => {
    return transformData(metadata, data, dataValuesTranslate, locale);
  }, [metadata, data, dataValuesTranslate, locale]);

  const handleEditRow = (e, row, rowIndex) => {
    // Update data
    let newData = _.cloneDeep(data);
    newData[rowIndex] = { ...row };

    setData(newData);

    let updatedMetadata = updateMetadata(metadata, newData);
    console.log("handleEditRow", { updatedMetadata, newData });
    setMetadata([...updatedMetadata]);

    // save event
    const interviewEvents = currentInterviewCascade[interviewId][selectedRowIndex]?.events || [];

    const demographicDataValues = {};
    const scorecardSurveyDataValues = {};
    stageDataElements[MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID].forEach((de) => {
      if (row[de.id]) demographicDataValues[de.id] = row[de.id];
    });
    stageDataElements[MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID].forEach((de) => {
      if (row[de.id]) scorecardSurveyDataValues[de.id] = row[de.id];
    });

    // init new event
    const trackedEntity = row.id;
    const enrollment = row.enrId;
    const occurredAt = interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID];
    const orgUnit = selectedOrgUnit.id;
    const program = programMetadataMember.id;

    const newEvent = {
      enrollment,
      occurredAt,
      program,
      orgUnit,
      trackedEntity,
      trackedEntityType: MEMBER_TRACKED_ENTITY_TYPE_ID,
      dueDate: occurredAt,
      status: "ACTIVE",
      _isDirty: true,
    };

    let demographicEventPayload;
    const foundDemographicEvent = interviewEvents.find((e) => e.programStage === MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID);
    if (!foundDemographicEvent) {
      demographicEventPayload = transformEvent({
        ...newEvent,
        event: generateUid(),
        dataValues: demographicDataValues,
        programStage: MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
      });
    } else {
      demographicEventPayload = transformEvent({
        ...foundDemographicEvent,
        _isDirty: true,
        dataValues: demographicDataValues,
      });
    }
    // only push -> do not refresh tei
    dispatch(submitEvent(demographicEventPayload, false));

    let scorecardSurveyEventPayload;
    const foundScorecardSurveyEvent = interviewEvents.find(
      (e) => e.programStage === MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID
    );
    if (!foundScorecardSurveyEvent) {
      scorecardSurveyEventPayload = transformEvent({
        ...newEvent,
        event: generateUid(),
        dataValues: scorecardSurveyDataValues,
        programStage: MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID,
      });
    } else {
      scorecardSurveyEventPayload = transformEvent({
        ...foundScorecardSurveyEvent,
        _isDirty: true,
        dataValues: scorecardSurveyDataValues,
      });
    }

    // default refresh tei and loading for the last
    dispatch(submitEvent(scorecardSurveyEventPayload));

    const events = [demographicEventPayload, scorecardSurveyEventPayload];
    console.log("update member events:", { events });
    onClose();
  };

  const editRowCallback = (metadata, previousData, data, code, value) => {
    // WARNING: if it's hidden, the data will be removed

    const HouseHoldMemberTable = { metadata, previousData, data, code, value };
    console.log("HouseHoldMemberTable", HouseHoldMemberTable);

    // Hide rest of the form if Membership status = "Deceased" or Migrated to "Non-PMNP Area" or "Not part of the HH"
    const hhMemberStatus = data["Rb0k4fOdysI"];
    if (hhMemberStatus === "001" || hhMemberStatus === "004" || hhMemberStatus === "002") {
      Object.keys(metadata).forEach((de) => {
        if (de === "Rb0k4fOdysI" || metadata[de].isAttribute) return;
        metadata[de].hidden = true;
      });

      clearHiddenFieldData(metadata, data);
      return;
    } else {
      Object.keys(metadata).forEach((de) => {
        metadata[de].hidden = false;
      });
    }

    // ages attribute
    metadata["d2n5w4zpxuo"].hidden = true;
    metadata["xDSSvssuNFs"].hidden = true;
    metadata["X2Oln1OyP5o"].hidden = true;
    metadata["H42aYY9JMIR"].hidden = true;

    // stage
    metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].disabled = true;
    data[HOUSEHOLD_INTERVIEW_ID_DE_ID] = interviewId;

    data["C4b8S7zjs0g"] = data[MEMBER_HOUSEHOLD_UID];
    metadata["C4b8S7zjs0g"].disabled = true;

    metadata[HOUSEHOLD_INTERVIEW_TIME_DE_ID].disabled = true;
    data[HOUSEHOLD_INTERVIEW_TIME_DE_ID] = getQuarterlyFromDate(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    const eventDate = new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);
    const dateOfbirth = new Date(data["fJPZFs2yYJQ"]);
    const years = differenceInYears(eventDate, dateOfbirth);
    const months = differenceInMonths(eventDate, dateOfbirth);
    const weeks = differenceInWeeks(eventDate, dateOfbirth);
    const days = differenceInDays(eventDate, dateOfbirth);

    data["Hc9Vgt4LXjb"] = years;
    data["RoSxLAB5cfo"] = months;
    data["Gds5wTiXoSK"] = weeks;
    data["ICbJBQoOsVt"] = days;

    const ages = { years, months, weeks, days };
    handleAgeFields(metadata, ages);
    demographicDetailRules(metadata, data, ages);
    hideSectionRules(metadata, data, programMetadataMember, ages);
    childHeathRules(metadata, data, ages);
    childNutritionRules(metadata, data, ages);

    clearHiddenFieldData(metadata, data);
  };

  const handleDeleteRow = (e, row) => {
    e.stopPropagation();

    dispatch(deleteEvent(row.id));

    let rows = data.filter((d) => d.id != row.id);

    callbackFunction(metadata, rows, null, "delete_member");
    setData([...rows]);

    let updatedMetadata = updateMetadata(metadata, rows);
    setMetadata([...updatedMetadata]);
  };

  const clearForm = () => {
    setSelectedData({});
    setMetadata(_.cloneDeep(originMetadata));
    setSelectedRowIndex(null);
    setFormStatus(FORM_ACTION_TYPES.NONE);
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (e.currentTarget && e.currentTarget.contains(e.target)) {
        const rowData = data[rowIndex];
        console.log("selected", rowData);
        setSelectedData(rowData);
        setSelectedRowIndex(rowIndex);
        setFormStatus(FORM_ACTION_TYPES.EDIT);
      }
    },
  };

  const columnsC = [
    {
      dataField: "no.",
      text: "No.",
      align: "center",
      formatter: (cellContent, row, rowIndex, extraData) => {
        return rowIndex + 1;
      },
    },
    ...columns,
  ];

  useEffect(() => {
    let tempDataValuesTranslate = metadata
      .filter((e) => e.valueSet && e.valueSet.length > 0)
      .reduce((obj, e) => {
        obj[e.code] = e.valueSet.reduce((ob, op) => {
          ob[op.value] = op.label;
          if (op.translations) {
            ob[op.value] = { ...op.translations, en: op.label };
          }
          return ob;
        }, {});
        return obj;
      }, {});

    setColumns(transformMetadataToColumns(metadata, locale, tempDataValuesTranslate));
    setDataValuesTranslate(tempDataValuesTranslate);

    return () => {
      console.log("Cascade table unmounted");
      clearForm();
    };
  }, []);

  useEffect(() => {
    const interviewCascadeData = getInterviewCascadeData();
    setData(interviewCascadeData);

    if (selectedRowIndex !== null) {
      console.log("select interview interview cascadeData", {
        interviewCascadeData,
        selectedData: interviewCascadeData[selectedRowIndex],
      });

      setSelectedData(interviewCascadeData[selectedRowIndex]);
    }
  }, [currentInterviewCascade]);

  return (
    <div className="interview-table px-4">
      <Modal backdrop={false} size="xl" scrollable keyboard={false} show={formStatus === FORM_ACTION_TYPES.EDIT}>
        <Modal.Body>
          <Card style={{ border: 0 }}>
            <Card.Body>
              <Card.Title>{t("familyMemberDetails")}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {formStatus !== FORM_ACTION_TYPES.ADD_NEW && "No." + (selectedRowIndex + 1)}
              </Card.Subtitle>
              {selectedData ? (
                <CaptureForm
                  locale={locale}
                  metadata={metadata}
                  rowIndex={selectedRowIndex}
                  data={_.cloneDeep(selectedData)}
                  formStatus={!disabled ? formStatus : FORM_ACTION_TYPES.VIEW}
                  setFormStatus={setFormStatus}
                  handleEditRow={handleEditRow}
                  handleAddNewRow={() => {}}
                  editRowCallback={editRowCallback}
                  maxDate={new Date()}
                  minDate={new Date(`1900-12-31`)}
                  formName="HouseHoldMemberTable"
                />
              ) : null}
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      <div className="row">
        <div className="col-md-12 order-md-12 mb-12 table-sm overflow-auto table-responsive pl-0">
          <BootstrapTable
            keyField="id"
            data={showData}
            columns={columnsC}
            rowEvents={rowEvents}
            hover
            striped
            condensed
          />
        </div>
      </div>
    </div>
  );
};

const convertOriginMetadata = (programMetadataMember) => {
  const metadata = [];
  const stageDataElements = {};

  const trackedEntityAttributes = programMetadataMember.trackedEntityAttributes.map((attr) => ({
    ...attr,
    code: attr.id,
    disabled: true,
    isAttribute: true,
  }));

  metadata.push(...trackedEntityAttributes);

  const programStagesDataElements = programMetadataMember.programStages.reduce((acc, stage) => {
    stage.dataElements.forEach((de) => {
      de.code = de.id;
      de.hidden = HAS_INITIAN_NOVALUE.includes(de.id);
    });

    stageDataElements[stage.id] = [...stage.dataElements];

    return [...acc, ...stage.dataElements];
  }, []);

  metadata.push(...programStagesDataElements);

  return [metadata, stageDataElements];
};

export default HouseHoldMemberTable;
