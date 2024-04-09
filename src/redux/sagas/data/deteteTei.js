import { put, takeEvery, call, all, select } from "redux-saga/effects";
import { DELETE_TEI } from "../../types/data/tei";
import { dataApi } from "../../../api";
import {
  getTeis,
  getTeisErrorMessage,
  getTeisSuccessMessage,
} from "../../actions/teis";
import * as trackedEntityInstanceManager from "@/indexDB/TrackedEntityInstanceManager";

export default function* deleteTeiSaga() {
  yield takeEvery(DELETE_TEI, handleDeleteTei);
}

function* handleDeleteTei({ teiId }) {
  const { offlineStatus } = yield select((state) => state.common);

  try {
    const payload = teiIdToDeletePayload(teiId);

    if (offlineStatus) {
      yield call(trackedEntityInstanceManager.deleteTrackedEntityInstances, {
        trackedEntityInstances: payload.trackedEntityInstances,
      });
    } else {
      yield call(dataApi.deleteTei, payload);
    }

    yield all([
      put(getTeisSuccessMessage(`Delete ${teiId} successfully`)),
      put(getTeis()),
    ]);
  } catch (e) {
    console.error("handleDeleteTei error", e);
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
