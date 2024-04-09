import React, { useEffect } from 'react';
import withSkeletonLoading from '../../hocs/withSkeletonLoading';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import MainForm from '../../components/MainForm/MainForm';
import { getTei } from '../../redux/actions/data/tei';

const queryString = require('query-string');

const LoadingFormContainer = withSkeletonLoading(() => 'Loading...')(MainForm);

const FormContainer = () => {
    const {
        loading,
        error,
        data: { currentTei },
    } = useSelector((state) => state.data.tei);

    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const { tei } = queryString.parse(location.search);
        dispatch(getTei(tei));
    }, []);
    return (
        <LoadingFormContainer loading={loading} mask loaded={!!currentTei} />
    );
};

export default FormContainer;
