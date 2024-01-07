import {
    SUBMIT_EVENT_DATA_VALUES,
    UPDATE_EVENTS,
} from '../../../types/data/tei';

export const submitEventDataValues = (dataValues) => ({
    type: SUBMIT_EVENT_DATA_VALUES,
    dataValues,
});

export const updateEvents = (newEvents) => ({
    type: UPDATE_EVENTS,
    newEvents,
});
