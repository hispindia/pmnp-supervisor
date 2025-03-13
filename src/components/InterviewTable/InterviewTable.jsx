import { generateUid } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  defaultProgramTrackedEntityAttributeDisable,
  FORM_ACTION_TYPES,
  HAS_INITIAN_NOVALUE,
} from "../constants";

// Icon
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  transformData,
  transformMetadataToColumns,
} from "../CascadeTable/utils";
import withDeleteConfirmation from "../../hocs/withDeleteConfirmation";
import CaptureForm from "../CaptureForm";
import "../CustomStyles/css/bootstrap.min.css";
import _ from "lodash";

const DeleteConfirmationButton = withDeleteConfirmation(Button);

const InterviewTable = ({
  data,
  setData,
  metadata,
  originMetadata,
  setMetadata,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  const [dataValuesTranslate, setDataValuesTranslate] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const { programMetadata } = useSelector((state) => state.metadata);
  const [columns, setColumns] = useState(
    transformMetadataToColumns(metadata, locale)
  );

  const showData = useMemo(() => {
    return transformData(metadata, data, dataValuesTranslate, locale);
  }, [metadata, data, dataValuesTranslate, locale]);

  const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

  const handleBeforeAddNewRow = () => {
    // Before add new data
    setFormStatus(FORM_ACTION_TYPES.ADD_NEW);
    setSelectedData({
      id: generateUid(),
      isNew: true,
    });
    setSelectedRowIndex(null);
  };

  const handleAddNewRow = (e, row, continueAdd) => {
    console.trace("row:>>>", row);
    // Add new data
    !continueAdd && setFormStatus(FORM_ACTION_TYPES.NONE);
    data.push(row);

    setData([...data]);
    let updatedMetadata = updateMetadata(metadata, data);

    console.log("handleAddNewRow", { updatedMetadata, data });
    setMetadata([...updatedMetadata]);
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

  const handleEditRow = (e, row, rowIndex) => {
    // Update data
    let newData = _.clone(data);
    newData[rowIndex] = { ...row };

    setData(newData);

    let updatedMetadata = updateMetadata(metadata, newData);
    console.log("handleEditRow", { updatedMetadata, newData });

    setMetadata([...updatedMetadata]);
    setFormStatus(FORM_ACTION_TYPES.NONE);
  };

  const editRowCallback = () => {};

  const handleDeleteRow = () => {};

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
    ...columns,
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
              // callbackFunction(metadata, row, rowIndex, "clean");
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

export default InterviewTable;
