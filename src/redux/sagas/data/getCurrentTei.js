import { takeLatest, call, put, select } from 'redux-saga/effects';
import { GET_TEI } from '../../types/data/tei';
import { initData, initNewData } from '../../actions/data';
import { dataApi } from '../../../api';

function* handleGetTei({ tei: teiId }) {
    const programId = yield select(
        (state) => state.metadata.programMetadata.id
    );

    if (teiId) {
        try {
            const data = yield call(
                dataApi.getTrackedEntityInstanceById,
                teiId,
                programId
            );
            yield put(initData(data));
        } catch (e) {
            console.log(e);
            yield put(initNewData());
        }
    } else {
        // TODO: [Liem]: redirect to tei = null
        yield put(initNewData());
    }
}
export default function* getTei() {
    yield takeLatest(GET_TEI, handleGetTei);
}
