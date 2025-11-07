import debounce from "lodash/debounce";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import withDhis2FormItem from "../../hocs/withDhis2Field";
import CFormControl from "../CustomAntForm/CFormControl";
import InputField from "../CustomAntForm/InputField";

const FormNoInput = ({ checkUnique, form, id, ...props }) => {
  const { t } = useTranslation();
  const {
    programMetadata: { trackedEntityAttributes },
  } = useSelector((state) => state.metadata);
  const Dhis2FormItem = useMemo(() => withDhis2FormItem(trackedEntityAttributes)(CFormControl), []);

  let checkFormNoUnique = debounce((...params) => {
    return checkUnique(...params);
  }, 500);

  return (
    <Dhis2FormItem
      getValueFromEvent={(e) => {
        if (/\d/.test(e.target.value)) {
          return ("0000" + e.target.value.replace(/\D/, "")).slice(-4);
        }
      }}
      rules={[
        {
          validator: checkFormNoUnique,
        },
      ]}
      id={id}
      label={t("formNo")}
    >
      <InputField {...props} />
    </Dhis2FormItem>
  );
};

export default FormNoInput;
