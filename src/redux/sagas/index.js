import { all } from 'redux-saga/effects';
import dataSaga from './data';
import teisSaga from './teis';
import common from './common';

export default function* rootSaga() {
    yield all([dataSaga(), teisSaga(), common()]);
}
