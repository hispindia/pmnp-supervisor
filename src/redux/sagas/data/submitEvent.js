import { call, put, select, takeLatest } from "redux-saga/effects";
import { dataApi } from "../../../api";
import {
  CLONE_EVENT,
  SUBMIT_EVENT,
  SUBMIT_EVENTS,
  UPDATE_EVENT_DATE,
} from "../../types/data/tei";
import { generateTEIDhis2Payload, getCurrentEvent } from "./utils";
import { transformEvent } from "@/utils/event";

import {
  getTei,
  getTeiError,
  getTeiSuccessMessage,
  loadTei,
} from "../../actions/data/tei";
import { updateCascade } from "../../actions/data/tei/currentCascade";
import { updateEvents } from "../../actions/data/tei/currentEvent";

import { generateUid } from "@/utils";

import moment from "moment";
import * as eventManager from "@/indexDB/EventManager";
import * as trackedEntityInstanceManager from "@/indexDB/TrackedEntityInstanceManager";

const teiMapping = {
  firstname: "IEE2BMhfoSc",
  lastname: "IBLkiaYRRL3",
  sex: "DmuazFb368B",
  ethnicity: "tJrT8GIy477",
  birthyear: "bIzDI9HJCB0",
  age: "BaiVwt8jVfg",
  nationality: "NLth2WTyo7M",
  status: "tASKWHyRolc",
  agetype: "ck9h7CokxQE",
  DOB: "tQeFLjYbqzv",
};

function* handleSubmitEvent({ event }) {
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
  } catch (e) {
    console.error("handleSubmitEvent", e.message);
    yield put(getTeiError(e.message));
  } finally {
    // refresh TEI
    yield put(getTei(currentTei.trackedEntityInstance));
    yield put(loadTei(false));
  }
}

function* handleEditEventDate({ year }) {
  const { offlineStatus } = yield select((state) => state.common);
  yield put(loadTei(true));
  const currentEvent = yield call(getCurrentEvent);

  const newCurrentEvent = {
    ...currentEvent,
    eventDate: `${year}-12-31`,
    dueDate: `${year}-12-31`,
  };
  let payloadTransformed = yield call(transformEvent, {
    dataValues: { ...newCurrentEvent.dataValues },
  });

  try {
    yield call(dataApi.pushEvents, {
      events: [
        {
          ...newCurrentEvent,
          dataValues: payloadTransformed.dataValues,
        },
      ],
    });
    yield put(getTeiSuccessMessage(`Updated successfully`));
    yield put(getTei());
  } catch (e) {
    console.error("handleEditEventDate", e.message);
    yield put(getTeiError(e.message));
  }
  yield put(loadTei(false));
}

