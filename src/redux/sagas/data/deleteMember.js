import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import _ from "lodash";
import moment from "moment";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { dataApi } from "../../../api";
import {
  deleteEvent,
  deleteTei,
  getTeiErrorMessage,
} from "../../actions/data/tei";
import { DELETE_MEMBER } from "../../types/data/tei";

export default function* deleteMemberSaga() {
  yield takeEvery(DELETE_MEMBER, handleDeleteMember);
}

function* handleDeleteMember({ teiId }) {
  console.log("handleDeleteMember");
  const { offlineStatus } = yield select((state) => state.common);
  const { selectedMember } = yield select((state) => state.data.tei);
  // metadata
  const { programMetadataMember } = yield select((state) => state.metadata);
  // data
  const { year } = yield select((state) => state.data.tei.selectedYear);

  let memberTEI = null;

  if (offlineStatus) {
    memberTEI = yield call(trackedEntityManager.getTrackedEntityInstanceById, {
      trackedEntity: selectedMember.id,
      program: programMetadataMember.id,
    });
  } else {
    memberTEI = yield call(
      dataApi.getTrackedEntityInstanceById,
      selectedMember.id,
      programMetadataMember.id
    );
  }

  if (memberTEI && memberTEI.isOnline == 1) {
    yield put(getTeiErrorMessage("Can't delete Online data"));
    return;
  }

  // find ENR
  if (memberTEI) {
    // IF ENR exist
    if (memberTEI.enrollments.length > 0) {
      // only one event left -> delete TEI
      if (memberTEI.enrollments[0].events.length <= 1) {
        process.env.NODE_ENV &&
          console.log("only one event left -> delete TE1I", {
            memberTEI,
          });
        yield put(deleteTei(selectedMember.id));
        return;
      } else {
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
        process.env.NODE_ENV &&
          console.log("delete member eventByYear", eventByYear);

        // check if event of selected year is exist
        if (eventByYear.length > 0) {
          // DELETE
          if (selectedMember.isDelete) {
            process.env.NODE_ENV &&
              console.log("eventByYear[0]", eventByYear[0]);
            yield put(deleteEvent(eventByYear[0].event));
            return;
          }
        }
      }
    }
  }
}
