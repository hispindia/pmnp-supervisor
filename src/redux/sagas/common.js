import { call, put, takeLatest } from "redux-saga/effects";

import {
  SET_OFFLINE_STATUS,
  PUSH_TO_SERVER,
} from "@/redux/actions/common/type";
import { loadTei } from "@/redux/actions/data/tei";

import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";

function* handleOfflineStatusChange({ offlineStatus }) {
  yield put(loadTei(true));

  try {
    // save offline status to localStorage
    localStorage.setItem("offlineStatus", offlineStatus);

    if (offlineStatus) {
      /**
       * pull metadata from server and save to indexedDB
       * */
      yield call(meManager.pull);
      yield call(organisationUnitLevelsManager.pull);
      yield call(organisationUnitManager.pull);
      yield call(programManager.pull);

      /**
       * pull data from server and save to indexedDB
       * */
      yield call(trackedEntityManager.pull);
      yield call(enrollmentManager.pull);
      yield call(eventManager.pull);
    }
  } catch (error) {
  } finally {
    console.log("offlineStatus changed", offlineStatus);
    yield put(loadTei(false));
  }
}

function* handlePushToServer() {
  yield put(loadTei(true));

  try {
    /**
     * push data to server by order
     */
    yield call(trackedEntityManager.push);
    yield call(enrollmentManager.push);
    yield call(eventManager.push);
  } catch (error) {
    console.log("handlePushToServer - error", error);
  } finally {
    console.log("handlePushToServer - finally");
    yield put(loadTei(false));
  }
}

export default function* commonSaga() {
  yield takeLatest(SET_OFFLINE_STATUS, handleOfflineStatusChange);
  yield takeLatest(PUSH_TO_SERVER, handlePushToServer);
}
