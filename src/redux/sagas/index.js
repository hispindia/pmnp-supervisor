import { all } from 'redux-saga/effects';
import dataSaga from './data';
import teisSaga from './teis';
import common from './common';
import usersSaga from './users';

export default function* rootSaga() {
    yield all([usersSaga(), dataSaga(), teisSaga(), common()]);
}
