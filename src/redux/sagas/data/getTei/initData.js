import { put, select } from "redux-saga/effects";
import { convertValue } from "../../../../utils";
import { getTeiSuccess, changeEventFamily } from "../../../actions/data/tei";

import moment from "moment";

function* handleInitData(trackedEntity) {
  console.log("handleInitData", { trackedEntity });
  const programStages = yield select(
    (state) => state.metadata.programMetadata.programStages
  );

  const selected6Month = yield select(
    (state) => state.data.tei.selectedYear.selected6Month
  );

  // selected year
  const { index: selectedIndex, year: selectedYear } = yield select(
    (state) => state.data.tei.selectedYear
  );

  const currentTei = trackedEntity;
  const currentEnrollment = currentTei.enrollments[0];
  const currentEvents = currentTei.enrollments[0].events;

  delete currentTei.enrollments;
  delete currentEnrollment.events;
  currentTei.isNew = false;
  currentTei.isDirty = false;
  currentTei.attributes = currentTei.attributes.reduce(
    (previousValue, currentValue) => {
      previousValue[currentValue.attribute] = convertValue(
        currentValue.valueType,
        currentValue.value
      );
      return previousValue;
    },
    {}
  );
  currentEnrollment.enrolledAt = convertValue(
    "DATE",
    currentEnrollment.enrolledAt
  );
  currentEnrollment.incidentDate = convertValue(
    "DATE",
    currentEnrollment.incidentDate
  );
  currentEnrollment.isNew = false;
  currentEnrollment.isDirty = false;
  currentEvents.forEach((event) => {
    const programStage = programStages.find(
      (ps) => ps.id === event.programStage
    );
    if (!programStage) return;
    event.occurredAt = convertValue("DATE", event.occurredAt);
    event.dueDate = convertValue("DATE", event.dueDate);
    event.isNew = false;
    event.isDirty = false;
    event.dataValues = event.dataValues.reduce(
      (previousValue, currentValue) => {
        const foundDe = programStage.dataElements.find(
          (de) => de.id === currentValue.dataElement
        );
        if (!foundDe) return previousValue;
        previousValue[currentValue.dataElement] = convertValue(
          foundDe.valueType,
          currentValue.value
        );
        return previousValue;
      },
      {}
    );
  });

  // Sort events by occurredAt
  currentEvents.sort((a, b) => {
    return new Date(a.occurredAt) - new Date(b.occurredAt);
  });

  console.log("handleInitData", currentEvents);

  // currentEvents
  if (currentEvents.length > 0) {
    const currentAvailableYears = currentEvents.map((event) =>
      moment(event.occurredAt).format("YYYY")
    );
    const isYearSelected =
      selectedIndex !== -1 && selectedYear !== null && selected6Month !== null;

    // Set default selected year when no year is selected
    if (!isYearSelected || !currentAvailableYears.includes(selectedYear)) {
      let index = currentEvents.length - 1;
      let occurredAt = currentEvents[index].occurredAt;
      const eventYear = moment(occurredAt).format("YYYY");

      yield put(changeEventFamily(index, eventYear, selected6Month));
    }
  }

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
