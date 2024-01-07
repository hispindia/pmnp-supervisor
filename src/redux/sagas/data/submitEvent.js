import {
    takeEvery,
    select,
    call,
    put,
    takeLatest,
    all,
} from 'redux-saga/effects';
import {
    SUBMIT_EVENTS,
    CLONE_EVENT,
    UPDATE_EVENT_DATE,
} from '../../types/data/tei';
import {
    transformEvent,
    getCurrentEvent,
    getHeaderIndexes,
    generateTEIDhis2Payload,
} from './utils';
import { dataApi } from '../../../api';

import {
    getTeiError,
    getTeiSuccessMessage,
    getTei,
    loadTei,
} from '../../actions/data/tei';
import { updateEvents } from '../../actions/data/tei/currentEvent';
import { updateCascade } from '../../actions/data/tei/currentCascade';
import { changeFamily } from '../../actions/data/tei';

import { generateCode } from 'dhis2-uid';
import moment from 'moment';

import {
    getTeis,
    getTeisErrorMessage,
    getTeisSuccessMessage,
} from '../../actions/teis';

const teiMapping = {
    firstname: 'IEE2BMhfoSc',
    lastname: 'IBLkiaYRRL3',
    sex: 'DmuazFb368B',
    ethnicity: 'tJrT8GIy477',
    birthyear: 'bIzDI9HJCB0',
    age: 'BaiVwt8jVfg',
    nationality: 'NLth2WTyo7M',
    status: 'tASKWHyRolc',
    agetype: 'ck9h7CokxQE',
    DOB: 'tQeFLjYbqzv',
};

function* handleSubmitEvent({ event }) {
    try {
        //  PUSH EVENTS

        yield call(dataApi.pushEvents, { events: [event] });
    } catch (e) {
        console.log(e);
    } finally {
    }
}

function* handleEditEventDate({ year }) {
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
        console.error('test e', e);
        yield put(getTeiError(e.message));
    }
    yield put(loadTei(false));
}

function* handleCloneEvent({ year }) {
    yield put(loadTei(true));
    const {
        currentEvents,
        currentTei,
        currentEnrollment,
        currentCascade,
    } = yield select((state) => state.data.tei.data);

    const {
        selectedOrgUnit,
        programMetadata,
        programMetadataMember,
    } = yield select((state) => state.metadata);

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
                (e) => e['status'] != 'dead' && e['status'] != 'transfer-out'
            );

            cascadeData.forEach((e) => {
                if (e['age'] != '' && e['agetype'] == 'age') {
                    e['age'] = parseInt(e['age']) + 1 + '';
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
        event: generateCode(),
        trackedEntityInstance: currentTei.trackedEntityInstance,
        orgUnit: selectedOrgUnit.id,
        program: programMetadata.id,
        programStage: 'vY4mlqYfJEH',
        enrollment: currentEnrollment.enrollment,
        eventDate: `${year}-12-31`,
        dueDate: `${year}-12-31`,
        status: 'ACTIVE',
        dataValues: payloadTransformed?.dataValues || [], // payloadTransformed.dataValues,
    };

    // yield call(dataApi.pushEvents, {
    //     events: [{ ...newEv, dataValues: payloadTransformed.dataValues }],
    // });

    try {
        // push newFamilyEvent
        yield call(dataApi.pushEvents, {
            events: [newFamilyEvent],
        });
        yield put(getTeiSuccessMessage(`Updated successfully`));
        // update newFamilyEvent to REDUX store
        yield put(updateEvents([...currentEvents, newFamilyEvent]));

        // Clone member events
        // get Members TEI
        const memberTEIsUid = cascadeDataValue
            ? cascadeDataValue.map((r) => r.id)
            : null;

        if (memberTEIsUid && memberTEIsUid.length > 0) {
            let memberTEIsEvents = yield call(
                dataApi.getAllTrackedEntityInstancesByIDs,
                'xvzrp56zKvI',
                memberTEIsUid
            );

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
                        event: generateCode(),
                        eventDate: newFamilyEvent.eventDate,
                        dueDate: newFamilyEvent.eventDate,
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

                yield call(pushTEIs, newMembersTEIPayload);
            }
        }
    } catch (e) {
        yield put(getTeiError(e.message));
    } finally {
        yield put(getTei());
        yield put(loadTei(false));
    }
}

function* pushTEIs(updatedMemberTeis) {
    try {
        yield call(dataApi.postTrackedEntityInstance, {
            trackedEntityInstances: updatedMemberTeis,
        });
    } catch (e) {
        console.log(e);
        yield put(getTeiError(e.message));
    }
}

export default function* submitEvents() {
    yield takeLatest(SUBMIT_EVENTS, handleSubmitEvent);
    yield takeLatest(CLONE_EVENT, handleCloneEvent);
    yield takeLatest(UPDATE_EVENT_DATE, handleEditEventDate);
}
