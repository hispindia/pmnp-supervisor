import { generateUid } from "@/utils";
import { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector } from "react-redux";
import { defaultProgramTrackedEntityAttributeDisable, FORM_ACTION_TYPES, HAS_INITIAN_NOVALUE } from "../constants";

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
import "./CascadeTable.styles.css";
import { transformData, transformMetadataToColumns } from "./utils";

const DeleteConfirmationButton = withDeleteConfirmation(Button);


const CascadeTable = (props) => {
  const {
    classes,
    className,
    currentEvent,
    changeEventDataValue,
    editRowCallback = null,
    callbackFunction = null,
    initFunction = null,
    externalComponents,
    components = <div>Working...</div>,
    locale,
    originMetadata,
    metadata,
    setMetadata,
    setData,
    data,
    ...other
  } = props;
  const { t } = useTranslation();
  const [dataValuesTranslate, setDataValuesTranslate] = useState(null);
  const { year } = useSelector((state) => state.data.tei.selectedYear);
  const { immutableYear } = useSelector((state) => state.metadata);
  const { currentCascade } = useSelector((state) => state.data.tei.data);
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(
    transformMetadataToColumns(metadata, locale)
  );
  // const { ouPattern } = useSelector((state) => state.data.tei);
  const profile = useSelector((state) => state.data.tei.data.currentTei);

  const [showData, setShowData] = useState(
    transformData(metadata, props.data, dataValuesTranslate, locale)
  );

  // console.log(' profile :>> ',  profile);
  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (isImmutableYear(year, immutableYear)) return;
      if (e.currentTarget && e.currentTarget.contains(e.target))
        handleSelectRow(e, data[rowIndex], rowIndex);
    },
  };

  const clearForm = () => {
    setSelectedData({});
    setMetadata(originMetadata);
    setSelectedRowIndex(null);
    setFormStatus(FORM_ACTION_TYPES.NONE);
  };

  const handleEditRow = (e, row, rowIndex) => {
    // Update data
    let rows = _.clone(data);
    rows[rowIndex] = { ...row };

    let dataRows = {
      rows,
    };
    callbackFunction && callbackFunction(metadata, dataRows, rowIndex, "edit");

    setData([...dataRows["rows"]]);

    let updatedMetadata = updateMetadata(metadata, dataRows["rows"]);
    console.log("handleEditRow", { updatedMetadata, dataRows });

    // update new currentCascade
    const updatedCurrentCascade = {
      ...currentCascade,
      [year]: dataRows["rows"],
    };
    dispatch(updateCascade(updatedCurrentCascade));

    setMetadata([...updatedMetadata]);
    setFormStatus(FORM_ACTION_TYPES.NONE);
  };

  const handleBeforeAddNewRow = () => {
    // Before add new data
    setFormStatus(FORM_ACTION_TYPES.ADD_NEW);
    setSelectedData({ id: generateUid(), isNew: true, "hDE1WNqTTwF": profile.attributes["b4UUhQPwlRH"] });
    // setMetadata(JSON.parse(JSON.stringify(originMetadata)));
    setSelectedRowIndex(null);
  };

  const handleAddNewRow = (e, row, continueAdd) => {
    console.trace('row:>>>', row);
    // Add new data
    !continueAdd && setFormStatus(FORM_ACTION_TYPES.NONE);
    data.push(row);

    let dataRows = {
      rows: data,
    };

    callbackFunction &&
      callbackFunction(metadata, dataRows, dataRows["rows"].length - 1, "add");

    changeEventDataValue(
      "oC9jreyd9SD",
      JSON.stringify({ dataVals: dataRows["rows"] })
    );

    setData([...dataRows["rows"]]);
    let updatedMetadata = updateMetadata(metadata, dataRows["rows"]);

    // update new currentCascade
    const updatedCurrentCascade = {
      ...currentCascade,
      [year]: dataRows["rows"],
    };
    dispatch(updateCascade(updatedCurrentCascade));

    console.log("handleAddNewRow", { updatedMetadata, dataRows });

    setMetadata([...updatedMetadata]);
  };

  const handleSelectRow = (e, row, rowIndex) => {
    console.log("selected", row);
    setFormStatus(FORM_ACTION_TYPES.EDIT);
    setSelectedData(row);
    setSelectedRowIndex(rowIndex);
  };

  const handleDeleteRow = (e, row) => {
    e.stopPropagation();
    let dataRows = {
      rows: data.filter((d) => d.id != row.id),
    };

    callbackFunction &&
      callbackFunction(metadata, dataRows, null, "delete_member");
    changeEventDataValue(
      "oC9jreyd9SD",
      JSON.stringify({ dataVals: dataRows["rows"] })
    );
    setData([...dataRows["rows"]]);
    let updatedMetadata = updateMetadata(metadata, dataRows["rows"]);

    // update new currentCascade
    const updatedCurrentCascade = {
      ...currentCascade,
      [year]: dataRows["rows"],
    };
    dispatch(updateCascade(updatedCurrentCascade));

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

  useEffect(() => {
    let transformedData = transformData(
      metadata,
      props.data,
      dataValuesTranslate,
      locale
    );
    setShowData(transformedData);
    setData(props.data);
    let updatedMetadata = updateMetadata(metadata, props.data); // should not transformedData

    setMetadata([...updatedMetadata]);

    // REMOVE THIS - to fix bug losing calculated data
    // if (currentEvent._isDirty) {
    //   let dataRows = {
    //     rows: transformedData,
    //   };

    //   callbackFunction && callbackFunction(metadata, dataRows);
    // }
  }, [JSON.stringify(props.data)]);

  useEffect(() => {
    let transformedData = transformData(
      metadata,
      data,
      dataValuesTranslate,
      locale
    );
    setShowData(transformedData);
  }, [JSON.stringify(data)]);

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
    let rows = _.clone(data);
    let dataRows = {
      rows,
    };

    let cloneMetadata = _.clone(metadata).reduce((obj, md) => {
      obj[md.code] = md;
      return obj;
    }, {});

    initFunction && initFunction(cloneMetadata, dataRows);
    setMetadata([...Object.values(cloneMetadata)]);
  }, [JSON.stringify(metadata)]);

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
            disabled={
              extraData !== FORM_ACTION_TYPES.NONE ||
              isImmutableYear(year, immutableYear)
            }
            title={t("delete")}
            onDelete={(e) => {
              handleDeleteRow(e, row);
            }}
            messageText={t("deleteDialogContent")}
            cancelText={t("cancel")}
            deleteText={t("delete")}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(changeMember({ ...row, isDelete: true }));
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

  return (
    <div className="bootstrap-iso">
      <div className="container-fluid">
        <div className="row">
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
                    handleAddNewRow={handleAddNewRow}
                    editRowCallback={editRowCallback}
                    maxDate={new Date()}
                    minDate={new Date(`1900-12-31`)}
                  />
                </Card.Body>
              </Card>
            </Modal.Body>
          </Modal>
        </div>

        {/* <hr className="mb-4" /> */}
        <div className="row">
          <div className="mb-4 mr-auto mr-sm-0">
            <Button
              type="button"
              size="sm"
              style={{ width: 160 }}
              className="btn btn-success"
              onClick={() => handleBeforeAddNewRow()}
              aria-controls="collapseExample"
              aria-expanded={formStatus === FORM_ACTION_TYPES.ADD_NEW}
            >
              {t("addNewMember")}
            </Button>
          </div>
          {/* <div className="col-md-4 order-md-4 mb-4">
            <div>{externalComponents && externalComponents["nextButton"]}</div>
          </div> */}
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
    </div>
  );
};

CascadeTable.propTypes = {};

export default CascadeTable;
