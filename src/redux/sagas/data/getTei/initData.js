import { put, select } from 'redux-saga/effects';
import { convertValue } from '../../../../utils';
import { getTeiSuccess, changeFamily } from '../../../actions/data/tei';

import moment from 'moment';

function* handleInitData(trackedEntityInstance) {
    const programStages = yield select(
        (state) => state.metadata.programMetadata.programStages
    );
    const currentTei = trackedEntityInstance;
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
    currentEnrollment.enrollmentDate = convertValue(
        'DATE',
        currentEnrollment.enrollmentDate
    );
    currentEnrollment.incidentDate = convertValue(
        'DATE',
        currentEnrollment.incidentDate
    );
    currentEnrollment.isNew = false;
    currentEnrollment.isDirty = false;
    currentEvents.forEach((event) => {
        const programStage = programStages.find(
            (ps) => ps.id === event.programStage
        );
        if (!programStage) return;
        event.eventDate = convertValue('DATE', event.eventDate);
        event.dueDate = convertValue('DATE', event.dueDate);
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

    // currentEvents
    if (currentEvents.length > 0) {
        let index = currentEvents.length - 1;
        let eventDate = currentEvents[index].eventDate;
        const year = moment(eventDate).format('YYYY');
        yield put(changeFamily(index, year));
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
