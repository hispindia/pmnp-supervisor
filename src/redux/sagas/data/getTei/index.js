import { FAMILY_UID_ATTRIBUTE_ID, MEMBER_PROGRAM_ID, MEMBER_TRACKED_ENTITY_TYPE_ID } from "@/constants/app-config";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import { push } from "connected-react-router";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { dataApi } from "../../../../api";
import { editingAttributes } from "../../../actions/data";
import { getTeiError, getTeiSuccessMessage, loadTei } from "../../../actions/data/tei";
import { setSelectedOrgUnit } from "../../../actions/metadata";
import { GET_TEI } from "../../../types/data/tei";
import { getSelectedOrgUnitByOuId, getTeiId } from "../utils";
import initCascadeDataFromTEIsEvents from "./initCascadeData";
import handleInitData from "./initData";
import initInterviewCascadeDataFromTEIsEvents from "./initInterviewCascadeData";
import handleInitNewData from "./initNewData";

export const teiMapping = {
  // firstname: "IEE2BMhfoSc",
  // lastname: "IBLkiaYRRL3",
  // sex: "DmuazFb368B",
  // ethnicity: "tJrT8GIy477",
  // birthyear: "bIzDI9HJCB0",
  // age: "BaiVwt8jVfg",
  // nationality: "NLth2WTyo7M",
  // status: "tASKWHyRolc",
  // agetype: "ck9h7CokxQE",
  // DOB: "tQeFLjYbqzv",
};

function* handleGetTei() {
  yield put(loadTei(true));

  try {
    const teiId = yield call(getTeiId);
    if (teiId) {
      yield call(initExistedDataSaga, teiId);
      yield put(getTeiSuccessMessage(`Get tracked entity instance: ${teiId}`));
    } else {
      const selectedOu = yield select((state) => state.metadata.selectedOrgUnit);
      if (!selectedOu) {
        return yield put(push("/"));
      }
      yield call(initNewDataSaga);
      yield put(getTeiSuccessMessage(`Open add new family form`));
    }
  } catch (e) {
    console.error("handleGetTei", e);
    yield put(getTeiError(e.message));
  } finally {
    yield put(loadTei(false));
  }
}

export default function* getTei() {
  yield takeLatest(GET_TEI, handleGetTei);
}

function* initExistedDataSaga() {
  const { offlineStatus } = yield select((state) => state.common);
  const teiId = yield call(getTeiId);
  const programId = yield select((state) => state.metadata.programMetadata.id);
  console.log({ programId });

  let data = {};

  // OFFLINE MODE
  if (offlineStatus) {
    // clone new data object
    data = yield call(trackedEntityManager.getTrackedEntityInstanceById, {
      trackedEntity: teiId,
      program: programId,
    });
  } else {
    // get Family TEI
    data = yield call(dataApi.getTrackedEntityInstanceById, teiId, programId);
  }

  console.log("initExistedDataSaga", { data });

  // clone new data object
  const teiData = JSON.parse(JSON.stringify(data));

  const { orgUnit } = data;

  const selectedOrgUnit = yield call(getSelectedOrgUnitByOuId, orgUnit);

  let memberTEIs = { trackedEntities: [] };

  // OFFLINE MODE
  if (offlineStatus) {
    memberTEIs = yield call(trackedEntityManager.getTrackedEntityInstances, {
      orgUnit,
      filters: [`attribute=${FAMILY_UID_ATTRIBUTE_ID}:EQ:${teiId}`],
    });
  } else {
    // get Members TEI
    memberTEIs = yield call(dataApi.getTrackedEntityInstances, {
      ou: orgUnit,
      filters: [`attribute=${FAMILY_UID_ATTRIBUTE_ID}:EQ:${teiId}`],
      attributes: Object.entries(teiMapping).map((e) => e[1]),
      program: MEMBER_PROGRAM_ID,
    });
  }

  // const headerIndexes = yield call(getHeaderIndexes, memberTEIs);
  const memberTEIsUid = memberTEIs.instances.map((tei) => tei.trackedEntity);

  // get by event query
  let memberTEIsEvents = null;

  if (memberTEIsUid && memberTEIsUid.length > 0) {
    if (offlineStatus) {
      memberTEIsEvents = yield call(trackedEntityManager.getTrackedEntityInstancesByIDs, {
        program: MEMBER_PROGRAM_ID,
        trackedEntities: memberTEIsUid,
      });
    } else {
      memberTEIsEvents = yield call(dataApi.getAllTrackedEntityInstancesByIDs, {
        program: MEMBER_PROGRAM_ID,
        teiList: memberTEIsUid,
      });
    }
  }

  if (!selectedOrgUnit) {
    throw new Error("Org Unit not found!");
  }

  yield put(setSelectedOrgUnit(selectedOrgUnit));
  yield call(handleInitData, teiData);
  yield call(initCascadeDataFromTEIsEvents, memberTEIs, false);
  yield call(initInterviewCascadeDataFromTEIsEvents, memberTEIsEvents, memberTEIs);
  yield put(editingAttributes(false));
}

function* initNewDataSaga() {
  yield call(handleInitNewData);
  yield put(editingAttributes(true));
}
