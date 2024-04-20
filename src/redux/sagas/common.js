import { call, put, takeLatest } from "redux-saga/effects";

import {
  PUSH_TO_SERVER,
  SET_OFFLINE_LOADING_STATUS,
  SET_OFFLINE_STATUS,
} from "@/redux/actions/common/type";
import { message, notification } from "antd";

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
import { useTranslation } from "react-i18next";

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

  // redirect to list page
  window.location.reload();
}

function handlePushResult(result, message) {
  if (result?.length > 0 && result.status != "OK") {
    if (result.some((result) => result.status != "OK")) {
      throw new Error(message);
    }
  }
}

function* handlePushToServer() {
  try {
    /**
     * push data to server by order
     */

    // Check internet connection
    if (!navigator.onLine) {
      throw new Error("No internet connection!");
    }

    // push tracked entities
    const teiPushResults = yield call(trackedEntityManager.push);
    handlePushResult(teiPushResults, "Push tracked entities failed!");
    yield put(setCurrentOfflineLoading({ id: "tei", percent: 100 }));

    // push enrollments
    const enrPushResults = yield call(enrollmentManager.push);
    handlePushResult(enrPushResults, "Push enrollments failed!");
    yield put(setCurrentOfflineLoading({ id: "enr", percent: 100 }));

    // push events
    const eventPushRetuls = yield call(eventManager.push);
    handlePushResult(eventPushRetuls, "Push events failed!");
    yield put(setCurrentOfflineLoading({ id: "event", percent: 100 }));

    // if there is no error, set offline status to false
    yield put(setOfflineStatus(false));
  } catch (error) {
    notification.warning({
      message: "Warning",
      description: error ? error.message : "Sync data to server failed!",
      placement: "bottomRight",
      duration: 5,
    });

    console.log("handlePushToServer - error", error);
  } finally {
    console.log("handlePushToServer - finally");
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
