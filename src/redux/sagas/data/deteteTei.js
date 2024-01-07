import { put, takeEvery, call, all } from 'redux-saga/effects';
import { DELETE_TEI } from '../../types/data/tei';
import { dataApi } from '../../../api';
import {
    getTeis,
    getTeisErrorMessage,
    getTeisSuccessMessage,
} from '../../actions/teis';

export default function* deleteTeiSaga() {
    yield takeEvery(DELETE_TEI, handleDeleteTei);
}

function* handleDeleteTei({ teiId }) {
    try {
        const payload = teiIdToDeletePayload(teiId);
        yield call(dataApi.deleteTei, payload);
        yield all([
            put(getTeisSuccessMessage(`Delete ${teiId} successfully`)),
            put(getTeis()),
        ]);
    } catch (e) {
        console.error('test e', e);
        yield put(getTeisErrorMessage(e.message));
    }
}

const teiIdToDeletePayload = (teiId) => {
    return {
        trackedEntityInstances: [
            {
                trackedEntityInstance: teiId,
            },
        ],
    };
};
