import { put, select } from "redux-saga/effects";
import { convertValue } from "../../../../utils";
import { getTeiSuccess } from "../../../actions/data/tei";

function* handleInitData(trackedEntity) {
  const programStages = yield select((state) => state.metadata.programMetadata.programStages);

  const currentTei = trackedEntity;
  const currentEnrollment = currentTei.enrollments[0];
  const currentEvents = currentTei.enrollments[0].events;

  delete currentTei.enrollments;
  delete currentEnrollment.events;
  currentTei.isNew = false;
  currentTei.isDirty = false;
  currentTei.attributes = currentTei.attributes.reduce((previousValue, currentValue) => {
    previousValue[currentValue.attribute] = convertValue(currentValue.valueType, currentValue.value);
    return previousValue;
  }, {});
  currentEnrollment.enrolledAt = convertValue("DATE", currentEnrollment.enrolledAt);
  currentEnrollment.incidentDate = convertValue("DATE", currentEnrollment.incidentDate);
  currentEnrollment.isNew = false;
  currentEnrollment.isDirty = false;
  currentEvents.forEach((event) => {
    const programStage = programStages.find((ps) => ps.id === event.programStage);
    if (!programStage) return;
    event.occurredAt = convertValue("DATE", event.occurredAt);
    event.dueDate = convertValue("DATE", event.dueDate);
    event.isNew = false;
    event.isDirty = false;
    event.dataValues = event.dataValues.reduce((previousValue, currentValue) => {
      const foundDe = programStage.dataElements.find((de) => de.id === currentValue.dataElement);
      if (!foundDe) return previousValue;
      previousValue[currentValue.dataElement] = convertValue(foundDe.valueType, currentValue.value);
      return previousValue;
    }, {});
  });

  // Sort events by occurredAt
  currentEvents.sort((a, b) => {
    return new Date(a.occurredAt) - new Date(b.occurredAt);
  });

  console.log("handleInitData", { trackedEntity, currentEvents });

  yield put(
    getTeiSuccess({
      currentTei,
      currentEnrollment,
      currentEvents,
    })
  );
}

export default handleInitData;

// export default function* initData() {
//   yield takeLatest(INIT_DATA, handleInitData);
// }
