import { FAMILY_MEMBER_METADATA_CUSTOMUPDATE, MIN_MAX_TEXT, MOBILE_NUM_REGEX } from "@/components/constants";
import _ from "lodash";
import { useRef, useState } from "react";

const useForm = (metadata, data, uiLocale) => {
  const [formMetadata, setMetadata] = useState(metadata);
  const [formData, setFormData] = useState(data);
  const [warningLocale, setWarningLocale] = useState(uiLocale);
  const [validationText, setValidationText] = useState({});

  const validationTypes = ["compulsory"];
  const prevData = useRef(data);

  const validationCheck = (type, value) => {
    switch (type) {
      case "compulsory":
        if (value == "" || value == null || value == undefined) {
          if (warningLocale && warningLocale.compulsory) return { text: warningLocale.compulsory };
          return { text: "This field is required" };
        }

      default:
        return null;
    }
  };

  const customValidationCheck = (type, elements, valText) => {
    switch (type) {
      case "min_max":
        // elements.ele.forEach(ele => {
        //     if (formData[ele]) {
        //         if ((Number(formData[ele]) >= 30) && (Number(formData[ele]) <= 300)) {
        //             valText[ele] = { text: elements.msg }
        //         } else delete valText[ele]
        //     }
        // })
        Object.keys(elements).forEach((ele) => {
          if (formData[ele]) {
            console.log(
              "(Number(formData[ele]) <= elements[ele].min) || (Number(formData[ele]) >= elements[ele].max) :>> ",
              Number(formData[ele]) <= elements[ele].min && Number(formData[ele]) >= elements[ele].max
            );
            if (Number(formData[ele]) <= elements[ele].min || Number(formData[ele]) >= elements[ele].max) {
              valText[ele] = {
                text: "Value range:Minimum " + elements[ele].min + " and maximum " + elements[ele].max,
              };
            } else delete valText[ele];
          }
        });
        break;

      case "contact":
        if (formData[elements]) {
          const validNum = MOBILE_NUM_REGEX.exp.test(formData[elements]);
          if (!validNum) {
            valText[elements] = { text: MOBILE_NUM_REGEX.msg };
          } else delete valText[elements];
        }

      default:
        break;
    }
  };

  const initFromData = (data) => {
    setFormData(data);
  };

  // handle validation from form input value basis of prediclated field
  const changeValue = (property, value) => {
    console.log("changeValue called");
    let temp = JSON.parse(JSON.stringify(formData));
    prevData.current = { ...temp };

    if (property == FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER && value.length < 9) {
      formData[property] = value;
    } else if (property == FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER && value.length > 8) {
    } else formData[property] = value;

    // formData[property] = value;
    setFormData({ ...formData });
  };

  const changeMetadata = (metadata) => {
    setMetadata(metadata);
    onSubmit();
  };

  const validation = (code, otherError) => {
    if (otherError) {
      return otherError;
    } else {
      return validationText[code] ? validationText[code].text : null;
    }
  };

  const onSubmit = (external) => {
    let valText = {};

    validationTypes.forEach((vt) => {
      let filterMDbyType = _.filter(formMetadata, { [vt]: true });

      filterMDbyType.forEach((mdf) => {
        let valRes = validationCheck(vt, formData[mdf.code || mdf.id] || null);
        if (valRes) valText[mdf.code || mdf.id] = valRes;
      });
    });

    // run external layer
    if (external) {
      valText[external.attribute] = external.error;
    }

    // validation from metadata
    if (formMetadata) {
      formMetadata.forEach((mdf) => {
        if (mdf.error) {
          valText[mdf.code || mdf.id] = { text: mdf.error };
        }
      });
    }

    customValidationCheck("min_max", MIN_MAX_TEXT, valText);
    customValidationCheck("contact", FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER, valText);

    // custom fileds validations
    setValidationText(valText);

    return _.isEmpty(valText);
  };

  const clear = () => {
    setFormData({});
    setMetadata([]);
    setWarningLocale({});
  };

  return {
    formMetadata,
    prevData,
    changeMetadata,
    formData,
    setFormData,
    changeValue,
    initFromData,
    validation,
    onSubmit,
    clear,
    // validateFamilyMemberForm,
  };
};
export default useForm;
