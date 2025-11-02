import { BASE64_IMAGES } from "@/constants/base64Images";
import { InputAdornment } from "@material-ui/core";
import { Checkbox, Table } from "antd";
import { CHILD_VACCINES, FORM_ACTION_TYPES, TETANUS_VACCINES } from "../constants";
import _ from "lodash";

import InputField from "../InputFieldCore/InputField.component.jsx";
import { pickTranslation } from "@/utils";
import HyperLink from "../InputFieldCore/HyperLink";

const ChildHealth = ({
  locale,
  section,
  formMetadata,
  changeValue,
  disableForm,
  editCall,
  formData,
  formStatus,
  prevData,
  validation,
  validationWarning,
  props,
}) => {
  const generateFields = (formMetaData, dataElementId, hideLabel, displayOption) => {
    return formMetaData
      .filter((f) => f.code == dataElementId)
      .map((f, index) => {
        const base64Object = BASE64_IMAGES[f.code];
        return (
          <div className="mb-3" key={`${f.code}-${index}`}>
            <InputField
              locale={locale}
              disabled={f.disabled || formStatus === FORM_ACTION_TYPES.VIEW || disableForm}
              valueSet={f.valueSet}
              pattern={f.pattern}
              valueType={f.valueType}
              displayOption={displayOption}
              label={!hideLabel ? (!_.isEmpty(f.translations) ? f.translations[locale] : f.displayFormName) : ""}
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
              isMultipleTrueOnlyDes={f.isMultipleTrueOnlyDes}
              isSelectSearchable={f.isSelectSearchable}
            />
          </div>
        );
      });
  };

  //Table TTD H42aYY9JMIR

  const dataSource1 = TETANUS_VACCINES.list.map((item, index) => {
    const vaccineDone = formMetadata.find((data) => data.id == item.ids.vaccineDone);
    const vaccineDate = formMetadata.find((data) => data.id == item.ids.vaccineDate);

    return {
      key: index,
      name: item.name,
      vaccineGiven: vaccineDone || {},
      VaccineDate: vaccineDate || {},
    };
  });

  const columns1 = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vaccine Given",
      dataIndex: "vaccineGiven",
      key: "vaccineGiven",
      render: (f) => generateFields(formMetadata, f.code, true, "RADIO"),
    },
    {
      title: "Vaccine Date",
      dataIndex: "VaccineDate",
      key: "VaccineDate",
      render: (f) => generateFields(formMetadata, f.code, true),
    },
  ];

  return (
    <>
      <div className="row">
        <div class="card-body">
          <h5 class="card-title" section-id={section.id}>
            {pickTranslation(section, locale)}
          </h5>
          <p class="card-text">
            <Table columns={columns1} dataSource={dataSource1} pagination={false} />
          </p>
        </div>
      </div>
    </>
  );
};

export default ChildHealth;
