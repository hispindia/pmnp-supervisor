import { put, select } from "redux-saga/effects";
import { convertValue } from "../../../../utils";
import { getTeiSuccess } from "../../../actions/data/tei";

function* handleInitData(trackedEntity) {
  const programStages = yield select((state) => state.metadata.programMetadata.programStages);

  const currentTei = trackedEntity;

  let currentEnrollment = null;
  // Safety check for enrollments array
  if (currentTei.enrollments && Array.isArray(currentTei.enrollments) && currentTei.enrollments.length > 0) {
    currentEnrollment = currentTei.enrollments[0];
  } else {
    currentEnrollment = [];
  }

  let currentEvents = null;
  // Safety check for events array
  if (currentEnrollment && currentEnrollment.events && Array.isArray(currentEnrollment.events)) {
    currentEvents = currentEnrollment.events;
  } else {
    currentEvents = [];
  }

  delete currentTei.enrollments;
  if (currentEnrollment) {
    delete currentEnrollment.events;
  }
  currentTei.isNew = false;
  currentTei.isDirty = false;
  currentTei.attributes = currentTei.attributes.reduce((previousValue, currentValue) => {
    previousValue[currentValue.attribute] = convertValue(currentValue.valueType, currentValue.value);
    return previousValue;
  }, {});

  // Process enrollment only if it exists
  if (currentEnrollment && Array.isArray(currentEnrollment) && currentEnrollment.length > 0) {
    currentEnrollment.enrolledAt = convertValue("DATE", currentEnrollment.enrolledAt);
    currentEnrollment.incidentDate = convertValue("DATE", currentEnrollment.incidentDate);
    currentEnrollment.isNew = false;
    currentEnrollment.isDirty = false;
  }

  // Process events only if they exist and are an array
  if (currentEvents && Array.isArray(currentEvents) && currentEvents.length > 0) {
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
  }

  console.log("handleInitData", { trackedEntity, currentEvents });

  yield put(
    getTeiSuccess({
      currentTei,
      currentEnrollment,
      currentEvents,
    }),
  );
}

export default handleInitData;
