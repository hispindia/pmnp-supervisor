import { BASE64_IMAGES } from "@/constants/base64Images";
import { InputAdornment } from "@material-ui/core";
import { Checkbox, Table } from "antd";
import { CHILD_VACCINES, FORM_ACTION_TYPES } from "../constants";
import _ from "lodash";

import InputField from "../InputFieldCore/InputField.component.jsx";

const ChildHealthCustomForm = ({
  formMetadata,
  changeValue,
  disableForm,
  editCall,
  formData,
  formStatus,
  prevData,
  props,
}) => {
  const generateFields = (formMetaData, dataElementId, hideLabel, displayOption) => {
    return formMetaData
      .filter((f) => f.code == dataElementId)
      .map((f, index) => {
        const base64Object = BASE64_IMAGES[f.code];
        return (
          <div className="col-lg-6 mb-3" key={`${f.code}-${index}`}>
            <InputField
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

  //Table
  const dataSource = CHILD_VACCINES.list
    .filter((item) => {
      //Age in month
      if (formData["RoSxLAB5cfo"] >= item.vaccineMonth.start) {
        return item;
      }
    })
    .map((item, index) => {
      const vaccineDone = formMetadata.find((data) => data.id == item.ids.vaccineDone);
      const vaccineDate = formMetadata.find((data) => data.id == item.ids.vaccineDate);
      const discrepancy = formMetadata.find((data) => data.id == item.ids.discrepancy);
      return {
        key: index,
        name: item.name,
        vaccineGiven: vaccineDone || {},
        VaccineDate: vaccineDate || {},
        discrepancy: discrepancy || {},
      };
    });

  const columns = [
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
    {
      title: "Discrepancy",
      dataIndex: "discrepancy",
      key: "discrepancy",
      render: (f) => <Checkbox style={{ transform: "scale(1.5)" }} checked={formData[f.code] || ""} disabled={true} />,
    },
  ];
  return (
    <>
      {generateFields(formMetadata, "p6NUCwXg99o")}

      <Table dataSource={dataSource} columns={columns} pagination={false} />

      {generateFields(formMetadata, "EMHed4Yi7L6")}
    </>
  );
};

export default ChildHealthCustomForm;
