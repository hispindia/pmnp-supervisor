import { HOUSEHOLD_DATA_COLLECTOR_ATTR_ID, HOUSEHOLD_ID_ATTR_ID } from "@/constants/app-config";
import { getOrganisationUnitById } from "@/utils/organisation";
import moment from "moment";
import { put, select } from "redux-saga/effects";
import { generateUid } from "../../../../utils";
import { getTeiSuccess } from "../../../actions/data/tei";
import { getParentOuPatern } from "./setParentPattern";

function* handleInitNewData() {
  yield getParentOuPatern();

  const {
    selectedOrgUnit: { id: orgUnitId },
    programMetadata: { id: program, trackedEntityType },
    orgUnits,
  } = yield select((state) => state.metadata);

  const { ouPattern } = yield select((state) => state.data.tei);
  const me = yield select((state) => state.me);

  const generatedTeiId = generateUid();
  const generatedEnrollmentId = generateUid();

  const selectedOrgUnit = getOrganisationUnitById(orgUnitId, orgUnits);

  const { code } = selectedOrgUnit;

  const currentTei = {
    trackedEntity: generatedTeiId,
    orgUnit: orgUnitId,
    isDirty: false,
    isNew: true,
    isSaved: false,
    trackedEntityType,
    attributes: {
      BUEzQEErqa7: moment().format("YYYY"),
      [HOUSEHOLD_ID_ATTR_ID]: ouPattern,
      eMYBznRdn0t: code,
      [HOUSEHOLD_DATA_COLLECTOR_ATTR_ID]: me ? me.username : "",
    },
  };
  const currentEnrollment = {
    enrollment: generatedEnrollmentId,
    orgUnit: orgUnitId,
    program,
    isDirty: false,
    isNew: true,
    trackedEntity: generatedTeiId,
  };

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
