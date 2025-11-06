import { generateUid, pickTranslation } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FORM_ACTION_TYPES, HH_STATUS_ATTR_ID, HH_STATUSES, META_ATTR_ADD_INTERVIEW_ID } from "../constants";

// Icon
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  HOUSEHOLD_ID_ATTR_ID,
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID,
  HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
} from "@/constants/app-config";
import { useUser } from "@/hooks/useUser";
import { submitAttributes, submitEvent } from "@/redux/actions/data";
import { deleteEvent } from "@/redux/actions/data/tei";
import { transformEvent } from "@/utils/event";
import { Button } from "antd";
import { format } from "date-fns";
import _ from "lodash";
import withDeleteConfirmation from "../../hocs/withDeleteConfirmation";
import CaptureForm from "../CaptureForm";
import { transformData, transformMetadataToColumns } from "../CascadeTable/utils";
import "../CustomStyles/css/bootstrap.min.css";
import "./interview-detail-table.css";
import InterviewDetailModal from "./InterviewDetailModal";
import { clearHiddenFieldData, updateMetadata } from "./utils";

const DeleteConfirmationButton = withDeleteConfirmation(Button);

const InterviewDetailTable = ({ data, setData, metadata, originMetadata, setMetadata, callbackFunction }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const currentEvents = useSelector((state) => state.data.tei.data.currentEvents);

  const dispatch = useDispatch();
  const { isSuperuser } = useUser();

  const [dataValuesTranslate, setDataValuesTranslate] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

  const { programMetadata, selectedOrgUnit } = useSelector((state) => state.metadata);
  const { me } = useSelector((state) => state);
  const foundProgramStage = programMetadata.programStages.find(
    (stage) => stage.id === HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID,
  );
  const [columns, setColumns] = useState(transformMetadataToColumns(metadata, locale));
  const currentTei = useSelector((state) => state.data.tei.data.currentTei);
  const currentInterviewCascade = useSelector((state) => state.data.tei.data.currentInterviewCascade);
  const enrollment = useSelector((state) => state.data.tei.data.currentEnrollment.enrollment);
  const { attributes } = currentTei;
  const HH_Status = attributes[HH_STATUS_ATTR_ID];
  const isAttributeAddInterviewEnable = programMetadata.attributeValues?.[META_ATTR_ADD_INTERVIEW_ID] === "true";
  const isAddNewInterviewButtonEnable =
    (HH_Status == HH_STATUSES.pending || !HH_Status) &&
    isAttributeAddInterviewEnable &&
    HH_Status !== HH_STATUSES.migrated;

  const showData = useMemo(() => {
    return transformData(metadata, data, dataValuesTranslate, locale);
  }, [metadata, data, dataValuesTranslate, locale]);

  const handleBeforeAddNewRow = () => {
    // Before add new data
    setFormStatus(FORM_ACTION_TYPES.ADD_NEW);
    setSelectedData({ id: generateUid() });
    setSelectedRowIndex(null);
  };

  const handleOnSave = (row) => {
    // update hh status attributes
    let hhStatus = HH_STATUSES.ongoing;
    let hhResult = "";
    switch (row["WBZ6d5BF26K"]) {
      case "001":
        hhResult = "Non-Eligible";
        hhStatus = HH_STATUSES.nonEligible;
        break;
      case "002":
        hhStatus = HH_STATUSES.migrated;
        break;
      case "003":
        hhResult = "Not at home";
        hhStatus = HH_STATUSES.pending;
        break;
      case "Others":
        hhResult = "Others";
        hhStatus = HH_STATUSES.other;
        break;
      default:
        break;
    }

    // Row 33
    if (row["X28FSoTIkGv"] === "false") {
      hhStatus = HH_STATUSES.refused;
      hhResult = HH_STATUSES.refused;
    }

    // change HH status to pending
    dispatch(submitAttributes({ ...attributes, [HH_STATUS_ATTR_ID]: hhStatus }));

    // update hh result
    const found = currentEvents.find(
      (e) =>
        e.programStage === HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID &&
        e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID] === row[HOUSEHOLD_INTERVIEW_ID_DE_ID],
    );

    if (found) {
      const newEvent = _.cloneDeep(found);
      newEvent.dataValues[HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID] = hhResult;
      dispatch(submitEvent(transformEvent(newEvent), false));
    } else {
      // init new event
      const occurredAt = row[HOUSEHOLD_INTERVIEW_DATE_DE_ID];

      const dataValues = {
        [HOUSEHOLD_INTERVIEW_ID_DE_ID]: row[HOUSEHOLD_INTERVIEW_ID_DE_ID],
        [HOUSEHOLD_INTERVIEW_RESULT_COMPLETE_DE_ID]: hhResult,
      };

      const eventPayload = transformEvent({
        event: generateUid(),
        enrollment,
        occurredAt,
        dueDate: occurredAt,
        status: "ACTIVE",
        programStage: HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
        trackedEntity: currentTei.trackedEntity,
        orgUnit: selectedOrgUnit.id,
        program: programMetadata.id,
        dataValues,
        _isDirty: true,
      });

      dispatch(submitEvent(eventPayload, false));
    }
  };

  const handleAddNewRow = (e, row, continueAdd) => {
    console.trace("row:>>>", row);
    // Add new data
    !continueAdd && setFormStatus(FORM_ACTION_TYPES.NONE);
    data.push(row);

    callbackFunction(metadata, data, data.length - 1, "add");

    setData([...data]);
    let updatedMetadata = updateMetadata(metadata, data);
    setMetadata([...updatedMetadata]);

    console.log("handleAddNewRow", { updatedMetadata, data });

    // submit new event
    const { id: event, disabled, key, ...dataValues } = row;
    const occurredAt = dataValues[HOUSEHOLD_INTERVIEW_DATE_DE_ID];

    const eventPayload = transformEvent({
      event,
      enrollment,
      occurredAt,
      dueDate: occurredAt,
      status: "ACTIVE",
      programStage: HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID,
      trackedEntity: currentTei.trackedEntity,
      orgUnit: selectedOrgUnit.id,
      program: programMetadata.id,
      dataValues,
      _isDirty: true,
    });

    handleOnSave(row);
    // init new event
    dispatch(submitEvent(eventPayload));
  };

  const handleEditRow = (e, row, rowIndex) => {
    // Update data
    let newData = _.clone(data);
    newData[rowIndex] = { ...row };

    setData(newData);

    callbackFunction && callbackFunction(metadata, newData, rowIndex, "edit");

    let updatedMetadata = updateMetadata(metadata, newData);
    console.log("handleEditRow", { updatedMetadata, newData });

    setMetadata([...updatedMetadata]);
    setFormStatus(FORM_ACTION_TYPES.NONE);
    setSelectedRowIndex(null);

    // save event
    const currentEvent = currentEvents.find((e) => e.event === row.id);
    const { id, disabled, key, ...dataValues } = row;

    const occurredAt = dataValues[HOUSEHOLD_INTERVIEW_DATE_DE_ID];

    const eventPayload = transformEvent({
      ...currentEvent,
      _isDirty: true,
      occurredAt,
      dueDate: occurredAt,
      dataValues,
    });

    handleOnSave(row);
    dispatch(submitEvent(eventPayload));
  };

  const InterviewDetails_DEs = {
    HouseholdUpdate_DE: "WBZ6d5BF26K",
    HouseholdUpdateOthers_DE: "DX407PNjTii",
    InterviewerName_DE: "I7TcNuraOlE",
  };

  const editRowCallback = (metadata, previousData, data, code, value) => {
    console.log("New InterviewDetailForm", {
      enrollment,
      metadata,
      previousData,
      data,
      code,
      value,
    });

    metadata[HOUSEHOLD_INTERVIEW_ID_DE_ID].disabled = true;
    metadata[HOUSEHOLD_INTERVIEW_DATE_DE_ID].disabled = true;
    if (!data[HOUSEHOLD_INTERVIEW_ID_DE_ID]) data[HOUSEHOLD_INTERVIEW_ID_DE_ID] = generateUid();

    // Interviewer's name
    metadata[InterviewDetails_DEs.InterviewerName_DE].disabled = true;
    data[InterviewDetails_DEs.InterviewerName_DE] = me.name || me.displayName;

    // InterviewDetails_DEs
    metadata[InterviewDetails_DEs.HouseholdUpdateOthers_DE].hidden = true;
    if (data[InterviewDetails_DEs.HouseholdUpdate_DE] === "Others") {
      metadata[InterviewDetails_DEs.HouseholdUpdateOthers_DE].hidden = false;
    }

    // Visit number length
    if (!data["Wdg76PCqsBn"]) data["Wdg76PCqsBn"] = Object.keys(currentInterviewCascade || {}).length + 1;
    metadata["Wdg76PCqsBn"].disabled = true;

    // Respondent ID - SrFa2O3m6ff
    metadata["C4b8S7zjs0g"].disabled = true;
    data["C4b8S7zjs0g"] = attributes[HOUSEHOLD_ID_ATTR_ID];

    // AUTO assign date and time
    if (!data["oUi6zQUzT2S"]) data["oUi6zQUzT2S"] = format(new Date(), "yyyy-MM-dd");
    if (!data["j3xi4RiKG5X"]) data["j3xi4RiKG5X"] = format(new Date(), "HH:mm");

    clearHiddenFieldData(metadata, data);

    metadata["X28FSoTIkGv"].displayOption = "RADIO";
  };

  const handleDeleteRow = (e, row) => {
    e.stopPropagation();

    try {
      // need to delete all events relative interview id
      const interviewId = row[HOUSEHOLD_INTERVIEW_ID_DE_ID];
      const householdEvents = currentEvents.reduce(
        (acc, e) => (e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID] === interviewId ? [...acc, e.event] : acc),
        [],
      );
      const householdMemberEvents = currentInterviewCascade[interviewId].reduce((acc, row) => {
        row.events.forEach((e) => {
          acc.push(e.event);
        });
        return acc;
      }, []);

      const listId = householdEvents.concat(householdMemberEvents);

      console.log("delete interviews", listId);
      // reload tei for the last index === listId.length - 1
      listId.forEach((eventId, index) => dispatch(deleteEvent(eventId, index === listId.length - 1)));
      let rows = data.filter((d) => d.id != row.id);

      callbackFunction(metadata, rows, null, "delete_member");
      setData([...rows]);

      let updatedMetadata = updateMetadata(metadata, rows);
      setMetadata([...updatedMetadata]);
    } catch (error) {
      console.log(error);
    }
  };

  const clearForm = () => {
    setSelectedData({});
    setMetadata(originMetadata);
    setSelectedRowIndex(null);
    setFormStatus(FORM_ACTION_TYPES.NONE);
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (e.currentTarget && e.currentTarget.contains(e.target)) {
        if (row.disabled) setFormStatus(FORM_ACTION_TYPES.VIEW);
        console.log("InterviewDetailTable selected", row);
        setSelectedData(data[rowIndex]);
        setSelectedRowIndex(rowIndex);
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
    {
      dataField: "actions",
      text: "Actions",
      align: "center",
      formatter: (cellContent, row, rowIndex, extraData) => {
        if (!isSuperuser) return null;
        return (
          <div style={{ display: "flex", gap: 8, padding: "0 8px" }}>
            <Button
              size="small"
              disabled={extraData !== FORM_ACTION_TYPES.NONE || row.disabled}
              onClick={() => {
                setSelectedData(data[rowIndex]);
                setSelectedRowIndex(rowIndex);
                setFormStatus(FORM_ACTION_TYPES.EDIT);
              }}
            >
              <FontAwesomeIcon icon={faEdit} size="xs" />
            </Button>
            <DeleteConfirmationButton
              size="small"
              danger
              disabled={extraData !== FORM_ACTION_TYPES.NONE || row.disabled}
              title={t("delete")}
              onDelete={(e) => {
                handleDeleteRow(e, row);
              }}
              messageText={t("deleteDialogContent")}
              cancelText={t("cancel")}
              deleteText={t("delete")}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onCancel={(e) => {
                callbackFunction(metadata, row, rowIndex, "clean");
              }}
            >
              <FontAwesomeIcon icon={faTrash} size="xs" />
            </DeleteConfirmationButton>
          </div>
        );
      },
      formatExtraData: formStatus,
    },
  ];

  useEffect(() => {
    let tempDataValuesTranslate = metadata
      .filter((e) => e.valueSet && e.valueSet.length > 0)
      .reduce((obj, e) => {
        obj[e.code] = e.valueSet.reduce((ob, op) => {
          ob[op.value] = op.label;
          if (op.translations) {
            ob[op.value] = {
              ...op.translations.reduce(
                (acc, { locale }) => ({ ...acc, [locale]: pickTranslation({ ...op, name: op.label }, locale) }),
                {},
              ),
              en: op.label,
            };
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
  }, [locale]);

  return (
    <div className="interview-table px-3 mt-2">
      <InterviewDetailModal
        interviewData={selectedData}
        metadata={metadata}
        formStatus={formStatus}
        selectedRowIndex={selectedRowIndex}
        open={selectedRowIndex !== null && formStatus !== FORM_ACTION_TYPES.EDIT}
        onClose={() => {
          setSelectedData({});
          setSelectedRowIndex(null);
          setFormStatus(FORM_ACTION_TYPES.NONE);
        }}
      />
      <Modal
        backdrop="static"
        size="xl"
        keyboard={false}
        show={formStatus === FORM_ACTION_TYPES.ADD_NEW || formStatus === FORM_ACTION_TYPES.EDIT}
      >
        <Modal.Body>
          <Card style={{ border: 0 }}>
            <Card.Body>
              <CaptureForm
                formProgramMetadata={{ programStages: [foundProgramStage] }}
                locale={locale}
                metadata={metadata}
                rowIndex={selectedRowIndex}
                data={_.cloneDeep(selectedData)}
                formStatus={formStatus}
                setFormStatus={setFormStatus}
                handleEditRow={handleEditRow}
                handleAddNewRow={handleAddNewRow}
                editRowCallback={editRowCallback}
                onCancel={clearForm}
                maxDate={new Date()}
                minDate={new Date(`1900-12-31`)}
                formName="InterviewDetailForm"
              />
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      <div className="row">
        <div className="mb-4 mr-auto mr-sm-0 mt-1">
          <Button
            type="primary"
            size="sm"
            style={{ width: 160 }}
            onClick={handleBeforeAddNewRow}
            disabled={!isAddNewInterviewButtonEnable}
            aria-controls="collapseExample"
            aria-expanded={formStatus === FORM_ACTION_TYPES.ADD_NEW}
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            {t("addNewInterview")}
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 order-md-12 mb-12 table-sm overflow-auto table-responsive pl-0">
          <BootstrapTable
            // classes="disable-triple"
            keyField="id"
            data={showData}
            columns={columnsC}
            rowEvents={rowEvents}
            rowClasses={(row) => (row.disabled ? "disabled-row" : "open-row")}
            condensed
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailTable;
