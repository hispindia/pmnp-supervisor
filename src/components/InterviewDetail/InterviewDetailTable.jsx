import { generateUid } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FORM_ACTION_TYPES } from "../constants";

// Icon
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  HOUSEHOLD_ID_ATTR_ID,
  HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
  INTERVIEW_ID_DATAELEMENT_ID,
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

const DeleteConfirmationButton = withDeleteConfirmation(Button);

const InterviewDetailTable = ({
  data,
  setData,
  metadata,
  originMetadata,
  setMetadata,
  callbackFunction,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const currentEvents = useSelector(
    (state) => state.data.tei.data.currentEvents
  );

  const dispatch = useDispatch();

  const [dataValuesTranslate, setDataValuesTranslate] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const { programMetadata } = useSelector((state) => state.metadata);
  const [columns, setColumns] = useState(
    transformMetadataToColumns(metadata, locale)
  );
  const attributes = useSelector(
    (state) => state.data.tei.data.currentTei.attributes
  );

  const showData = useMemo(() => {
    return transformData(metadata, data, dataValuesTranslate, locale);
  }, [metadata, data, dataValuesTranslate, locale]);

  const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

  const handleBeforeAddNewRow = () => {
    // Before add new data
    setFormStatus(FORM_ACTION_TYPES.ADD_NEW);
    setSelectedData({ id: generateUid() });
    setSelectedRowIndex(null);
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
    let cloneEvent = currentEvents[currentEvents.length - 1];
    const { id, ...dataValues } = row;

    const occurredAt = dataValues[HOUSEHOLD_INTERVIEW_TIME_DE_ID];

    // init new event
    dispatch(
      submitEvent(
        transformEvent({
          ...cloneEvent,
          _isDirty: true,
          event: id,
          occurredAt,
          dueDate: occurredAt,
          status: "ACTIVE",
          programStage: HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID,
          dataValues,
        })
      )
    );
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

    // save event
    const currentEvent = currentEvents.find((e) => e.event === row.id);
    const { id, ...dataValues } = row;

    const occurredAt = dataValues[HOUSEHOLD_INTERVIEW_TIME_DE_ID];

    dispatch(
      submitEvent(
        transformEvent({
          ...currentEvent,
          _isDirty: true,
          occurredAt,
          dueDate: occurredAt,
          dataValues,
        })
      )
    );
  };

  const updateMetadata = (metadata, data) => {
    metadata.forEach((md) => {
      // Options
      if (md.valueSet) {
        md.valueSet.forEach((item) => {
          // Compulsory
          if (md.existCompulsory) {
            if (data.length == 0) {
              if (item.compulsory && !_.some(data, { [md.code]: item.value })) {
                item.isDisabled = false;
              } else {
                item.isDisabled = true;
              }
            } else {
              item.isDisabled = false;
            }
          }

          // Unique
          if (item.unique) {
            if (_.some(data, { [md.code]: item.value })) {
              item.isDisabled = true;
            }
          }

          // Number column
          // if (item.orderNumber) {
          //   if (_.some(data.dataVals, { [md.code]: item.code })) {
          //     item.disabled = true;
          //   } else {
          //     item.disabled = false;
          //   }
          // }
        });
      }
    });
    return metadata;
  };

  const editRowCallback = (metadata, previousData, data, code, value) => {
    console.log("InterviewDetailForm", {
      metadata,
      previousData,
      data,
      code,
      value,
    });

    // WARNING: if it's hidden, the data will be removed
    metadata[INTERVIEW_ID_DATAELEMENT_ID].disabled = true;

    // Respondent ID - SrFa2O3m6ff
    metadata["C4b8S7zjs0g"].disabled = true;
    data["C4b8S7zjs0g"] = attributes[HOUSEHOLD_ID_ATTR_ID];
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

  const handleSelectRow = (e, row, rowIndex) => {
    console.log("selected", row);
    setFormStatus(FORM_ACTION_TYPES.EDIT);
    setSelectedData(row);
    setSelectedRowIndex(rowIndex);
  };

  const clearForm = () => {
    setSelectedData({});
    setMetadata(originMetadata);
    setSelectedRowIndex(null);
    setFormStatus(FORM_ACTION_TYPES.NONE);
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (e.currentTarget && e.currentTarget.contains(e.target))
        handleSelectRow(e, data[rowIndex], rowIndex);
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
    ...columns.filter((c) => c.dataField !== HOUSEHOLD_INTERVIEW_TIME_DE_ID),
    // TODO
    {
      dataField: "actions",
      text: "Actions",
      align: "center",
      formatter: (cellContent, row, rowIndex, extraData) => {
        return (
          <DeleteConfirmationButton
            variant="outline-danger"
            size="sm"
            disabled={extraData !== FORM_ACTION_TYPES.NONE}
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

  return (
    <div className="px-4">
      <Modal
        backdrop="static"
        size="xl"
        keyboard={false}
        show={
          formStatus === FORM_ACTION_TYPES.ADD_NEW ||
          formStatus === FORM_ACTION_TYPES.EDIT
        }
      >
        <Modal.Body>
          <Card>
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                {formStatus !== FORM_ACTION_TYPES.ADD_NEW &&
                  "No." + (selectedRowIndex + 1)}
              </Card.Subtitle>
              <CaptureForm
                formProgramMetadata={programMetadata}
                locale={locale}
                metadata={metadata}
                rowIndex={selectedRowIndex}
                data={_.cloneDeep(selectedData)}
                formStatus={formStatus}
                setFormStatus={setFormStatus}
                handleEditRow={handleEditRow}
                handleAddNewRow={handleAddNewRow}
                editRowCallback={editRowCallback}
                maxDate={new Date()}
                minDate={new Date(`1900-12-31`)}
              />
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      <div className="row">
        <div className="mb-4 mr-auto mr-sm-0">
          <Button
            type="button"
            size="sm"
            style={{ width: 160 }}
            className="btn btn-success"
            onClick={handleBeforeAddNewRow}
            aria-controls="collapseExample"
            aria-expanded={formStatus === FORM_ACTION_TYPES.ADD_NEW}
          >
            {t("addNewInterview")}
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 order-md-12 mb-12 table-sm overflow-auto table-responsive pl-0">
          <BootstrapTable
            keyField="id"
            data={showData}
            columns={columnsC}
            rowEvents={rowEvents}
            striped
            hover
            condensed
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailTable;
