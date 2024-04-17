import { call, put, takeLatest } from "redux-saga/effects";

import { PUSH_TO_SERVER, SET_OFFLINE_LOADING_STATUS, SET_OFFLINE_STATUS } from "@/redux/actions/common/type";
import { loadTei } from "@/redux/actions/data/tei";

import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";

import { setCurrentOfflineLoading } from "../actions/common";

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
      const programs = yield call(programManager.getPrograms);
      const { organisationUnits } = yield call(meManager.getMe);

      const teiPages = yield call(trackedEntityManager.firstPull(programs, organisationUnits));
      const totalTei = teiPages.reduce((acc, curr) => acc + curr.totalPages, 0);
      yield put(setCurrentOfflineLoading({ id: "tei", percent: Math.round((teiPages.length / totalTei) * 100) }));

      for (const org of organisationUnits) {
        for (const program of programs) {
          const found = teiPages.find((p) => p.org === org && p.program === program);
          const indexFound = teiPages.findIndex((p) => p.org === org && p.program === program);
          const completed = indexFound > 0 ? teiPages.reduce((acc, curr, idx) => (idx < indexFound ? acc + curr.totalPages : acc), 0) : 0;

          for (let page = 2; page < found.totalPages; page++) {
            yield call(trackedEntityManager.pull(org, program, page));
            //current page completed = first pull pages + current page + completed
            yield put(setCurrentOfflineLoading({ id: "tei", percent: Math.round(((teiPages.length + page + completed) / totalTei) * 100) }));
          }
        }
      }

      const enrPages = yield call(enrollmentManager.firstPull(programs, organisationUnits));
      const totalEnr = enrPages.reduce((acc, curr) => acc + curr.totalPages, 0);
      yield put(setCurrentOfflineLoading({ id: "enr", percent: Math.round((enrPages.length / totalEnr) * 100) }));

      for (const org of organisationUnits) {
        for (const program of programs) {
          const found = enrPages.find((p) => p.org === org && p.program === program);
          const indexFound = enrPages.findIndex((p) => p.org === org && p.program === program);
          const completed = indexFound > 0 ? enrPages.reduce((acc, curr, idx) => (idx < indexFound ? acc + curr.totalPages : acc), 0) : 0;

          for (let page = 2; page < found.totalPages; page++) {
            yield call(enrollmentManager.pull(org, program, page));
            //current page completed = first pull pages + current page + completed
            yield put(setCurrentOfflineLoading({ id: "enr", percent: Math.round(((enrPages.length + page + completed) / totalEnr) * 100) }));
          }
        }
      }

      const eventPages = yield call(eventManager.firstPull(programs, organisationUnits));
      const totalEvent = eventPages.reduce((acc, curr) => acc + curr.totalPages, 0);
      yield put(setCurrentOfflineLoading({ id: "event", percent: Math.round((eventPages.length / totalEvent) * 100) }));

      for (const org of organisationUnits) {
        for (const program of programs) {
          const found = eventPages.find((p) => p.org === org && p.program === program);
          const indexFound = eventPages.findIndex((p) => p.org === org && p.program === program);
          const completed = indexFound > 0 ? eventPages.reduce((acc, curr, idx) => (idx < indexFound ? acc + curr.totalPages : acc), 0) : 0;

          for (let page = 2; page < found.totalPages; page++) {
            yield call(eventManager.pull(org, program, page));
            //current page completed = first pull pages + current page + completed
            yield put(setCurrentOfflineLoading({ id: "event", percent: Math.round(((eventPages.length + page + completed) / totalEvent) * 100) }));
          }
        }
      }
    }
  } catch (error) {
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
  yield takeLatest(SET_OFFLINE_LOADING_STATUS, handleOfflineLoadingStatusChange);
  yield takeLatest(PUSH_TO_SERVER, handlePushToServer);
}
