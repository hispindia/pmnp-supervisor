import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitEventDataValues } from '../../redux/actions/data/tei/currentEvent';
import CensusDetailForm from '../../components/CensusDetailForm';
import moment from 'moment';

function CensusDetailFormContainer() {
    const currentEvents = useSelector(
        (state) => state.data.tei.data.currentEvents
    );
    const selectedYear = useSelector(
        (state) => state.data.tei.selectedYear.year
    );
    const currentEvent = currentEvents.find(
        (e) => moment(e.eventDate).format('YYYY') === selectedYear
    );

    const dispatch = useDispatch();

    const onSubmit = (eventDataValues) => {
        dispatch(submitEventDataValues(eventDataValues));
    };

    return (
        <CensusDetailForm
            values={currentEvent.dataValues}
            onSubmit={onSubmit}
        />
    );
}

export default CensusDetailFormContainer;
