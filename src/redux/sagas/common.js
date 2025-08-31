import { call, put, select, takeLatest } from "redux-saga/effects";

import { PUSH_TO_SERVER, SET_OFFLINE_LOADING_STATUS, SET_OFFLINE_STATUS } from "@/redux/actions/common/type";
import { notification } from "antd";

import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";

import { mainStore } from "@/redux/store";
import { setCurrentOfflineLoading, setOfflineLoadingStatus, setOfflineStatus } from "@/redux/actions/common";
import { dataApi } from "@/api";

function handleDispatchCurrentOfflineLoading({ id, percent }) {
  mainStore.dispatch(setCurrentOfflineLoading({ id, percent }));
}

// do nothing, hanled in modal component
function* handleOfflineLoadingStatusChange({ offlineLoading }) {
  // const offlineSelectedOrgUnits = yield select((state) => state.common.offlineSelectedOrgUnits);
  // try {
  //   if (offlineLoading) {
  //     // Initialize session-based authentication for pull operations
  //     console.log("Initializing session for data pull...");
  //     const sessionInitialized = yield call([dataApi, "enableSessionMode"]);
  //     if (!sessionInitialized) {
  //       console.log("Session initialization failed, falling back to basic auth for pull operations");
  //       // Continue with basic auth if session fails
  //     } else {
  //       console.log("Session-based authentication enabled for pull operations");
  //     }
  //     /**
  //      * pull metadata from server and save to indexedDB
  //      * */
  //     yield put(setCurrentOfflineLoading({ id: "metadata", percent: 0 }));
  //     yield call(meManager.pull);
  //     yield put(setCurrentOfflineLoading({ id: "metadata", percent: 15 }));
  //     yield call(organisationUnitLevelsManager.pull);
  //     yield put(setCurrentOfflineLoading({ id: "metadata", percent: 30 }));
  //     yield call(organisationUnitManager.pull);
  //     yield put(setCurrentOfflineLoading({ id: "metadata", percent: 70 }));
  //     yield call(programManager.pull);
  //     yield put(setCurrentOfflineLoading({ id: "metadata", percent: 100 }));
  //     /**
  //      * pull data from server and save to indexedDB
  //      * */
  //     console.log({ offlineSelectedOrgUnits, offlineLoading });
  //     yield call(trackedEntityManager.pull, {
  //       handleDispatchCurrentOfflineLoading,
  //       offlineSelectedOrgUnits,
  //     });
  //     yield call(enrollmentManager.pull, {
  //       handleDispatchCurrentOfflineLoading,
  //       offlineSelectedOrgUnits,
  //     });
  //     yield call(eventManager.pull, {
  //       handleDispatchCurrentOfflineLoading,
  //       offlineSelectedOrgUnits,
  //     });
  //     yield put(setOfflineStatus(true));
  //     yield put(setOfflineLoadingStatus(false));
  //   }
  // } catch (error) {
  //   yield put(setOfflineStatus(false));
  //   yield put(setOfflineLoadingStatus(false));
  //   console.log("handleOfflineLoadingStatusChange - error", error);
  // } finally {
}

function* handleOfflineStatusChange({ offlineStatus }) {
  localStorage.setItem("offlineStatus", offlineStatus);

  // if (!offlineStatus) {
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 3000); // wait for 3 second before reloading
  // }
}

function* handlePushResult(result, message) {
  if (result?.length > 0 && result.status != "OK") {
    if (result.some((result) => result.status != "OK")) {
      const errors = [];

      for (let i = 0; i < result.length; i++) {
        try {
          const error = yield result[i].json();

          errors.push(error);
        } catch (err) {}
      }

      const errorMessages = errors.map((error) =>
        error.validationReport.errorReports.map((errorReport) => errorReport.message).join("\n"),
      );

      console.log({ errorMessages });

      throw new Error(message + "\n" + errorMessages.join("\n"));
    }
  }
}

function* handlePushToServer() {
  try {
    /**
     * Initialize session before pushing data
     */

    // Check internet connection
    if (!navigator.onLine) {
      throw new Error("No internet connection!");
    }

    // Initialize session-based authentication
    console.log("Initializing session for data push...");

    /**
     * push data to server by order
     */

    // push tracked entities
    const teiPushResults = yield call(trackedEntityManager.push);
    yield handlePushResult(teiPushResults, "Sync tracked entities failed: ");
    yield put(setCurrentOfflineLoading({ id: "tei", percent: 100 }));

    // push enrollments
    const enrPushResults = yield call(enrollmentManager.push);
    yield handlePushResult(enrPushResults, "Sync enrollments failed: ");
    yield put(setCurrentOfflineLoading({ id: "enr", percent: 100 }));

    // push events
    const eventPushRetuls = yield call(eventManager.push);
    yield handlePushResult(eventPushRetuls, "Sync events failed: ");
    yield put(setCurrentOfflineLoading({ id: "event", percent: 100 }));

    // if there is no error, set offline status to false

    // wait for 3 second to show 100% progress bar
    yield new Promise((resolve) => setTimeout(resolve, 3000));
    yield put(setOfflineStatus(false));
  } catch (error) {
    notification.warning({
      message: "Warning",
      description: error ? error.message : "Sync data to server failed!",
      placement: "bottomRight",
      duration: 0,
    });

    console.table(error);
  } finally {
    console.log("handlePushToServer - finally");
  }
}

export default function* commonSaga() {
  yield takeLatest(SET_OFFLINE_STATUS, handleOfflineStatusChange);
  yield takeLatest(SET_OFFLINE_LOADING_STATUS, handleOfflineLoadingStatusChange);
  yield takeLatest(PUSH_TO_SERVER, handlePushToServer);
}
