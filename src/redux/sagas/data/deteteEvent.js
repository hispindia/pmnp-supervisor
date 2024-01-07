import { put, takeEvery, call, all, select } from 'redux-saga/effects';
import { DELETE_EVENT, DELETE_FAMILY_EVENT } from '../../types/data/tei';
import { dataApi } from '../../../api';
import {
    getTeis,
    getTeisErrorMessage,
    getTeisSuccessMessage,
} from '../../actions/teis';
import { getTei, changeFamily } from '../../actions/data/tei';

export default function* deleteEventSaga() {
    yield takeEvery(DELETE_EVENT, handleDeleteEvent);
    yield takeEvery(DELETE_FAMILY_EVENT, handleDeleteFamilyEvent);
}

function* handleDeleteEvent({ eventId }) {
    const { currentTei } = yield select((state) => state.data.tei.data);
    try {
        const payload = eventIdToDeletePayload(eventId);
        yield call(dataApi.deleteEvent, payload);
        yield all([
            put(getTeisSuccessMessage(`Delete event ${eventId} successfully`)),
            put(getTei(currentTei.trackedEntityInstance)),
        ]);
    } catch (e) {
        yield put(getTeisErrorMessage(e.message));
    }
}

function* handleDeleteFamilyEvent({ eventId }) {
    const { currentTei } = yield select((state) => state.data.tei.data);
    const { index, year } = yield select(
        (state) => state.data.tei.selectedYear
    );

    try {
        let memberEventsByYear = yield call(
            dataApi.getEventsByQuery,
            'Ux1dcyOiHe7',
            currentTei.orgUnit,
            [`filter=ig2YSpQdP55:EQ:${currentTei.trackedEntityInstance}`],
            `${year}-01-01`,
            `${year}-12-31`
        );
        console.log('handleDeleteFamilyEvent', memberEventsByYear);
        let memberEventsIds = memberEventsByYear.rows.map((e) => e[0]);
        const payload = eventsIdToDeletePayload([eventId, ...memberEventsIds]);

        yield call(dataApi.deleteEvent, payload);
        yield all([
            put(getTeisSuccessMessage(`Delete event ${eventId} successfully`)),
            put(getTei(currentTei.trackedEntityInstance)),
        ]);
    } catch (e) {
        console.log('e', e);
        yield put(getTeisErrorMessage(e.message));
    }
}

const eventIdToDeletePayload = (eventId) => {
    return {
        events: [
            {
                event: eventId,
            },
        ],
    };
};

const eventsIdToDeletePayload = (eventIds) => {
    let eventsFormat = eventIds.reduce((res, evId) => {
        res.push({ event: evId });
        return res;
    }, []);
    return {
        events: [...eventsFormat],
    };
};
