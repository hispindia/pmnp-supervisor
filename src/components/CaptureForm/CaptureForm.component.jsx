import { BASE64_IMAGES } from "@/constants/base64Images";
import { InputAdornment } from "@material-ui/core";
import _ from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useForm from "../../hooks/useForm";
import { FORM_ACTION_TYPES } from "../constants";

// components
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";
import InputField from "../InputFieldCore/InputField.component.jsx";

CaptureForm.defaultProps = {
  maxDate: new Date(),
};

const { confirm } = Modal;
const showConfirmationModal = (title, onConfirm, onCancel) => {
  const instance = confirm({
    title,
    centered: true,
    icon: null,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      if (onConfirm) {
        onConfirm();
      }
      instance.destroy();
    },
    onCancel: onCancel,
  });
};

function CaptureForm(props) {
  const { t } = useTranslation();

  const {
    classes,
    className,
    metadata,
    data,
    rowIndex,
    formStatus,
    setFormStatus,
    handleEditRow,
    handleAddNewRow,
    editRowCallback = null,
    formProgramMetadata,
    saveDisabled,
    cancelable = true,
    locale,
    formName,
    onCancel = () => {},
    ...other
  } = props;
  const { programMetadataMember } = useSelector((state) => state.metadata);
  const { programSections, programStages } = formProgramMetadata || programMetadataMember;

  const displayDEs = programStages.reduce((acc, pStage) => {
    const dataElements = pStage.programStageSections.reduce((acc, pSection) => {
      const dataElements = pSection.dataElements.map((de) => de.id);
      return [...acc, ...dataElements];
    }, []);
    return [...acc, ...dataElements];
  }, []);

  const {
    formData,
    prevData,
    isFormFulfilled,
    checkFormFulfilled,
    setFormData,
    changeValue,
    formMetadata,
    changeMetadata,
    initFromData,
    validation,
    validationWarning,
    onSubmit,
    clear,
  } = useForm(
    _.cloneDeep(metadata),
    data,
    {
      compulsory: t("thisFieldIsRequired"),
    },
    displayDEs
  );

  const disableSaveButton = saveDisabled;

  useEffect(() => {
    initFromData(data);

    let cloneMetadata = _.cloneDeep(metadata).reduce((obj, md) => {
      obj[md.code] = md;
      return obj;
    }, {});

    if (data) {
      editRowCallback(cloneMetadata, null, data, null, null);
    }

    changeMetadata([...Object.values(cloneMetadata)]);
  }, [data.id]);

  useEffect(() => {
    checkFormFulfilled();
    return () => {
      clear();
    };
  }, []);

  console.log({ isFormFulfilled });

  const editCall = (metadata, prevData, formData, code, value) => {
    let data = _.clone(formData);
    let cloneMetadata = _.clone(metadata).reduce((obj, md) => {
      obj[md.code] = md;
      return obj;
    }, {});

    editRowCallback(cloneMetadata, prevData, data, code, value);
    checkFormFulfilled();

    setFormData({ ...data });
    changeMetadata([...Object.values(cloneMetadata)]);
  };

  const generateFields = (formMetaData) => {
    return formMetaData
      .filter((f) => !f.additionCol)
      .filter((f) => !f.hidden)
      .map((f, index) => {
        const base64Object = BASE64_IMAGES[f.code];

        return (
          <div className="col-lg-3 mb-3" key={`${f.code}-${index}`}>
            <InputField
              disabled={f.disabled || formStatus === FORM_ACTION_TYPES.VIEW}
              locale={locale}
              {...(_.has(f, "periodType") && {
                periodType: f.periodType,
              })}
              valueSet={f.valueSet}
              pattern={f.pattern}
              valueType={f.valueType}
              label={!_.isEmpty(f.translations) ? f.translations[locale] : f.displayFormName}
              attribute={f.attribute}
              value={formData[f.code] || ""}
              onBlur={(value) => editCall(formMetadata, prevData.current, formData, f.code, value)}
              onChange={(value) => {
                changeValue(f.code, value);
              }}
              formData={formData}
              changeValue={changeValue}
              InputProps={{
                startAdornment: <InputAdornment position="start">{f.prefix}</InputAdornment>,
              }}
              error={validation(f.code)}
              warning={validationWarning(f.code)}
              maxDate={f.maxDate || props.maxDate}
              minDate={f.minDate || props.minDate || "1900-12-31"}
              data-element-id={f.code}
              hyperlink={f.url}
              base64={base64Object}
              description={f.description}
            />
          </div>
        );
      });
  };

  const generateSectionFields = () => {
    if (!programSections || programSections.length === 0) {
      const trackedEntityAttributes = programMetadataMember.trackedEntityAttributes.map((t) => t.id);
      const TEIFormMetadata = formMetadata.filter((f) => trackedEntityAttributes.includes(f.id));
      return (
        <div className="row" style={{ alignItems: "flex-end" }}>
          {generateFields(TEIFormMetadata)}
        </div>
      );
    }

    return programSections.map((pSection) => {
      const trackedEntityAttributes = pSection.trackedEntityAttributes.map((tea) => tea.id);
      const TEIFormMetadata = formMetadata
        .filter((f) => trackedEntityAttributes.includes(f.id))
        .sort(
          (a, b) =>
            trackedEntityAttributes.indexOf(a.id) - trackedEntityAttributes.indexOf(b.id) || a.id.localeCompare(b.id)
        );

      return (
        <div className="row">
          <div class="card-body">
            <h5 class="card-title" section-id={pSection.id}>
              {pSection.displayName}
            </h5>
            <p class="card-text">
              <div className="row" style={{ alignItems: "flex-end" }}>
                {" "}
                {generateFields(TEIFormMetadata)}
              </div>
            </p>
          </div>
        </div>
      );
    });
  };

  const generateProgramStageSectionFields = () => {
    if (programStages?.some((pStage) => pStage.programStageSections.length === 0)) {
      return programStages.map((pStage) => {
        const dataElements = pStage.dataElements.map((t) => t.id);
        const programFormMetadata = formMetadata.filter((f) => dataElements.includes(f.id));

        return (
          <div className="row" style={{ alignItems: "flex-end" }}>
            {" "}
            {generateFields(programFormMetadata)}
          </div>
        );
      });
    }

    return programStages.map((pStage) => {
      const programStageSections = pStage.programStageSections;

      return programStageSections.map((pSection) => {
        const dataElements = pSection.dataElements.map((tea) => tea.id);
        const programFormMetadata = formMetadata
          .filter((f) => dataElements.includes(f.id))
          .sort((a, b) => dataElements.indexOf(a.id) - dataElements.indexOf(b.id) || a.id.localeCompare(b.id));

        // if all field hidden => hide the section
        const filtered = programFormMetadata.filter((f) => !f.hidden);
        if (filtered.length === 0) return null;

        return (
          <div className="row">
            <div class="card-body">
              <h5 class="card-title" section-id={pSection.id}>
                {pSection.displayName}
              </h5>
              <p class="card-text">
                <div className="row" style={{ alignItems: "flex-end" }}>
                  {" "}
                  {generateFields(programFormMetadata)}
                </div>
              </p>
            </div>
          </div>
        );
      });
    });
  };

  const handleCancelForm = () => {
    setFormStatus(FORM_ACTION_TYPES.NONE);
    onCancel();
  };

  const handleOnSubmit = (e, action) => {
    let status = onSubmit(null);

    console.log("status:>>", status);
    if (status) {
      switch (action) {
        case "add":
          handleAddNewRow(e, formData, false);
          break;
        case "edit":
          let row = _.clone(formData);
          handleEditRow(e, row, rowIndex);
          break;
        case "submit":
          handleEditRow(e, formData, false);
          break;
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {generateSectionFields()}
          {generateProgramStageSectionFields()}
          {/* {generateFields(formMetadata)} */}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="btn-toolbar" role="toolbar">
            {/* {formStatus === FORM_ACTION_TYPES.ADD_NEW && (
              <div className="btn-group mr-2" role="group" aria-label="First group">
                <Button
                  size="large"
                  type="primary"
                  disabled={disableSaveButton}
                  onClick={(e) => handleOnSubmit(e, "add")}
                >
                  {t("save")}
                </Button>
              </div>
            )} */}
            {formStatus === FORM_ACTION_TYPES.ADD_NEW || formStatus === FORM_ACTION_TYPES.EDIT ? (
              <>
                <div className="btn-group mr-2">
                  <Button
                    size="large"
                    type="primary"
                    disabled={disableSaveButton}
                    onClick={(e) => handleOnSubmit(e, "edit")}
                  >
                    {t("save")}
                  </Button>
                </div>
                <div className="btn-group mr-2" role="group">
                  <Button
                    size="large"
                    color="green"
                    variant="solid"
                    disabled={!isFormFulfilled}
                    onClick={() =>
                      showConfirmationModal(
                        "May I confirm if you’ve reviewed your answers and validated that all of it are accurate?",
                        (e) => handleOnSubmit(e, "edit")
                      )
                    }
                  >
                    {t("submit")}
                  </Button>
                </div>
              </>
            ) : null}
            {cancelable && formStatus !== FORM_ACTION_TYPES.NONE && (
              <div className="btn-group mr-2" role="group" aria-label="First group">
                <Button size="large" color="primary" onClick={(e) => handleCancelForm()}>
                  {t("cancel")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

CaptureForm.propTypes = {};

export default CaptureForm;
