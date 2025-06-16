import { generateUid } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FORM_ACTION_TYPES, HAS_INITIAN_NOVALUE, MEMBER_HOUSEHOLD_UID, VACCINE_DATE_DE_IDS } from "../constants";

// Icon

import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
  MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
  MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID,
  MEMBER_TRACKED_ENTITY_TYPE_ID,
} from "@/constants/app-config";
import { useInterviewCascadeData } from "@/hooks/useInterviewCascadeData";
import { usePushData } from "@/hooks/usePushData";
import { submitEvent } from "@/redux/actions/data";
import { deleteEvent } from "@/redux/actions/data/tei";
import { getQuarterlyFromDate } from "@/utils/date";
import { transformEvent } from "@/utils/event";
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears } from "date-fns";
import _ from "lodash";
import CaptureForm from "../CaptureForm";
import { transformData, transformMetadataToColumns } from "../CascadeTable/utils";
import "../CustomStyles/css/bootstrap.min.css";
import {
  childHeathRules,
  childNutritionRules,
  demographicDetailRules,
  handleAgeAttrsOfTEI,
  handleAgeFields,
  handleZScore,
  hideSectionRules,
} from "./houseHoldMemberRules";
import "./interview-detail-table.css";
import { clearHiddenFieldData, generateTEIDhis2Payload, updateMetadata } from "./utils";

