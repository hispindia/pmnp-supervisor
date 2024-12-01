import { onKeyDown } from "@/utils";
import { Checkbox, DatePicker, Input, Radio, Select } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
const { TextArea } = Input;
const { Option } = Select;

const InputField = ({
  // value,
  valueType,
  valueSet,
  // onChange,
  // onClick,
  // addonBefore,
  // disabled,
  // addonAfter,
  // inputRef,
  ...props
}) => {
  const { t } = useTranslation();

  if (valueSet) {
    return (
      <Select
        // value={value}
        allowClear
        showSearch
        style={{ width: "100%" }}
        // onChange={(selected) => {
        //   onChange(selected);
        // }}
        {...props}
      >
        {valueSet.map((set) => (
          <Option key={set.label} value={set.value}>
            {set.label}
          </Option>
        ))}
      </Select>
    );
  }

  switch (valueType) {
    case "INTEGER_POSITIVE":
    case "INTEGER_NEGATIVE":
    case "INTEGER_ZERO_OR_POSITIVE":
    case "PERCENTAGE":
    case "NUMBER":
    case "INTEGER":
    case "PHONE_NUMBER":
      return (
        <Input
          onKeyDown={(e) => {
            onKeyDown(e, /^[0-9]+$/);
          }}
          // addonBefore={addonBefore}
          // addonAfter={addonAfter}
          // value={value || ""}
          // onClick={onClick}
          // onChange={(event) => {
          //   onChange(event.target.value, event);
          // }}
          // disabled={disabled}
          // ref={inputRef}
          {...props}
        />
      );

    case "TEXT":
    case "EMAIL":
      return (
        <Input
          // addonBefore={addonBefore}
          // addonAfter={addonAfter}
          // value={value || ""}
          // onClick={onClick}
          // onChange={(event) => {
          //   onChange(event.target.value, event);
          // }}
          // disabled={disabled}
          // ref={inputRef}
          {...props}
        />
      );
    case "LONG_TEXT":
      return (
        <TextArea
          // value={value || ""}
          // onChange={(event) => {
          //   onChange(event.target.value, event);
          // }}
          {...props}
        />
      );
    case "DATE":
      return (
        <DatePicker
          // value={value ? moment(value) : ""}
          // onChange={(momentObject) => {
          //   onChange(momentObject.format("YYYY-MM-DD"));
          // }}
          {...props}
        />
      );
    case "YEAR":
      return (
        <DatePicker
          picker="year"
          {...props}
          value={props.value ? dayjs(props.value) : ""}
          onChange={(date, dateString) => {
            props.onChange(dateString);
          }}
        />
      );
    case "DATETIME":
      return <div>DATETIME</div>;
    case "TIME":
      return <div>TIME</div>;
    case "BOOLEAN":
      return (
        <Radio.Group
          // value={value}
          // onChange={(event) => {
          //   onChange(event.target.value, event);
          // }}
          {...props}
        >
          <Radio value="true" style={{ fontSize: "13.5px" }}>
            {t("yes")}
          </Radio>
          <Radio value="false" style={{ fontSize: "13.5px" }}>
            {t("no")}
          </Radio>
        </Radio.Group>
      );
    case "TRUE_ONLY":
      return (
        <Checkbox
          // checked={value}
          // onChange={(event) => {
          //   onChange(event.target.checked, event);
          // }}
          // disabled={disabled}
          {...props}
        />
      );
    case "AGE":
      return (
        <DatePicker
          // value={value}
          // onChange={(momentObject) => {
          //   onChange(momentObject);
          // }}
          {...props}
        />
      );
    case "VILLAGE": {
      console.log("onChange", props.onChange);
      return null;
      // return (
      //   <>
      //     <HierachySelector
      //     // config={
      //     //   {
      //     //     // labels: [
      //     //     //   "Please select province / ກະລຸນາເລຶອກແຂວງ",
      //     //     //   "Please select district / ກະລຸນາເລຶອກເມືອງ",
      //     //     //   "Please select village / ກະລຸນາເລຶອກບ້ານ",
      //     //     // ],
      //     //     // hierachy: programMetadata.villageHierarchy,
      //     //     // initSelections: [
      //     //     //     currentProvince,
      //     //     //     currentDistrict,
      //     //     //     currentVillage,
      //     //     // ],
      //     //     // disabled: disableVillageSelector,
      //     //     // select: (selections) => {
      //     //     //   const teas = [
      //     //     //     "BgKZvUxweKO",
      //     //     //     "utW5gK4ihvz",
      //     //     //     "XwnHdecsbvz",
      //     //     //   ];
      //     //     //   for (let i = 0; i <= 2; i++) {
      //     //     //     if (selections[i]) {
      //     //     //       changeProfileAttributeValue(
      //     //     //           teas[i],
      //     //     //           selections[i].value
      //     //     //       );
      //     //     //     } else {
      //     //     //       changeProfileAttributeValue(teas[i], "");
      //     //     //     }
      //     //     //   }
      //     //     // },
      //     //   }
      //     // }
      //     />
      //   </>
      // );
    }
    default:
      return <span>UNSUPPORTED VALUE TYPE</span>;
  }
};

export default InputField;
