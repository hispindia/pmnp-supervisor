import {
    SUBMIT_EVENT_DATA_VALUES,
    UPDATE_EVENTS,
    SUBMIT_EVENT,
    SUBMIT_EVENTS,
} from '../../../types/data/tei';

export const submitEventDataValues = (dataValues) => ({
    type: SUBMIT_EVENT_DATA_VALUES,
    dataValues,
});

export const submitEvent = (event) => ({
    type: SUBMIT_EVENT,
    event,
});

export const submitEvents = (event) => ({
    type: SUBMIT_EVENTS,
    event,
});

export const updateEvents = (newEvents) => ({
    type: UPDATE_EVENTS,
    newEvents,
});
