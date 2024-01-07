import React from 'react';

/* REDUX */
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOrgUnit } from '../../../redux/actions/metadata';
/*       */
import OrgUnit from '../../../components/ControlBar/OrgUnit';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const OrgUnitContainer = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const {
        metadata: { programMetadata, selectedOrgUnit, orgUnits },
    } = useSelector((state) => state);

    const handleSelectOrgUnit = (orgUnit) => {
        const selectedOrgUnit = {
            ...orgUnit,
            level: orgUnit.path.split('/').filter(Boolean).length,
        };

        dispatch(setSelectedOrgUnit(selectedOrgUnit));
        sessionStorage.setItem('selectedOrgUnit', JSON.stringify(orgUnit));
        history.push('/list');
    };

    const onVisibleChange = (visible) => {
        console.log(visible);
    };

    return (
        <OrgUnit
            orgUnitSelectorFilter={orgUnits}
            orgUnitLabel={t('enrollingVillage')}
            handleSelectOrgUnit={handleSelectOrgUnit}
            onVisibleChange={onVisibleChange}
            buttonLabel={
                selectedOrgUnit ? (
                    <>
                        <b>{selectedOrgUnit.displayName} </b>
                    </>
                ) : (
                    t('select')
                )
            }
            selectedOrgUnit={selectedOrgUnit}
        />
    );
};

export default OrgUnitContainer;
