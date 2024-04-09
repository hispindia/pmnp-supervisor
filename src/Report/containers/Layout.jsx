import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import withLoading from '../../../hocs/withLoading';
import {
    getAggregatedData,
    getFamilyRegisteredData,
    getOptionDataByDeId,
} from '../services/api';
import Layout from '../components/Layout';
import { AppContext } from '../../App/App.context';
import options from './YearSelector/options';
import { useApi } from 'hooks';

const LOADING_BREAKPOINT = 10;

const WATER_SOURCE_DE_ID = 'p2P8g0MnDBK';
const TOILET_TYPE_DE_ID = 'BDi5vJcbiMv';

const LoadingLayout = withLoading(Layout);

function LayoutContainer(props) {
    const { dataApi } = useApi();
    const { orgUnit } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [year, setYear] = useState(options[0].value);
    const { t } = useTranslation();
    const refs = [
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
    ];

    const getDataFromApi = async () => {
        setLoading(true);
        setData(null);
        try {
            const data = await Promise.all([
                getAggregatedData(year, orgUnit, dataApi),
                getOptionDataByDeId(WATER_SOURCE_DE_ID)(year, orgUnit, dataApi),
                getOptionDataByDeId(TOILET_TYPE_DE_ID)(year, orgUnit, dataApi),
                getFamilyRegisteredData(year, orgUnit, dataApi),
            ]);
            setData(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
            setLoadingPercent(0);
        }
    };

    useEffect(() => {
        getDataFromApi();
    }, [year, orgUnit.selectedOrgUnit.id]);

    return (
        <LoadingLayout
            isLoading={!data || loading}
            errorMessage={error}
            percent={loadingPercent}
            variant={
                loadingPercent < LOADING_BREAKPOINT ? 'indeterminate' : 'static'
            }
            data={data}
            year={year}
            setYear={setYear}
            orgUnit={orgUnit}
            dataApi={dataApi}
            forwardingRefs={refs}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            reportTitle={t('familyInformationReport')}
            orgTitle={`${t('for')}: ${orgUnit.selectedOrgUnit.displayName}`}
            {...props}
        />
    );
}

LayoutContainer.propTypes = {};
LayoutContainer.defaultProps = {};

export default LayoutContainer;
