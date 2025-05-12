import { call, put, select, takeLatest } from "redux-saga/effects";
import { dataApi } from "../../../api";
import { SUBMIT_EVENT, SUBMIT_EVENTS } from "../../types/data/tei";

import { getTei, getTeiError, loadTei } from "../../actions/data/tei";

import * as eventManager from "@/indexDB/EventManager/EventManager";

function* handleSubmitEvent({ event, refreshTei = true }) {
  const { offlineStatus } = yield select((state) => state.common);

  yield put(loadTei(true));
  const { currentTei } = yield select((state) => state.data.tei.data);

  try {
    //  PUSH EVENTS
    if (offlineStatus) {
      // save to indexedDB
      yield call(eventManager.setEvents, { events: [event] });
    } else {
      yield call(dataApi.pushEvents, { events: [event] });
    }
  } catch (e) {
    console.error("handleSubmitEvent", e);
    // comment because cannot refresh tei
    // yield put(getTeiError("save event failed!"));
  } finally {
    // refresh TEI
    yield put(loadTei(false));

    /**
     * this line should be placed after the loadTei(false) to keep the loading state
     *  */
    if (refreshTei) yield put(getTei(currentTei.trackedEntity));
  }
}

export default function* submitEvents() {
  yield takeLatest(SUBMIT_EVENT, handleSubmitEvent);
  yield takeLatest(SUBMIT_EVENTS, handleSubmitEvent);
}