function* handleCloneEvent({ year }) {
  const { offlineStatus } = yield select((state) => state.common);
  console.log("handleCloneEvent", { year });

  yield put(loadTei(true));
  const { currentEvents, currentTei, currentEnrollment, currentCascade } =
    yield select((state) => state.data.tei.data);

  const { selectedOrgUnit, programMetadata, programMetadataMember } =
    yield select((state) => state.metadata);

  function* getLastestEvent(paramEvents = []) {
    let tempEvents = currentEvents.length > 0 ? currentEvents : paramEvents;
    let listEvents = JSON.parse(
      JSON.stringify(
        tempEvents.sort(function (a, b) {
          var keyA = new Date(a.eventDate),
            keyB = new Date(b.eventDate);
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        })
      )
    );
    return listEvents.pop();
  }
  let previousEvent = yield call(getLastestEvent);

  console.log({ previousEvent });

  // clone from previous event if it's exist - and clone active user only
  // let isCloned = false;
  // let dataValues = null;
  let cascadeDataValue = null;
  let payloadTransformed = null;

  if (previousEvent) {
    // Clone object
    // dataValues = JSON.parse(JSON.stringify(previousEvent.dataValues));
    payloadTransformed = yield call(transformEvent, {
      dataValues: { ...previousEvent.dataValues },
    });
    const previousEventYear = moment(previousEvent.eventDate).year();
    // Clone cascadeDataValue
    cascadeDataValue = JSON.parse(
      JSON.stringify(currentCascade[previousEventYear])
    );

    if (cascadeDataValue) {
      let cascadeData = cascadeDataValue;
      cascadeData = cascadeData.filter(
        (e) => e["status"] != "dead" && e["status"] != "transfer-out"
      );

      cascadeData.forEach((e) => {
        if (e["age"] != "" && e["agetype"] == "age") {
          e["age"] = parseInt(e["age"]) + 1 + "";
        }
      });

      // Add data of CascadeTable
      // cascadeDataValue = JSON.stringify({ dataVals: cascadeData });
      cascadeDataValue = cascadeData;
    }
  }

  // init new event
  let newFamilyEvent = {
    _isDirty: false,
    _isCloned: true,
    event: generateUid(),
    trackedEntityInstance: currentTei.trackedEntityInstance,
    orgUnit: selectedOrgUnit.id,
    program: programMetadata.id,
    programStage: "vY4mlqYfJEH",
    enrollment: currentEnrollment.enrollment,
    eventDate: `${year}-12-31`,
    dueDate: `${year}-12-31`,
    status: "ACTIVE",
    dataValues: payloadTransformed?.dataValues || [], // payloadTransformed.dataValues,
  };

  console.log({ newFamilyEvent });
  // yield call(dataApi.pushEvents, {
  //     events: [{ ...newEv, dataValues: payloadTransformed.dataValues }],
  // });

  try {
    // push newFamilyEvent
    // OFFLINE MODE
    if (offlineStatus) {
      // create new event of family - this is used for the new Family dont have any data.
      // for offline database - event need at least 1 dataValue in order to be saved
      if (newFamilyEvent.dataValues.length == 0) {
        // IDz3cuoy2Ix is a the chosen dataElement for this case
        newFamilyEvent.dataValues.push({
          dataElement: "IDz3cuoy2Ix",
          value: "",
          dontClear: true,
        });
      }

      yield call(eventManager.setEvents, { events: [newFamilyEvent] });
    } else {
      yield call(dataApi.pushEvents, {
        events: [newFamilyEvent],
      });
    }

    yield put(getTeiSuccessMessage(`Updated successfully`));
    // update newFamilyEvent to REDUX store
    yield put(updateEvents([...currentEvents, newFamilyEvent]));

    // Clone member events
    // get Members TEI
    const memberTEIsUid = cascadeDataValue
      ? cascadeDataValue.map((r) => r.id)
      : null;

    if (memberTEIsUid && memberTEIsUid.length > 0) {
      let memberTEIsEvents = null;

      if (offlineStatus) {
        memberTEIsEvents = yield call(
          trackedEntityInstanceManager.getTrackedEntityInstancesByIDs,
          {
            program: "xvzrp56zKvI",
            trackedEntityInstances: memberTEIsUid,
          }
        );
      } else {
        memberTEIsEvents = yield call(
          dataApi.getAllTrackedEntityInstancesByIDs,
          "xvzrp56zKvI",
          memberTEIsUid
        );
      }

      if (memberTEIsEvents) {
        const memberTEIsWithEvents = memberTEIsEvents
          ? memberTEIsEvents.trackedEntityInstances
          : [];

        let updatedMemberTeis = [];
        for (let cas of cascadeDataValue) {
          let aTEI = memberTEIsWithEvents.find(
            (e) => e.trackedEntityInstance == cas.id
          );

          let newEvent = {
            event: generateUid(),
            eventDate: newFamilyEvent.eventDate,
            dueDate: newFamilyEvent.eventDate,
            trackedEntityInstance: cas.id,
            status: newFamilyEvent.status,
          };

          let updatedMemberTei = yield generateTEIDhis2Payload(
            {
              family: currentTei,
              memberEnrollment: aTEI.enrollments[0],
              memberEvent: newEvent,
              memberDetails: cas,
            },
            programMetadataMember
          );

          updatedMemberTeis.push(updatedMemberTei);
        }

        // update to currentCascade
        let newCurrentCascade = {
          ...currentCascade,
          [year]: updatedMemberTeis.map((u) => u.memberDetails),
        };
        yield put(updateCascade(newCurrentCascade));

        // push member TEI and events
        let newMembersTEIPayload = updatedMemberTeis.map((u) => u.data);

        console.log("handleCloneEvent", newMembersTEIPayload);

        yield call(pushTEIs, newMembersTEIPayload);
      }
    }
  } catch (e) {
    console.error("handleCloneEventError", e.message);
    yield put(getTeiError(e.message));
  } finally {
    yield put(getTei());
    yield put(loadTei(false));
  }
}

function* pushTEIs(updatedMemberTeis) {
  const { offlineStatus } = yield select((state) => state.common);
  try {
    // OFFLINE MODE
    if (offlineStatus) {
      yield call(trackedEntityInstanceManager.setTrackedEntityInstances, {
        trackedEntityInstances: updatedMemberTeis,
      });
    } else {
      yield call(dataApi.postTrackedEntityInstance, {
        trackedEntityInstances: updatedMemberTeis,
      });
    }
  } catch (e) {
    console.error("pushTEIs", e.message);
    yield put(getTeiError(e.message));
  }
}

export default function* submitEvents() {
  yield takeLatest(SUBMIT_EVENT, handleSubmitEvent);
  yield takeLatest(SUBMIT_EVENTS, handleSubmitEvent);
  yield takeLatest(CLONE_EVENT, handleCloneEvent);
  yield takeLatest(UPDATE_EVENT_DATE, handleEditEventDate);
}
