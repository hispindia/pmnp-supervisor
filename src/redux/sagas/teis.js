import { put, select, takeLatest, call, all } from "redux-saga/effects";
import {
  GET_TEIS,
  TABLE_CHANGE_PAGE,
  TABLE_FILTER,
  TABLE_SORT,
} from "../types/teis";
import { dataApi } from "../../api";
import {
  changePager,
  filter,
  getTeisErrorMessage,
  getTeisSucceed,
  getTeisSuccessMessage,
  loadTeis,
  sort,
} from "../actions/teis";
import { returnFilterString } from "../../utils";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";

function* getTeis(newPayload = {}) {
  const { offlineStatus } = yield select((state) => state.common);
  const { pager, filters, orderString } = yield select((state) => state.teis);
  yield put(loadTeis(true));
  yield put(getTeisSuccessMessage(null));
  yield put(getTeisErrorMessage(null));
  try {
    const currentPayload = {
      page: pager.page,
      pageSize: pager.pageSize,
      filters,
      orderString,
    };
    const nextPayload = Object.assign(currentPayload, newPayload);
    const selectedOrgUnit = yield select(
      (state) => state.metadata.selectedOrgUnit
    );
    const programMetadata = yield select(
      (state) => state.metadata.programMetadata
    );
    let instanceList = {};

    // OFFLINE MODE
    if (offlineStatus) {
      instanceList = yield call(trackedEntityManager.find, {
        orgUnit: selectedOrgUnit.id,
        program: programMetadata.id,
        pageSize: nextPayload.pageSize,
        page: nextPayload.page,
        filters: returnFilterString(nextPayload.filters)
          .split("&")
          .filter(Boolean),
        ouMode: "DESCENDANTS",
      });

      console.log("getTrackedEntityInstanceListByQuery", { instanceList });
    } else {
      instanceList = yield call(
        dataApi.getTrackedEntityInstanceListByQuery,
        selectedOrgUnit.id,
        programMetadata.id,
        nextPayload.pageSize,
        nextPayload.page,
        returnFilterString(nextPayload.filters),
        nextPayload.orderString
      );
    }

    console.log({ instanceList });

    yield put(getTeisSucceed(instanceList));
    yield all([
      put(filter(nextPayload.filters)),
      put(sort(nextPayload.orderString)),
      put(
        changePager({
          page: instanceList.page,
          pageSize: instanceList.pageSize,
          total: instanceList.total,
          pageCount: instanceList.pageCount,
        })
      ),
    ]);
    yield put(
      getTeisSuccessMessage("Get tracked entity instances successfully")
    );
  } catch (e) {
    const result = yield e.json();

    if (result.message) {
      yield put(getTeisErrorMessage(result.message));
    } else {
      yield put(getTeisErrorMessage(e.message));
    }
  } finally {
    yield put(loadTeis(false));
  }
}

export default function* getTeisSaga() {
  yield takeLatest(GET_TEIS, getTeis);
  yield takeLatest(TABLE_FILTER, handleTableFilter);
  yield takeLatest(TABLE_SORT, handleTableSort);
  yield takeLatest(TABLE_CHANGE_PAGE, handleChangePage);
}

function* handleTableFilter({ value, teiId }) {
  try {
    const oldFilter = yield select((state) => state.teis.filters);
    let newFilters = [...oldFilter];
    if (value) {
      let find = newFilters.findIndex((e) => e.teiId === teiId);
      if (find >= 0) {
        newFilters[find].value = value;
      } else {
        newFilters.push({
          value,
          teiId,
        });
      }
    } else {
      let find = newFilters.findIndex((e) => e.teiId === teiId);
      newFilters.splice(find, 1);
    }
    yield call(getTeis, {
      page: 1,
      filters: newFilters,
    });
  } catch (e) {
    console.error(e);
    yield put(getTeisErrorMessage("Filter error!!!"));
  }
}

function* handleTableSort({ tableFilterData }) {
  try {
    if (tableFilterData) {
      let newOrderString = "";
      if (tableFilterData.order === "descend") {
        newOrderString = `order=${tableFilterData.columnKey}:desc`;
      } else {
        if (tableFilterData.order === "ascend") {
          newOrderString = `order=${tableFilterData.columnKey}:asc`;
        } else {
          newOrderString = `order=lastupdated:desc`;
        }
      }
      yield call(getTeis, {
        page: 1,
        orderString: newOrderString,
      });
    }
  } catch (e) {
    console.error(e);
    yield put(getTeisErrorMessage("Sort error!!!"));
  }
}

function* handleChangePage({ page: newPage, pageSize: newPageSize }) {
  try {
    yield call(getTeis, {
      page: newPage,
      pageSize: newPageSize,
    });
  } catch (e) {
    console.error(e);
    yield put(getTeisErrorMessage("Change page error!!!"));
  }
}
