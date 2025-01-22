import { generateUid } from "@/utils";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { getTei } from "../../../redux/actions/data/tei";
import { SUBMIT_EVENT_DATA_VALUES } from "../../types/data/tei";
import {
  generateTEIDhis2Payload,
  makeNewCurrentEvent,
  makeNewCurrentEvents,
  transformEvent,
} from "./utils";

import { submitAttributes as submitFamilyTeiAttributes } from "../../actions/data";

import _ from "lodash";
import moment from "moment";
import { dataApi } from "@/api";
import {
  deleteMember,
  getTeiError,
  getTeiSuccessMessage,
  loadTei,
} from "../../actions/data/tei";
import { updateCascade } from "../../actions/data/tei/currentCascade";
import { updateEvents } from "../../actions/data/tei/currentEvent";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import { getEventsByYear } from "@/utils/event";

function* handleSubmitEventDataValues({ dataValues }) {
  console.log("handleSubmitEventDataValues", { dataValues });

  // Trick - clear oC9jreyd9SD to be able to submit new data
  delete dataValues.oC9jreyd9SD;

  const { offlineStatus } = yield select((state) => state.common);

  yield put(loadTei(true));

  // metadata
  const { programMetadataMember } = yield select((state) => state.metadata);

  // data
  const { year, selected6Month } = yield select(
    (state) => state.data.tei.selectedYear
  );

  const { currentTei, currentCascade } = yield select(
    (state) => state.data.tei.data
  );
  const { selectedMember } = yield select((state) => state.data.tei);
  // const selectedMemberData = yield call(getSelectedMemberData);

  process.env.NODE_ENV && console.log({ dataValues });
  process.env.NODE_ENV && console.log({ selectedMember });
  process.env.NODE_ENV && console.log("selectedYear", { year, selected6Month });

  const newCurrentEvent = yield call(makeNewCurrentEvent, dataValues);
  const newCurrentEventPayload = yield call(
    makeNewCurrentEventPayload,
    dataValues
  );

  const newCurrentEvents = yield call(makeNewCurrentEvents, dataValues);
  const newCurrentEventsByYear = getEventsByYear(newCurrentEvents, year);
  const newCurrentEventsPayload = yield call(
    makeNewCurrentEventsPayload,
    newCurrentEventsByYear
  );

  process.env.NODE_ENV && console.log({ currentTei });
  process.env.NODE_ENV && console.log({ newCurrentEvent });
  process.env.NODE_ENV && console.log({ newCurrentEventPayload });
  process.env.NODE_ENV && console.log({ newCurrentEventsPayload });
  process.env.NODE_ENV && console.log({ newCurrentEvents });
  process.env.NODE_ENV && console.log({ currentCascade });

  try {
    // UPDATE remain dataValue not CascadeData
    // OFFLINE MODE
    if (offlineStatus) {
      yield call(eventManager.setEvents, {
        events: newCurrentEventsPayload,
      });
    } else {
      yield call(dataApi.pushEvents, {
        events: newCurrentEventsPayload,
      });
    }

    yield put(updateEvents(newCurrentEvents));

    // // IF missing CASCADE data -> break
    // if (!currentCascade) return;

    // Update cascade to REDUX store
    const newCurrentCascade = currentCascade
      ? JSON.parse(JSON.stringify(currentCascade))
      : {};

    process.env.NODE_ENV && console.log({ newCurrentCascade });
    yield put(updateCascade(newCurrentCascade));

    // check wherether TEI is exist
    try {
      // get TEI of member details program | IF NOT -> catch errors
      // OFFLINE MODE
      let memberTEI = {};
      if (offlineStatus) {
        memberTEI = yield call(
          trackedEntityManager.getTrackedEntityInstanceById,
          {
            trackedEntity: selectedMember.id,
            program: programMetadataMember.id,
          }
        );
      } else {
        // In Online mode - if cannot find TEI -> catch errors
        memberTEI = yield call(
          dataApi.getTrackedEntityInstanceById,
          selectedMember.id,
          programMetadataMember.id
        );
      }

      process.env.NODE_ENV && console.log({ memberTEI, selectedMember });

      // find ENR
      if (memberTEI) {
        // IF ENR exist
        if (memberTEI.enrollments.length > 0) {
          // get event by current YEAR
          let eventByYear = _.filter(
            memberTEI.enrollments[0].events,
            function (n) {
              return moment(n.occurredAt).isBetween(
                `${year}-01-01`,
                `${year}-12-31`,
                undefined,
                "[]"
              );
            }
          );

          process.env.NODE_ENV && console.log({ year, eventByYear });

          if (selectedMember.isDelete) {
            yield put(deleteMember({}));

            return;
          }
          process.env.NODE_ENV && console.log({ selectedMember });

          if (selectedMember.isNew || selectedMember.isUpdate) {
            process.env.NODE_ENV && console.log({ eventByYear });

            // Update Family TEI - firstname + lastname
            if (selectedMember && selectedMember.relation == "head") {
              const newFamilyAttributes = {
                ...currentTei.attributes,
                IEE2BMhfoSc: selectedMember.firstname,
                IBLkiaYRRL3: selectedMember.lastname,
              };

              yield put(submitFamilyTeiAttributes(newFamilyAttributes));
            }

            if (eventByYear.length > 0) {
              // Generate member payload - UPDATE
              try {
                let updatedMemberTei = yield call(
                  generateTEIDhis2Payload,
                  {
                    family: currentTei,
                    memberEnrollment: memberTEI.enrollments[0],
                    memberEvent: eventByYear[0],
                    memberDetails: selectedMember,
                  },
                  programMetadataMember
                );
                process.env.NODE_ENV &&
                  console.log("all TEI,ERN,EVENT exist", updatedMemberTei);
                yield call(pushTEI, updatedMemberTei);
              } catch (error) {
                console.log("all TEI,ERN,EVENT exist", error);
              }
            } else {
              // exist TEI but not events
              // Generate member payload - UPDATE
              try {
                let newEvent = {
                  event: generateUid(),
                  occurredAt: newCurrentEvent.occurredAt,
                  dueDate: newCurrentEvent.occurredAt,
                };

                // Generate member payload - UPDATE
                let updatedMemberTei = yield call(
                  generateTEIDhis2Payload,
                  {
                    family: currentTei,
                    memberEnrollment: memberTEI.enrollments[0],
                    memberEvent: newEvent,
                    memberDetails: selectedMember,
                  },
                  programMetadataMember
                );
                process.env.NODE_ENV &&
                  console.log("no EVENT", updatedMemberTei);
                yield call(pushTEI, updatedMemberTei);
              } catch (error) {
                console.log("no EVENT", error);
              }
            }
          }
        } else {
          try {
            let newEnrollment = {
              enrollment: generateUid(),
              enrolledAt: newCurrentEvent.occurredAt,
              incidentDate: newCurrentEvent.occurredAt,
            };
            let newEvent = {
              event: generateUid(),
              occurredAt: newCurrentEvent.occurredAt,
              dueDate: newCurrentEvent.occurredAt,
            };

            // Generate member payload - UPDATE
            let updatedMemberTei = yield call(
              generateTEIDhis2Payload,
              {
                family: currentTei,
                memberEnrollment: newEnrollment,
                memberEvent: newEvent,
                memberDetails: selectedMember,
              },
              programMetadataMember
            );
            process.env.NODE_ENV && console.log("no ERN", updatedMemberTei);
            yield call(pushTEI, updatedMemberTei);
          } catch (error) {
            console.log("no ERN", error);
          }
        }
      } else {
        // In Offline mode - if cannot find TEI -> catch errors
        throw new Error("TEI not exist");
      }
      yield put(getTeiSuccessMessage(`Update successfully`));
    } catch (e) {
      // not exist TEI
      // CREATE whole new TEI
      if (selectedMember.isNew) {
        // Update Family TEI - firstname + lastname
        if (selectedMember && selectedMember.relation == "head") {
          const newFamilyAttributes = {
            ...currentTei.attributes,
            IEE2BMhfoSc: selectedMember.firstname,
            IBLkiaYRRL3: selectedMember.lastname,
          };

          yield put(submitFamilyTeiAttributes(newFamilyAttributes));
        }

        try {
          let newEnrollment = {
            enrollment: generateUid(),
            enrolledAt: newCurrentEvent.occurredAt,
            incidentDate: newCurrentEvent.occurredAt,
          };
          let newEvent = {
            event: generateUid(),
            occurredAt: newCurrentEvent.occurredAt,
            dueDate: newCurrentEvent.occurredAt,
          };

          // Generate member payload - UPDATE
          let updatedMemberTei = yield call(
            generateTEIDhis2Payload,
            {
              family: currentTei,
              memberEnrollment: newEnrollment,
              memberEvent: newEvent,
              memberDetails: selectedMember,
            },
            programMetadataMember
          );
          console.log("no TEI", updatedMemberTei);
          yield call(pushTEI, updatedMemberTei);
          // yield put(getTeiSuccessMessage(`Created successfully`));
        } catch (error) {
          console.log("no TEI", error);
        }
      }
    }
  } catch (e) {
    console.error("handleSubmitEventDataValues", e.message);
    yield put(getTeiError(e.message));
  } finally {
    // refresh TEI
    yield put(getTei(currentTei.trackedEntity));
    yield put(loadTei(false));
  }
}

