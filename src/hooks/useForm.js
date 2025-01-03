import { useState, useRef } from 'react';
import _ from 'lodash';
import { calculateAge } from '@/utils/event';
import { FAMILY_MEMBER_METADATA_CUSTOMUPDATE, FAMILY_MEMBER_VALUE } from '@/components/constants';

const useForm = (metadata, data, uiLocale) => {
    const [formMetadata, setMetadata] = useState(metadata);
    const [formData, setFormData] = useState(data);
    const [warningLocale, setWarningLocale] = useState(uiLocale);
    const [validationText, setValidationText] = useState({});

    const validationTypes = ['compulsory'];
    const prevData = useRef(data);

    const validationCheck = (type, value) => {
        switch (type) {
            case 'compulsory':
                if (value == '' || value == null || value == undefined) {
                    if (warningLocale && warningLocale.compulsory)
                        return { text: warningLocale.compulsory };
                    return { text: 'This field is required' };
                }
            default:
                return null;
        }
    };

    const initFromData = (data) => {
        setFormData(data);
    };

    const changeValue = (property, value) => {
        console.log('formMetadata :>> ', formMetadata);
        let temp = JSON.parse(JSON.stringify(formData));
        prevData.current = { ...temp };

        switch (property) {
            case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB:
                const age = calculateAge(value);
                formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE] = age;

                if (age < 16) formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER] = null
                formData[property] = value;
                break;

            case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MEMBERSHIP_STATUS:
                if (FAMILY_MEMBER_VALUE[property] == value) formData[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANFER_TO] = null;
                formData[property] = value;
            default:
                formData[property] = value;
        }



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
        // run validation layer 1
        let valText = {};

        validationTypes.forEach((vt) => {
            let filterMDbyType = _.filter(formMetadata, { [vt]: true });

            filterMDbyType.forEach((mdf) => {
                let valRes = validationCheck(
                    vt,
                    formData[mdf.code || mdf.id] || null
                );
                if (valRes) valText[mdf.code || mdf.id] = valRes;
            });
        });

        // run external layer
        if (external) {
            valText[external.attribute] = external.error;
        }

        setValidationText(valText);
        return _.isEmpty(valText);
    };

    const clear = () => {
        setFormData({});
        setMetadata([]);
        setWarningLocale({});
    };

    const editCallback = () => { };

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
    };
};
export default useForm;
