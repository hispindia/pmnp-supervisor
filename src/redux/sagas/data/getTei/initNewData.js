import { put, select } from "redux-saga/effects";
import { generateUid } from "../../../../utils";
import { getTeiSuccess } from "../../../actions/data/tei";
import moment from "moment";

function* handleInitNewData() {
  const {
    selectedOrgUnit: { id: orgUnit },
    programMetadata: { id: program, trackedEntityType, programStages },
  } = yield select((state) => state.metadata);
  const generatedTeiId = generateUid();
  const generatedEnrollmentId = generateUid();
  const currentTei = {
    trackedEntity: generatedTeiId,
    orgUnit,
    isDirty: false,
    isNew: true,
    isSaved: false,
    trackedEntityType,
    attributes: {
      // BUEzQEErqa7: moment().subtract(1, "y").format("YYYY"),
      BUEzQEErqa7: moment().format("YYYY"),
    },
  };
  const currentEnrollment = {
    enrollment: generatedEnrollmentId,
    orgUnit,
    program,
    isDirty: false,
    isNew: true,
    trackedEntity: generatedTeiId,
  };
  // const currentEvents = programStages.map((ps) => {
  //     return {
  //         event: generateUid(),
  //         orgUnit,
  //         programStage: ps.id,
  //         program,
  //         isDirty: false,
  //         isNew: true,
  //         trackedEntity: generatedTeiId,
  //         enrollment: generatedEnrollmentId,
  //         dataValues: {},
  //     };
  // });
  const currentEvents = [];
  yield put(
    getTeiSuccess({
      currentTei,
      currentEnrollment,
      currentEvents,
    })
  );
}

export default handleInitNewData;

// export default function* mutateTei() {
//   yield takeLatest(INIT_NEW_DATA, handleInitNewData);
// }
