import React, { useEffect } from "react";
import { FORM_ACTION_TYPES } from "../constants";
import useForm from "../../hooks/useForm";
import { InputAdornment } from "@material-ui/core";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";

// components
import InputField from "../InputFieldCore/InputField.component.jsx";
import { useTranslation } from "react-i18next";

CaptureForm.defaultProps = {
  maxDate: new Date(),
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
    locale,
    ...other
  } = props;
  const { programMetadataMember } = useSelector((state) => state.metadata);
  const { programSections, programStages } =
    formProgramMetadata || programMetadataMember;
  const {
    formData,
    prevData,
    setFormData,
    changeValue,
    formMetadata,
    changeMetadata,
    initFromData,
    validation,
    onSubmit,
    clear,
  } = useForm(_.cloneDeep(metadata), data, {
    compulsory: t("thisFieldIsRequired"),
  });

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
    return () => {
      console.log("Cascade form unmounted");
      clear();
    };
  }, []);

  const editCall = (metadata, prevData, formData, code, value) => {
    console.log("editCall called");
    let data = _.clone(formData);
    let cloneMetadata = _.clone(metadata).reduce((obj, md) => {
      obj[md.code] = md;
      return obj;
    }, {});

    editRowCallback(cloneMetadata, prevData, data, code, value);

    setFormData({ ...data });
    changeMetadata([...Object.values(cloneMetadata)]);
  };

  const generateFields = (formMetaData) => {
    return formMetaData
      .filter((f) => !f.additionCol)
      .filter((f) => !f.hidden)
      .map((f) => {
        return (
          <div className="col-lg-3 mb-3" key={f.code}>
            <InputField
              disabled={f.disabled}
              locale={locale}
              {...(_.has(f, "periodType") && {
                periodType: f.periodType,
              })}
              valueSet={f.valueSet}
              pattern={f.pattern}
              valueType={f.valueType}
              label={
                !_.isEmpty(f.translations)
                  ? f.translations[locale]
                  : f.displayFormName
              }
              attribute={f.attribute}
              value={formData[f.code] || ""}
              onBlur={(value) =>
                editCall(
                  formMetadata,
                  prevData.current,
                  formData,
                  f.code,
                  value
                )
              }
              onChange={(value) => {
                changeValue(f.code, value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{f.prefix}</InputAdornment>
                ),
              }}
              error={validation(f.code)}
              maxDate={props.maxDate}
              minDate={"1900-12-31"}
              data-element-id={f.code}
            />
          </div>
        );
      });
  };

  const generateSectionFields = () => {
    if (!programSections || programSections.length === 0) {
      const trackedEntityAttributes =
        programMetadataMember.trackedEntityAttributes.map((t) => t.id);
      const TEIFormMetadata = formMetadata.filter((f) =>
        trackedEntityAttributes.includes(f.id)
      );
      return <div className="row">{generateFields(TEIFormMetadata)}</div>;
    }

    return programSections.map((pSection) => {
      const trackedEntityAttributes = pSection.trackedEntityAttributes.map(
        (tea) => tea.id
      );
      const TEIFormMetadata = formMetadata
        .filter((f) => trackedEntityAttributes.includes(f.id))
        .sort(
          (a, b) =>
            trackedEntityAttributes.indexOf(a.id) -
              trackedEntityAttributes.indexOf(b.id) || a.id.localeCompare(b.id)
        );

      return (
        <div className="row">
          <div class="card-body">
            <h5 class="card-title">{pSection.displayName}</h5>
            <p class="card-text">
              <div className="row">{generateFields(TEIFormMetadata)}</div>
            </p>
          </div>
        </div>
      );
    });
  };

  const generateProgramStageSectionFields = () => {
    if (
      programStages?.some((pStage) => pStage.programStageSections.length === 0)
    ) {
      return programStages.map((pStage) => {
        const dataElements = pStage.dataElements.map((t) => t.id);
        const programFormMetadata = formMetadata.filter((f) =>
          dataElements.includes(f.id)
        );

        return <div className="row">{generateFields(programFormMetadata)}</div>;
      });
    }

    return programStages.map((pStage) => {
      const programStageSections = pStage.programStageSections;

      return programStageSections.map((pSection) => {
        const dataElements = pSection.dataElements.map((tea) => tea.id);
        const programFormMetadata = formMetadata
          .filter((f) => dataElements.includes(f.id))
          .sort(
            (a, b) =>
              dataElements.indexOf(a.id) - dataElements.indexOf(b.id) ||
              a.id.localeCompare(b.id)
          );

        // if all field hidden => hide the section
        const filtered = programFormMetadata.filter((f) => !f.hidden);
        if (filtered.length === 0) return null;

        return (
          <div className="row">
            <div class="card-body">
              <h5 class="card-title">{pSection.displayName}</h5>
              <p class="card-text">
                <div className="row">{generateFields(programFormMetadata)}</div>
              </p>
            </div>
          </div>
        );
      });
    });
  };

  const handleCancelForm = () => {
    setFormStatus(FORM_ACTION_TYPES.NONE);
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
            {formStatus === FORM_ACTION_TYPES.ADD_NEW && (
              <div
                className="btn-group mr-2"
                role="group"
                aria-label="First group"
              >
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={(e) => handleOnSubmit(e, "add")}
                >
                  {t("save")}
                </button>
              </div>
            )}
            {formStatus === FORM_ACTION_TYPES.EDIT && (
              <div
                className="btn-group mr-2"
                role="group"
                aria-label="First group"
              >
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={(e) => handleOnSubmit(e, "edit")}
                >
                  {t("save")}
                </button>
              </div>
            )}
            {formStatus !== FORM_ACTION_TYPES.NONE && (
              <div
                className="btn-group mr-2"
                role="group"
                aria-label="First group"
              >
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={(e) => handleCancelForm()}
                >
                  {t("cancel")}
                </button>
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
