import { takeLatest } from "redux-saga/effects";

import { SET_OFFLINE_LOADING_STATUS, SET_OFFLINE_STATUS } from "@/redux/actions/common/type";

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

export default function* commonSaga() {
  yield takeLatest(SET_OFFLINE_STATUS, handleOfflineStatusChange);
  yield takeLatest(SET_OFFLINE_LOADING_STATUS, handleOfflineLoadingStatusChange);
}
