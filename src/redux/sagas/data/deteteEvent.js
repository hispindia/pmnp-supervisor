import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { dataApi } from "../../../api";
import { getTei } from "../../actions/data/tei";
import { getTeisErrorMessage, getTeisSuccessMessage } from "../../actions/teis";
import { DELETE_EVENT, DELETE_FAMILY_EVENT } from "../../types/data/tei";
import * as eventManager from "../../../indexDB/EventManager/EventManager";
import { getEventsByYear } from "@/utils/event";
import {
  MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
  MEMBER_FAMILY_UID_ATTRIBUTE_ID,
} from "@/constants/app-config";

export default function* deleteEventSaga() {
  yield takeEvery(DELETE_EVENT, handleDeleteEvent);
  yield takeEvery(DELETE_FAMILY_EVENT, handleDeleteFamilyEvent);
}

function* handleDeleteEvent({ eventId, refreshTei = true }) {
  const { offlineStatus } = yield select((state) => state.common);
  const { currentTei } = yield select((state) => state.data.tei.data);

  try {
    const payload = eventIdToDeletePayload(eventId);
    if (offlineStatus) {
      yield call(eventManager.deleteEvents, {
        events: payload.events,
      });
    } else {
      yield call(dataApi.deleteEvent, payload);
    }

    yield all([
      put(getTeisSuccessMessage(`Delete event ${eventId} successfully`)),
      refreshTei && put(getTei(currentTei.trackedEntity)),
    ]);
  } catch (e) {
    yield put(getTeisErrorMessage(e.message));
  }
}

function* handleDeleteFamilyEvent({ eventId }) {
  const { offlineStatus } = yield select((state) => state.common);

  const { currentTei, currentEvents } = yield select(
    (state) => state.data.tei.data
  );

  // TODO
  const year = 2025;

  const eventsByYear = getEventsByYear(currentEvents, year);
  const eventIds = eventsByYear.map((e) => e.event);
  console.log({ eventsByYear });

  try {
    let memberEventsIds = [];
    if (offlineStatus) {
      let memberEventsByYear = yield call(eventManager.getEventsByQuery, {
        programStage: MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
        orgUnit: currentTei.orgUnit,
        filters: [
          `filter=${MEMBER_FAMILY_UID_ATTRIBUTE_ID}:EQ:${currentTei.trackedEntity}`,
        ],
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
      });

      memberEventsIds = memberEventsByYear.events.map((e) => e.event);
    } else {
      let memberEventsByYear = yield call(
        dataApi.getEventsByQuery,
        MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
        currentTei.orgUnit,
        [
          `filter=${MEMBER_FAMILY_UID_ATTRIBUTE_ID}:EQ:${currentTei.trackedEntity}`,
        ],
        `${year}-01-01`,
        `${year}-12-31`
      );

      memberEventsIds = memberEventsByYear.rows.map((e) => e[0]);
    }

    const payload = eventsIdToDeletePayload([...eventIds, ...memberEventsIds]);

    if (offlineStatus) {
      yield call(eventManager.deleteEvents, {
        events: payload.events,
      });
    } else {
      yield call(dataApi.deleteEvent, payload);
    }

    yield all([
      put(getTeisSuccessMessage(`Delete event ${eventId} successfully`)),
      put(getTei(currentTei.trackedEntity)),
    ]);
  } catch (e) {
    console.log("e", e);
    yield put(getTeisErrorMessage(e.message));
  }
}

const eventIdToDeletePayload = (eventId) => {
  return {
    events: [
      {
        event: eventId,
      },
    ],
  };
};

const eventsIdToDeletePayload = (eventIds) => {
  let eventsFormat = eventIds.reduce((res, evId) => {
    res.push({ event: evId });
    return res;
  }, []);
  return {
    events: [...eventsFormat],
  };
};