const HouseHoldMemberTable = ({ interviewData, onClose = () => {}, disabled }) => {
  const { t, i18n } = useTranslation();
  const { pustTei } = usePushData();
  const dispatch = useDispatch();
  const locale = i18n.language || "en";
  const interviewId = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
  const { interviewCascadeData, femalesIn15And49, isAllMemberEventsCompleted } = useInterviewCascadeData(interviewData);
  const { currentInterviewCascade } = useSelector((state) => state.data.tei.data);
  const { programMetadataMember, selectedOrgUnit } = useSelector((state) => state.metadata);
  const cascadeFemalesIn15And49 = femalesIn15And49.map((member) => member.memberData);

  const [originMetadata, stageDataElements] = convertOriginMetadata(programMetadataMember, cascadeFemalesIn15And49);

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

  const handleEditRow = (e, row, rowIndex, type) => {
    // Update data
    let newData = _.cloneDeep(data);
    newData[rowIndex] = { ...row };

    setData(newData);

    let updatedMetadata = updateMetadata(metadata, newData);
    console.log("handleEditRow", { updatedMetadata, newData });
    setMetadata([...updatedMetadata]);

    // save event
    const interviewEvents = interviewCascadeData[selectedRowIndex]?.events || [];

    const demographicDataValues = {};
    stageDataElements[MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID].forEach((de) => {
      demographicDataValues[de.id] = row[de.id];
    });

    const scorecardSurveyDataValues = {};
    stageDataElements[MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID].forEach((de) => {
      scorecardSurveyDataValues[de.id] = row[de.id];
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

    const status = type == "submit" ? "COMPLETED" : "ACTIVE";

    let demographicEventPayload;
    const foundDemographicEvent = interviewEvents.find((e) => e.programStage === MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID);
    if (!foundDemographicEvent) {
      demographicEventPayload = transformEvent({
        ...newEvent,
        event: generateUid(),
        dataValues: demographicDataValues,
        status,
        programStage: MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
      });
    } else {
      demographicEventPayload = transformEvent({
        ...foundDemographicEvent,
        _isDirty: true,
        status,
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
        status,
        programStage: MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID,
      });
    } else {
      scorecardSurveyEventPayload = transformEvent({
        ...foundScorecardSurveyEvent,
        _isDirty: true,
        status,
        dataValues: scorecardSurveyDataValues,
      });
    }

    // default refresh tei and loading for the last
    dispatch(submitEvent(scorecardSurveyEventPayload));

    // update member TEI
    const currentTei = newData[rowIndex];
    let updatedMemberTei = generateTEIDhis2Payload({
      teiData: currentTei,
      programMetadata: programMetadataMember,
      orgUnit,
    });

    pustTei({ currentTei: updatedMemberTei });

    const events = [demographicEventPayload, scorecardSurveyEventPayload];
    console.log("update member events:", { events, scorecardSurveyDataValues });
    onClose();
  };

  const editRowCallback = (metadataOrigin, previousData, data, code, value) => {
    // WARNING: if it's hidden, the data will be removed

    let metadata = (metaId) => {
      if (!metadataOrigin[metaId]) return {};
      return metadataOrigin[metaId];
    };

    console.log("HouseHoldMemberTable", { metadata, previousData, data, code, value, interviewData });

    // stage
    metadata(HOUSEHOLD_INTERVIEW_ID_DE_ID).disabled = true;

    // Hide rest of the form if Membership status = "Deceased" or Migrated to "Non-PMNP Area" or "Not part of the HH"
    const hhMemberStatus = data["Rb0k4fOdysI"];
    if (hhMemberStatus === "001" || hhMemberStatus === "004" || hhMemberStatus === "002") {
      Object.keys(metadataOrigin).forEach((de) => {
        if (
          [
            HOUSEHOLD_INTERVIEW_ID_DE_ID,
            "Rb0k4fOdysI",
            "Hc9Vgt4LXjb",
            "RoSxLAB5cfo",
            "Gds5wTiXoSK",
            "ICbJBQoOsVt",
            "d2n5w4zpxuo",
            "xDSSvssuNFs",
            "X2Oln1OyP5o",
            "H42aYY9JMIR",
          ].includes(de) ||
          metadata(de).isAttribute
        )
          return;
        metadata(de).hidden = true;
      });

      clearHiddenFieldData(metadata, data);
      return;
    } else {
      Object.keys(metadata).forEach((de) => {
        metadata(de).hidden = false;
      });
    }

    // ages de
    metadata("d2n5w4zpxuo").hidden = true;
    metadata("xDSSvssuNFs").hidden = true;
    metadata("X2Oln1OyP5o").hidden = true;
    metadata("H42aYY9JMIR").hidden = true;

    data[HOUSEHOLD_INTERVIEW_ID_DE_ID] = interviewId;

    data["C4b8S7zjs0g"] = data[MEMBER_HOUSEHOLD_UID];
    metadata("C4b8S7zjs0g").disabled = true;

    metadata(HOUSEHOLD_INTERVIEW_TIME_DE_ID).disabled = true;
    data[HOUSEHOLD_INTERVIEW_TIME_DE_ID] = getQuarterlyFromDate(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    const eventDate = new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);
    const dateOBbirth = new Date(data["fJPZFs2yYJQ"]);
    const years = differenceInYears(eventDate, dateOBbirth);
    const months = differenceInMonths(eventDate, dateOBbirth);
    const weeks = differenceInWeeks(eventDate, dateOBbirth);
    const days = differenceInDays(eventDate, dateOBbirth);
    const ages = { years, months, weeks, days };
    hideSectionRules(metadata, data, programMetadataMember, ages);

    // vaccine before date of birth
    VACCINE_DATE_DE_IDS.forEach((id) => (metadata(id).minDate = data["fJPZFs2yYJQ"]));

    data["Hc9Vgt4LXjb"] = years;
    data["RoSxLAB5cfo"] = months;
    data["Gds5wTiXoSK"] = weeks;
    data["ICbJBQoOsVt"] = days;

    // z-score
    // Height	CY4OTulUceX
    // Weight	iFiOPAxrJIF
    // Age in months	RoSxLAB5cfo
    // Gender	Qt4YSwPxw0X
    if (data["uYWxyRYP7GN"]) {
      const monthsByLastMonitoring = differenceInMonths(new Date(data["uYWxyRYP7GN"]), dateOBbirth);
      handleZScore(data, {
        ageInMonths: monthsByLastMonitoring,
        heightInCm: data["CY4OTulUceX"],
        weight: data["iFiOPAxrJIF"],
        gender: data["Qt4YSwPxw0X"],
      });
    }

    // INT_Visit number
    data["Wdg76PCqsBn"] = interviewData["Wdg76PCqsBn"];

    handleAgeFields(metadata, ages);
    demographicDetailRules(metadata, data, ages);
    childHeathRules(metadata, data, ages);
    childNutritionRules(metadata, data, ages);
    clearHiddenFieldData(metadata, data);
    handleAgeAttrsOfTEI(data, ages);
    // Pregnancy status (DE UID: ycBIHr9bYyw) == 2
    // Show Recently gave birth within 28 days (DE UID: se8TXlLUzh8)
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
      clearForm();
    };
  }, []);

  useEffect(() => {
    const cascadeData = interviewCascadeData.map((i) => i.memberData);
    const sorted = _.sortBy(cascadeData, (item) => Number(item["QAYXozgCOHu"] || 0));
    setData(sorted);
    if (selectedRowIndex !== null) {
      console.log("select interview interview cascadeData", {
        interviewCascadeData,
        selectedData: interviewCascadeData[selectedRowIndex],
      });

      setSelectedData(interviewCascadeData[selectedRowIndex]);
    }
  }, [currentInterviewCascade]);

  const rowClasses = (row, rowIndex) => {
    if (row.isSaved && row.status === "COMPLETED") {
      return "disabled-row";
    } else {
      return "open-row";
    }
  };

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
                  showSubmitButtons
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
            condensed
            rowClasses={rowClasses}
          />
        </div>
      </div>
    </div>
  );
};

const convertOriginMetadata = (programMetadataMember, cascadeMembers) => {
  const metadata = [];
  const stageDataElements = {};

  const trackedEntityAttributes = programMetadataMember.trackedEntityAttributes.map((attr) => ({
    ...attr,
    code: attr.id,
    disabled: true,
    isAttribute: true,
  }));

  metadata.push(...trackedEntityAttributes);

  const valueSetListOfFemales = createValueSet(cascadeMembers, "PIGLwIaw0wy", "Cn37lbyhz6f");

  const programStagesDataElements = programMetadataMember.programStages.reduce((acc, stage) => {
    stage.dataElements.forEach((de) => {
      // Drop down for mother’s name
      if (de.id === "q0WEgMBwi0p") {
        de.valueSet = valueSetListOfFemales;
      }

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

const createValueSet = (cascadeMembers, labelID, valueID) => {
  return cascadeMembers.reduce((acc, curr) => {
    const label = curr[labelID];
    const value = curr[valueID];

    acc.push({
      value,
      label,
    });

    return acc;
  }, []);
};
