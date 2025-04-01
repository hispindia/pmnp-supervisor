import { generateUid } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  FORM_ACTION_TYPES,
  HAS_INITIAN_NOVALUE,
  MEMBER_HOUSEHOLD_UID,
} from "../constants";

// Icon

import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
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
import {
  transformData,
  transformMetadataToColumns,
} from "../CascadeTable/utils";
import "../CustomStyles/css/bootstrap.min.css";
import "./interview-detail-table.css";
import { updateMetadata } from "./utils";
import { differenceInWeeks, differenceInYears } from "date-fns";

const DeleteConfirmationButton = withDeleteConfirmation(Button);

const HouseHoldMemberTable = ({ interviewData, onClose = () => {} }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const locale = i18n.language || "en";
  const interviewId = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];

  const { currentInterviewCascade } = useSelector(
    (state) => state.data.tei.data
  );

  const { programMetadataMember, selectedOrgUnit } = useSelector(
    (state) => state.metadata
  );

  const getInterviewCascadeData = () => {
    if (!currentInterviewCascade?.[interviewId]) return [];
    return currentInterviewCascade?.[interviewId].map((r) => r.memberData);
  };

  const [originMetadata, stageDataElements] = convertOriginMetadata(
    programMetadataMember
  );

  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));
  const [dataValuesTranslate, setDataValuesTranslate] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

  const [columns, setColumns] = useState(
    transformMetadataToColumns(metadata, locale)
  );

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
    const interviewEvents =
      currentInterviewCascade[interviewId][selectedRowIndex]?.events || [];

    const demographicDataValues = {};
    const scorecardSurveyDataValues = {};
    stageDataElements[MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID].forEach((de) => {
      if (row[de.id]) demographicDataValues[de.id] = row[de.id];
    });
    stageDataElements[MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID].forEach(
      (de) => {
        if (row[de.id]) scorecardSurveyDataValues[de.id] = row[de.id];
      }
    );

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
    const foundDemographicEvent = interviewEvents.find(
      (e) => e.programStage === MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID
    );
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

  const DEs = {
    Q511: "RXWSlNxAwq1",
    Q512: "zLJX0cTUhbU",
  };

  const editRowCallback = (metadata, previousData, data, code, value) => {
    console.log("HouseHoldMemberTable", {
      metadata,
      previousData,
      data,
      code,
      value,
    });

    // WARNING: if it's hidden, the data will be removed
    metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].disabled = true;
    data[HOUSEHOLD_INTERVIEW_ID_DE_ID] = interviewId;

    data["C4b8S7zjs0g"] = data[MEMBER_HOUSEHOLD_UID];
    metadata["C4b8S7zjs0g"].disabled = true;

    // ages
    metadata["d2n5w4zpxuo"].hidden = true;
    metadata["xDSSvssuNFs"].hidden = true;
    metadata["X2Oln1OyP5o"].hidden = true;
    metadata["H42aYY9JMIR"].hidden = true;

    const eventDate = new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);
    const dateOfbirth = new Date(data["fJPZFs2yYJQ"]);
    const years = differenceInYears(eventDate, dateOfbirth);
    const weeks = differenceInWeeks(eventDate, dateOfbirth);

    data["Hc9Vgt4LXjb"] = years;
    data["Gds5wTiXoSK"] = weeks;

    if (!weeks || weeks >= 52) {
      metadata["Gds5wTiXoSK"].hidden = true;
      metadata["Hc9Vgt4LXjb"].hidden = false;
    } else {
      metadata["Gds5wTiXoSK"].hidden = false;
      metadata["Hc9Vgt4LXjb"].hidden = true;
    }

    // Menstrual history should be NA for males and questions on LMP, pregnancy status should be hidden
    if (data["Qt4YSwPxw0X"] === "2" || data["WbgQ0SZFiAU"] === "3") {
      metadata["qlt8LOSENj8"].hidden = true;
      metadata["ycBIHr9bYyw"].hidden = true;
      data["WbgQ0SZFiAU"] = "3";
    } else {
      metadata["qlt8LOSENj8"].hidden = false;
      metadata["ycBIHr9bYyw"].hidden = false;
    }

    // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
    if (data["OiOvGqVEyY9"] === "2" || data["OiOvGqVEyY9"] === "3") {
      metadata["g276qF2fXHi"].hidden = true;
      metadata["wxN2PuLymoY"].hidden = true;
    } else {
      metadata["g276qF2fXHi"].hidden = false;
      metadata["wxN2PuLymoY"].hidden = false;
    }

    // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
    if (data["WbgQ0SZFiAU"] !== "1") {
      metadata["qlt8LOSENj8"].hidden = true;
    } else {
      metadata["qlt8LOSENj8"].hidden = false;
    }

    // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
    if (data["OiOvGqVEyY9"] !== "1") {
      metadata["g276qF2fXHi"].hidden = true;
    } else {
      metadata["g276qF2fXHi"].hidden = false;
    }

    // 4Ps Household ID number	Only show when '4Ps membership' = Yes / 1
    const psMembership = data["wxN2PuLymoY"];
    if (psMembership !== "1") {
      metadata["CEF6Dkpe2jW"].hidden = true;
    } else {
      metadata["CEF6Dkpe2jW"].hidden = false;
    }

    // PHIC ID	Only show when 'PHIC membership' = Yes / 1
    const PhiCMembership = data["JjFcU1L7Ll1"];
    if (PhiCMembership !== "1") {
      metadata["Yp6gJAdu4yX"].hidden = true;
    } else {
      metadata["Yp6gJAdu4yX"].hidden = false;
    }
    const dateOfBirth = data["fJPZFs2yYJQ"];

    let shownSections = [];
    let hiddenSections = [
      "IxbqFSJPfEN",
      "A2TBfLOW8HG",
      "tlNWZDOWfP2",
      "jV8O1ZITgIn",
      "E4FpYkBzAsW",
      "fVGAPxIFZoO",
    ];

    const pregnancyStatus = data["ycBIHr9bYyw"];
    if (pregnancyStatus === "1") {
      hiddenSections = hiddenSections.filter((h) => h !== "IxbqFSJPfEN");
      shownSections.push("IxbqFSJPfEN");
    }
    if (pregnancyStatus === "2") {
      hiddenSections = hiddenSections.filter((h) => h !== "A2TBfLOW8HG");
      shownSections.push("A2TBfLOW8HG");

      hiddenSections = hiddenSections.filter((h) => h !== "fVGAPxIFZoO");
      shownSections.push("fVGAPxIFZoO");
    }
    if (dateOfBirth) {
      if (years <= 5) {
        hiddenSections = hiddenSections.filter(
          (s) => s !== "tlNWZDOWfP2" || s !== "jV8O1ZITgIn"
        );
        shownSections.push("tlNWZDOWfP2");
        shownSections.push("jV8O1ZITgIn");
      }

      const sex = data["Qt4YSwPxw0X"];
      if (
        years >= 10 &&
        years <= 49 &&
        sex === "1" &&
        (pregnancyStatus === "2" || pregnancyStatus === "3")
      ) {
        hiddenSections = hiddenSections.filter((h) => h !== "E4FpYkBzAsW");
        shownSections.push("E4FpYkBzAsW");
      }
    }

    const scorecardSurveyStage = programMetadataMember.programStages.find(
      (ps) => ps.id === MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID
    );

    if (scorecardSurveyStage) {
      scorecardSurveyStage.programStageSections.forEach((pss) => {
        if (hiddenSections.includes(pss.id)) {
          pss.dataElements.forEach((de) => {
            metadata[de.id].hidden = true;
          });
        }
        if (shownSections.includes(pss.id)) {
          pss.dataElements.forEach((de) => {
            metadata[de.id].hidden = false;
          });
        }
      });
    }

    switch (data[DEs.Q511]) {
      case "1":
        metadata[DEs.Q512].hidden = true;
        break;
      case "2":
      case "3":
      case "4":
        metadata[DEs.Q512].hidden = false;
        break;
      default:
        metadata[DEs.Q512].hidden = true;
        break;
    }

    // clear data for hidden items
    for (let meta in metadata) {
      if (metadata[meta].hidden) {
        delete data[meta];
      }
    }
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
    // TODO
    // {
    //   dataField: "actions",
    //   text: "Actions",
    //   align: "center",
    //   formatter: (cellContent, row, rowIndex, extraData) => {
    //     return (
    //       <DeleteConfirmationButton
    //         variant="outline-danger"
    //         size="sm"
    //         disabled={extraData !== FORM_ACTION_TYPES.NONE}
    //         title={t("delete")}
    //         onDelete={(e) => {
    //           handleDeleteRow(e, row);
    //         }}
    //         messageText={t("deleteDialogContent")}
    //         cancelText={t("cancel")}
    //         deleteText={t("delete")}
    //         onClick={(e) => {
    //           e.stopPropagation();
    //         }}
    //         onCancel={(e) => {
    //           callbackFunction(metadata, row, rowIndex, "clean");
    //         }}
    //       >
    //         <FontAwesomeIcon icon={faTrash} size="xs" />
    //       </DeleteConfirmationButton>
    //     );
    //   },
    //   formatExtraData: formStatus,
    // },
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

    setColumns(
      transformMetadataToColumns(metadata, locale, tempDataValuesTranslate)
    );
    setDataValuesTranslate(tempDataValuesTranslate);

    return () => {
      console.log("Cascade table unmounted");
      clearForm();
    };
  }, []);

  useEffect(() => {
    const interviewCascadeData = getInterviewCascadeData();
    setData(interviewCascadeData);

    console.log({ currentInterviewCascade, interviewCascadeData });
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
      <Modal
        backdrop={false}
        size="xl"
        scrollable
        keyboard={false}
        show={formStatus === FORM_ACTION_TYPES.EDIT}
      >
        <Modal.Body>
          <Card>
            <Card.Body>
              <Card.Title>{t("familyMemberDetails")}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {formStatus !== FORM_ACTION_TYPES.ADD_NEW &&
                  "No." + (selectedRowIndex + 1)}
              </Card.Subtitle>
              <CaptureForm
                locale={locale}
                metadata={metadata}
                rowIndex={selectedRowIndex}
                data={_.cloneDeep(selectedData)}
                formStatus={formStatus}
                setFormStatus={setFormStatus}
                handleEditRow={handleEditRow}
                handleAddNewRow={() => {}}
                editRowCallback={editRowCallback}
                maxDate={new Date()}
                minDate={new Date(`1900-12-31`)}
              />
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

  programMetadataMember.trackedEntityAttributes.forEach((attr) => {
    attr.code = attr.id;
    attr.disabled = true;
  });

  metadata.push(...programMetadataMember.trackedEntityAttributes);

  const programStagesDataElements = programMetadataMember.programStages.reduce(
    (acc, stage) => {
      stage.dataElements.forEach((de) => {
        de.code = de.id;
        de.hidden = HAS_INITIAN_NOVALUE.includes(de.id);
      });

      stageDataElements[stage.id] = [...stage.dataElements];

      return [...acc, ...stage.dataElements];
    },
    []
  );

  metadata.push(...programStagesDataElements);

  return [metadata, stageDataElements];
};

export default HouseHoldMemberTable;
