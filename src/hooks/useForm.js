import { useState, useRef } from "react";
import _ from "lodash";
import { calculateAge } from "@/utils/event";
import {
  FAMILY_MEMBER_METADATA_CUSTOMUPDATE,
  FAMILY_MEMBER_VALUE,
  MIN_MAX_TEXT,
  MOBILE_NUM_REGEX,
  TYPE_OF_ACTION,
} from "@/components/constants";
import { changeMember } from "@/redux/actions/data/tei";
import { useDispatch } from "react-redux";

const useForm = (metadata, data, uiLocale) => {
  const [formMetadata, setMetadata] = useState(metadata);
  const [formData, setFormData] = useState(data);
  const [warningLocale, setWarningLocale] = useState(uiLocale);
  const [validationText, setValidationText] = useState({});

  const validationTypes = ["compulsory"];
  const prevData = useRef(data);
  const dispatch = useDispatch();

  const validationCheck = (type, value) => {
    console.log("validationCheck called");
    switch (type) {
      case "compulsory":
        if (value == "" || value == null || value == undefined) {
          if (warningLocale && warningLocale.compulsory)
            return { text: warningLocale.compulsory };
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
              Number(formData[ele]) <= elements[ele].min &&
                Number(formData[ele]) >= elements[ele].max
            );
            if (
              Number(formData[ele]) <= elements[ele].min ||
              Number(formData[ele]) >= elements[ele].max
            ) {
              valText[ele] = {
                text:
                  "Value range:Minimum " +
                  elements[ele].min +
                  " and maximum " +
                  elements[ele].max,
              };
            } else delete valText[ele];
          }
        });
        break;

      case "contact":
        if (formData[elements]) {
          console.log("*******");
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

  // const validateFamilyMemberForm = (cloneMetadata, property, value) => {

  //     switch (property) {
  //         // handle form validation on besis of DOB
  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB:
  //             const age = calculateAge(value);
  //             formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE] = age;

  //             if (age < 16) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER] = null
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER].hidden = true
  //             } else cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER].hidden = false

  //             if (age < 2) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MORDEN_EDUCATION] = null
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ATTENDING_TRADITIONAL_LERNING] = null
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MORDEN_EDUCATION].hidden = true
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ATTENDING_TRADITIONAL_LERNING].hidden = true
  //             }
  //             if (age < 18 || age > 75) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING] = null
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING].hidden = true
  //             }

  //             // formData[property] = value;
  //             break;
  //         // handle form validation on besis of membership status
  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MEMBERSHIP_STATUS:

  //             switch (value) {
  //                 case FAMILY_MEMBER_VALUE.PRESENT:
  //                     formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO] = null;
  //                     cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO].hidden = true

  //                     break;

  //                 case FAMILY_MEMBER_VALUE.DEMISE:
  //                     formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO] = null;
  //                     cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO].hidden = true
  //                 default:
  //                     formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO] = value;
  //                     cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO].hidden = false

  //                     formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO] = value;
  //                     cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO].hidden = false
  //                     break;
  //             }i

  //         // formData[property] = value;

  //         // handle form validation on besis of membership gender
  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX:
  //             const userAge = formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE]
  //             switch (value) {
  //                 case TYPE_OF_ACTION.MALE:
  //                     formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER] = null;
  //                     formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER] = null;

  //                     cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER].hidden = true
  //                     cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER].hidden = true

  //                     break;

  //                 case TYPE_OF_ACTION.FEMALE:
  //                     if (userAge < 30 || userAge > 65) formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER] = null;
  //                     else if (userAge < 40 || userAge > 65) formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER] = null;
  //                     break;

  //                 default:
  //                     break;
  //             }
  //         // formData[property] = value;

  //         // handle the form validation on the besis of tranferd ot filed
  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO:
  //             const sex = formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX]

  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CURRENT_MARITAL_STATUS:
  //             if (value == TYPE_OF_ACTION.NEVER_MARRIED) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE].hidden = true
  //             } else {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE] = value;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE].hidden = false
  //             }

  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER:
  //             if (value == TYPE_OF_ACTION.NO) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR].hidden = true
  //             } else {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR] = value;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR].hidden = true
  //             }

  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER:
  //             if (value == TYPE_OF_ACTION.NO) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR].hidden = true
  //             } else {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR] = value;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR].hidden = false
  //             }

  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING:
  //             if (value == TYPE_OF_ACTION.NO) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST].hidden = false;
  //             } else {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST] = value;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST].hidden = true;
  //             }

  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_GLASSES_OR_CONTANT_LENCES:
  //             if (value == TYPE_OF_ACTION.YES) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING].hidden = true;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING_GLASSES].hidden = false;
  //             }
  //             if (value == TYPE_OF_ACTION.NO) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING_GLASSES] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING_GLASSES].hidden = true;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING].hidden = false;
  //             }

  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_HEARING_AID:
  //             if (value == TYPE_OF_ACTION.YES) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING].hidden = true;
  //             }
  //             if (value == TYPE_OF_ACTION.NO) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING_WITH_AID] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING_WITH_AID].hidden = true;
  //             }

  //         case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MANNER_OF_DEATH:
  //             if (value != TYPE_OF_ACTION.ACCIDENTAL) {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL] = null;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL].hidden = true;
  //             } else {
  //                 formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL] = value;
  //                 cloneMetadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL].hidden = false;
  //             }

  //         default:
  //             formData[property] = value;
  //     }
  //     console.log('dispatch:formData :>> ', formData);
  //     // dispatch(changeMember({ ...formData, isUpdate: true })); //!important
  //     // setFormData({ ...formData });
  // }

  // handle validation from form input value basis of prediclated field

  const changeValue = (property, value) => {
    console.log("changeValue called");
    let temp = JSON.parse(JSON.stringify(formData));
    prevData.current = { ...temp };

    if (
      property == FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER &&
      value.length < 9
    ) {
      formData[property] = value;
    } else if (
      property == FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER &&
      value.length > 8
    ) {
    } else formData[property] = value;

    // formData[property] = value;
    setFormData({ ...formData });
  };

  const changeMetadata = (metadata) => {
    setMetadata(metadata);
    onSubmit();
  };

  const validation = (code, otherError) => {
    console.log("validation called");

    if (otherError) {
      return otherError;
    } else {
      return validationText[code] ? validationText[code].text : null;
    }
  };

  const onSubmit = (external) => {
    // run validation layer 1

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

    customValidationCheck("min_max", MIN_MAX_TEXT, valText);
    customValidationCheck(
      "contact",
      FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER,
      valText
    );

    // custom fileds validations

    console.log({ valText });

    setValidationText(valText);

    return _.isEmpty(valText);
  };

  const clear = () => {
    setFormData({});
    setMetadata([]);
    setWarningLocale({});
  };

  const editCallback = () => {};

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
