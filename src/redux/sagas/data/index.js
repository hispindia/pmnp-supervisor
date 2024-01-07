import { all } from 'redux-saga/effects';
import getTei from './getTei';
import submitAttributes from './submitAttributes';
import deleteTeiSaga from './deteteTei';
import submitEvent from './submitEvent';
import deteteEventSaga from './deteteEvent';
import deteteMemberSaga from './deleteMember';
import submitEventDataValues from './submitEventDataValues';

export default function* dataSaga() {
    yield all([
        getTei(),
        deleteTeiSaga(),
        submitAttributes(),
        submitEvent(),
        deteteEventSaga(),
        deteteMemberSaga(),
        submitEventDataValues(),
    ]);
}
