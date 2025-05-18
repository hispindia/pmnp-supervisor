import { generateUid } from "@/utils";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { getTei } from "../../../redux/actions/data/tei";
import { SUBMIT_EVENT_DATA_VALUES } from "../../types/data/tei";
import { generateTEIDhis2Payload } from "./utils";

import { dataApi } from "@/api";
import { MEMBER_FIRST_NAME_ATTRIBUTE_ID, MEMBER_LAST_NAME_ATTRIBUTE_ID } from "@/constants/app-config";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import { isHeadOfHousehold } from "@/utils/member";
import { deleteMember, getTeiError, getTeiSuccessMessage, loadTei } from "../../actions/data/tei";
import { updateCascade } from "../../actions/data/tei/currentCascade";
import { handleSubmitAttributes } from "./submitAttributes";

function* handleSubmitEventDataValues({ dataValues }) {
  console.log("handleSubmitEventDataValues", { dataValues });

  // Trick - clear oC9jreyd9SD to be able to submit new data
  delete dataValues.oC9jreyd9SD;

  const { offlineStatus } = yield select((state) => state.common);

  yield put(loadTei(true));

  // metadata
  const { programMetadataMember } = yield select((state) => state.metadata);

  const { currentTei, currentCascade } = yield select((state) => state.data.tei.data);
  const { selectedMember } = yield select((state) => state.data.tei);

  process.env.NODE_ENV && console.log({ selectedMember });
  process.env.NODE_ENV && console.log({ currentTei });
  process.env.NODE_ENV && console.log({ currentCascade });

  try {
    // UPDATE remain dataValue not CascadeData
    // OFFLINE MODE
    // if (offlineStatus) {
    //   yield call(eventManager.setEvents, {
    //     events: newCurrentEventsPayload,
    //   });
    // } else {
    //   yield call(dataApi.pushEvents, {
    //     events: newCurrentEventsPayload,
    //   });
    // }

    // yield put(updateEvents(newCurrentEvents));

    // // IF missing CASCADE data -> break
    // if (!currentCascade) return;

    // Update cascade to REDUX store
    const newCurrentCascade = currentCascade ? JSON.parse(JSON.stringify(currentCascade)) : {};

    process.env.NODE_ENV && console.log({ newCurrentCascade });
    yield put(updateCascade(newCurrentCascade));

    // check wherether TEI is exist
    try {
      // get TEI of member details program | IF NOT -> catch errors
      // OFFLINE MODE
      let memberTEI = {};
      if (offlineStatus) {
        memberTEI = yield call(trackedEntityManager.getTrackedEntityInstanceById, {
          trackedEntity: selectedMember.id,
          program: programMetadataMember.id,
        });
      } else {
        // In Online mode - if cannot find TEI -> catch errors
        memberTEI = yield call(dataApi.getTrackedEntityInstanceById, selectedMember.id, programMetadataMember.id);
      }

      process.env.NODE_ENV && console.log({ memberTEI, selectedMember });

      // find ENR
      if (memberTEI) {
        // IF ENR exist
        if (memberTEI.enrollments.length > 0) {
          if (selectedMember.isDelete) {
            yield put(deleteMember({}));

            return;
          }
          process.env.NODE_ENV && console.log({ selectedMember });

          if (selectedMember.isNew || selectedMember.isUpdate) {
            // Generate member payload - UPDATE
            try {
              let updatedMemberTei = yield call(
                generateTEIDhis2Payload,
                {
                  family: currentTei,
                  memberEnrollment: null,
                  memberDetails: selectedMember,
                },
                programMetadataMember
              );
              process.env.NODE_ENV && console.log("all TEI,ERN exist", updatedMemberTei);
              yield call(pushTEI, updatedMemberTei);
            } catch (error) {
              console.log("all TEI,ERN exist", error);
            }
          }
        } else {
          try {
            let newEnrollment = {
              enrollment: generateUid(),
            };

            // Generate member payload - UPDATE
            let updatedMemberTei = yield call(
              generateTEIDhis2Payload,
              {
                family: currentTei,
                memberEnrollment: newEnrollment,
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
        try {
          let newEnrollment = {
            enrollment: generateUid(),
            enrolledAt: new Date().toISOString(),
          };

          // Generate member payload - UPDATE
          let updatedMemberTei = yield call(
            generateTEIDhis2Payload,
            {
              family: currentTei,
              memberEnrollment: newEnrollment,
              memberDetails: selectedMember,
            },
            programMetadataMember
          );
          console.log("no TEI", updatedMemberTei);
          yield call(pushTEI, updatedMemberTei);
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
  const { attributes } = yield select((state) => state.data.tei.data.currentTei);
  const { selectedMember } = yield select((state) => state.data.tei);

  let pushTie;
  try {
    // OFFLINE MODE
    if (offlineStatus) {
      pushTie = yield call(trackedEntityManager.setTrackedEntityInstance, {
        trackedEntity: updatedMemberTei.data,
      });
    } else {
      pushTie = yield call(dataApi.postTrackedEntityInstances, {
        trackedEntities: [updatedMemberTei.data],
      });
    }

    if (isHeadOfHousehold(selectedMember)) {
      const fullName = `${selectedMember[MEMBER_FIRST_NAME_ATTRIBUTE_ID]} ${selectedMember[MEMBER_LAST_NAME_ATTRIBUTE_ID]}`;

      yield call(handleSubmitAttributes, { attributes: { ...attributes, GXs8SDJL19y: fullName } });
    }

    yield put(getTeiSuccessMessage(`Created successfully`));
  } catch (e) {
    // console.log('pushTie :>> ', pushTie);
    console.error("pushTEI", e);
    yield put(getTeiError("Data submission failed"));
  }
}

export default function* submitEventDataValues() {
  yield takeLatest(SUBMIT_EVENT_DATA_VALUES, handleSubmitEventDataValues);
}