function* pushTEI(updatedMemberTei) {
  console.log("pushTEI", updatedMemberTei.data);
  const { offlineStatus } = yield select((state) => state.common);
  let pushTie;
  try {
    // OFFLINE MODE
    if (offlineStatus) {
      pushTie=  yield call(trackedEntityManager.setTrackedEntityInstance, {
        trackedEntity: updatedMemberTei.data,
      });
    } else {
      pushTie=  yield call(dataApi.postTrackedEntityInstances, {
        trackedEntities: [updatedMemberTei.data],
      });
    }
    yield put(getTeiSuccessMessage(`Created successfully`));
  } catch (e) {
    // console.log('pushTie :>> ', pushTie);
    console.error("pushTEI", e);
    yield put(getTeiError('Data submission failed'));
  }
}

function* makeNewCurrentEventPayload(dataValues) {
  const newCurrentEvent = yield call(makeNewCurrentEvent, dataValues);
  let payloadTransformed = yield call(transformEvent, {
    dataValues: { ...newCurrentEvent.dataValues },
  });
  return {
    ...newCurrentEvent,
    dataValues: payloadTransformed.dataValues,
  };
}

function* getSelectedMemberData() {
  const { selectedMember } = yield select((state) => state.data.tei);
  const { currentCascade } = yield select((state) => state.data.tei.data);
  const { year } = yield select((state) => state.data.tei.selectedYear);

  let selectedMemberData = null;

  if (
    currentCascade &&
    currentCascade[year] &&
    currentCascade[year].length > 0
  ) {
    selectedMemberData = currentCascade[year].find(
      (m) => m.id === selectedMember.id
    );
  }

  return selectedMemberData;
}

function* makeNewCurrentEventsPayload(currentEvents) {
  const { year } = yield select((state) => state.data.tei.selectedYear);
  let eventsByYear = getEventsByYear(currentEvents, year);

  let transformedEvents = [];
  for (let event of eventsByYear) {
    let payloadTransformed = yield call(transformEvent, {
      dataValues: { ...event.dataValues },
    });

    transformedEvents.push({
      ...event,
      dataValues: payloadTransformed.dataValues,
    });
  }

  return transformedEvents;
}

export default function* submitAttributes() {
  yield takeLatest(SUBMIT_EVENT_DATA_VALUES, handleSubmitEventDataValues);
}
