import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import withSkeletonLoading from '../../hocs/withSkeletonLoading';
import FormNoInput from '../../components/ProfileForm/FormNoInput';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks';

const LoadingFormNoInput = withSkeletonLoading()(FormNoInput);

const FormNoInputContainer = ({ id, initialValue, ...props }) => {
    const { programMetadata, selectedOrgUnit } = useSelector(
        (state) => state.metadata
    );
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    // const [validValue, setValidValue] = useState(initialValue || null);
    const { dataApi } = useApi();
    const checkUnique = (_, value, callback) => {
        if (value === initialValue) {
            return callback();
        }
        setLoading(true);
        return dataApi
            .findTei(selectedOrgUnit.id, programMetadata.id, [
                {
                    attribute: id,
                    value,
                },
            ])
            .then((json) => {
                setLoading(false);
                if (json.trackedEntityInstances) {
                    if (json.trackedEntityInstances.length > 0) {
                        return callback(
                            new Error(
                                t('uniqueFormNoError', {
                                    number: value,
                                    orgName: selectedOrgUnit.displayName,
                                })
                            )
                        );
                    }
                }
                callback();
                // setValidValue(value);
                // setUniqueFormNoNumber(value);
            });
    };

    return (
        <LoadingFormNoInput
            loading={loading}
            mask
            loaded={true}
            checkUnique={checkUnique}
            id={id}
            {...props}
        />
    );
};

export default FormNoInputContainer;
