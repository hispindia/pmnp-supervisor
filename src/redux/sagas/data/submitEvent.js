import i18n from "i18next";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { dataApi } from "../../../api";
import { SUBMIT_EVENT, SUBMIT_EVENTS } from "../../types/data/tei";

import { getTei, getTeiError, loadTei } from "../../actions/data/tei";

import * as eventManager from "@/indexDB/EventManager/EventManager";
import { notification } from "antd";

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

    if (refreshTei) yield put(getTei(currentTei.trackedEntity));
  } catch (e) {
    console.error("handleSubmitEvent", e);
    const result = yield e.json();
    const message = result.validationReport.errorReports.map((errorReport) => errorReport.message).join("\n");
    notification.error({
      message: i18n.t("Error"),
      description: message || "Save event failed!",
      placement: "bottomRight",
      duration: 0,
    });

    // comment because cannot refresh tei
    // yield put(getTeiError("save event failed!"));
  } finally {
    // refresh TEI
    yield put(loadTei(false));
    /**
     * this line should be placed after the loadTei(false) to keep the loading state
     *  */
  }
}

export default function* submitEvents() {
  yield takeLatest(SUBMIT_EVENT, handleSubmitEvent);
  yield takeLatest(SUBMIT_EVENTS, handleSubmitEvent);
}
