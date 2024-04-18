import { call, put, takeLatest } from "redux-saga/effects";

import {
  PUSH_TO_SERVER,
  SET_OFFLINE_LOADING_STATUS,
  SET_OFFLINE_STATUS,
} from "@/redux/actions/common/type";
import { loadTei } from "@/redux/actions/data/tei";

import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";

import { mainStore } from "@/redux/store";
import {
  setCurrentOfflineLoading,
  setOfflineStatus,
} from "@/redux/actions/common";

function handleDispatchCurrentOfflineLoading({ id, percent }) {
  mainStore.dispatch(setCurrentOfflineLoading({ id, percent }));
}

function* handleOfflineLoadingStatusChange({ offlineLoading }) {
  try {
    if (offlineLoading) {
      /**
       * pull metadata from server and save to indexedDB
       * */
      yield put(setCurrentOfflineLoading({ id: "metadata", percent: 0 }));
      yield call(meManager.pull);
      yield put(setCurrentOfflineLoading({ id: "metadata", percent: 15 }));
      yield call(organisationUnitLevelsManager.pull);
      yield put(setCurrentOfflineLoading({ id: "metadata", percent: 30 }));
      yield call(organisationUnitManager.pull);
      yield put(setCurrentOfflineLoading({ id: "metadata", percent: 70 }));
      yield call(programManager.pull);
      yield put(setCurrentOfflineLoading({ id: "metadata", percent: 100 }));

      /**
       * pull data from server and save to indexedDB
       * */
      yield call(trackedEntityManager.pull, {
        handleDispatchCurrentOfflineLoading,
      });
      yield call(enrollmentManager.pull, {
        handleDispatchCurrentOfflineLoading,
      });
      yield call(eventManager.pull, {
        handleDispatchCurrentOfflineLoading,
      });
    }
  } catch (error) {
    yield put(setOfflineStatus(false));
    console.log("handleOfflineLoadingStatusChange - error", error);
  } finally {
    console.log("offlineLoading changed", offlineLoading);
  }
}

function* handleOfflineStatusChange({ offlineStatus }) {
  localStorage.setItem("offlineStatus", offlineStatus);
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
  yield takeLatest(
    SET_OFFLINE_LOADING_STATUS,
    handleOfflineLoadingStatusChange
  );
  yield takeLatest(PUSH_TO_SERVER, handlePushToServer);
}
