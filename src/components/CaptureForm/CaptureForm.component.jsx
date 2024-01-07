import React, { useEffect } from 'react';
import { FORM_ACTION_TYPES } from '../constants';
import useForm from '../../hooks/useForm';
import { InputAdornment } from '@material-ui/core';
import _ from 'lodash';

// components
import InputField from '../InputFieldCore/InputField.component.jsx';
// import InputField from '../CustomAntForm/InputField';

CaptureForm.defaultProps = {
    maxDate: new Date(),
};

function CaptureForm(props) {
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
        locale,
        uiLocale,
        ...other
    } = props;

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
        compulsory: uiLocale.thisFieldIsRequired,
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
        console.log({ cloneMetadata });
        changeMetadata([...Object.values(cloneMetadata)]);
    }, [data.id]);

    useEffect(() => {
        return () => {
            console.log('Cascade form unmounted');
            clear();
        };
    }, []);

    const editCall = (metadata, prevData, formData, code, value) => {
        let data = _.clone(formData);
        let cloneMetadata = _.clone(metadata).reduce((obj, md) => {
            obj[md.code] = md;
            return obj;
        }, {});
        editRowCallback(cloneMetadata, prevData, data, code, value);

        setFormData({ ...data });
        changeMetadata([...Object.values(cloneMetadata)]);
    };

    const generateFields = () => {
        return formMetadata
            .filter((f) => !f.additionCol)
            .filter((f) => !f.hidden)
            .map((f) => {
                return (
                    <div className="col-md-4 mb-3" key={f.code}>
                        <InputField
                            locale={locale}
                            uiLocale={uiLocale}
                            {...(_.has(f, 'periodType') && {
                                periodType: f.periodType,
                            })}
                            valueSet={f.valueSet}
                            pattern={f.pattern}
                            valueType={f.valueType}
                            label={
                                !_.isEmpty(f.translations)
                                    ? f.translations[locale]
                                    : f.name
                            }
                            attribute={f.attribute}
                            value={formData[f.code] || ''}
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
                                    <InputAdornment position="start">
                                        {f.prefix}
                                    </InputAdornment>
                                ),
                            }}
                            error={validation(f.code)}
                            maxDate={props.maxDate}
                            minDate={'1900-12-31'}
                        />
                    </div>
                );
            });
    };

    const handleCancelForm = () => {
        setFormStatus(FORM_ACTION_TYPES.NONE);
    };

    const handleOnSubmit = (e, action) => {
        let status = onSubmit(null);
        if (status) {
            switch (action) {
                case 'add':
                    handleAddNewRow(e, formData, false);
                    break;
                case 'edit':
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
                    <div className="row">{generateFields()}</div>
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
                                    onClick={(e) => handleOnSubmit(e, 'add')}
                                >
                                    {uiLocale.save}
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
                                    onClick={(e) => handleOnSubmit(e, 'edit')}
                                >
                                    {uiLocale.save}
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
                                    {uiLocale.cancel}
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
