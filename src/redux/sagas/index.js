import { all } from "redux-saga/effects";
import dataSaga from "./data";
import teisSaga from "./teis";

export default function* rootSaga() {
  yield all([dataSaga(), teisSaga()]);
}
