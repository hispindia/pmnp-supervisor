import { generateUid } from "@/utils";
import { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector } from "react-redux";
import {
  defaultProgramTrackedEntityAttributeDisable,
  FORM_ACTION_TYPES,
  HAS_INITIAN_NOVALUE,
} from "../constants";

// Icon
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* SELECTOR */
import { updateCascade } from "@/redux/actions/data/tei/currentCascade";
import { isImmutableYear } from "@/utils/event";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import withDeleteConfirmation from "../../hocs/withDeleteConfirmation";
import { changeMember } from "../../redux/actions/data/tei";
import CaptureForm from "../CaptureForm";
import "../CustomStyles/css/bootstrap.min.css";
import {
  transformData,
  transformMetadataToColumns,
} from "../CascadeTable/utils";

const InterviewTable = ({ data, setData, metadata, setMetadata }) => {
  const { t, i18n } = useTranslation();

  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const { programMetadata } = useSelector((state) => state.metadata);

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

    console.log({ data });

    setData([...data]);
    let updatedMetadata = updateMetadata(metadata, data);

    console.log("handleAddNewRow", { updatedMetadata, dataRows });
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

  const handleEditRow = () => {};

  const editRowCallback = () => {};

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
                locale={i18n.language || "en"}
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
    </div>
  );
};

export default InterviewTable;
