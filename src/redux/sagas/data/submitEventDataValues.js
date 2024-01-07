import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SUBMIT_EVENT_DATA_VALUES } from '../../types/data/tei';
import { generateDhis2Payload } from '../../../utils';
import {
    generateTEIDhis2Payload,
    transformEvent,
    makeNewCurrentEvent,
    makeNewCurrentEvents,
} from './utils';
import { generateCode, generateCodes } from 'dhis2-uid';

import { dataApi } from '../../../api';
import {
    getTeiError,
    deleteTei,
    deleteMember,
    deleteEvent,
    getTeiSuccessMessage,
    loadTei,
} from '../../actions/data/tei';
import { updateEvents } from '../../actions/data/tei/currentEvent';
import { updateCascade } from '../../actions/data/tei/currentCascade';
import _ from 'lodash';
import moment from 'moment';

function* handleSubmitEventDataValues({ dataValues }) {
    yield put(loadTei(true));

    // metadata
    const { programMetadataMember } = yield select((state) => state.metadata);

    // data
    const { index, year } = yield select(
        (state) => state.data.tei.selectedYear
    );

    const { currentTei, currentEvents, currentCascade } = yield select(
        (state) => state.data.tei.data
    );
    const { selectedMember } = yield select((state) => state.data.tei);

    // get it form old code which is CASCADE_TABLE (core)
    // const { oC9jreyd9SD: cascadeByYear } = dataValues;

    const cascadeByYear = dataValues.oC9jreyd9SD
        ? JSON.parse(JSON.stringify(dataValues.oC9jreyd9SD))
        : null;

    // delete dataValues.oC9jreyd9SD;
    // const { currentEvents } = yield call(makePayload, dataValues);
    process.env.NODE_ENV && console.log({ dataValues });

    const newCurrentEvent = yield call(makeNewCurrentEvent, dataValues);
    const newCurrentEventPayload = yield call(
        makeNewCurrentEventPayload,
        dataValues
    );
    const newCurrentEvents = yield call(makeNewCurrentEvents, dataValues);

    process.env.NODE_ENV && console.log({ newCurrentEvent });
    process.env.NODE_ENV && console.log({ currentTei });
    process.env.NODE_ENV && console.log({ newCurrentEventPayload });
    process.env.NODE_ENV && console.log({ newCurrentEvents });
    process.env.NODE_ENV && console.log({ currentCascade });
    process.env.NODE_ENV && console.log({ cascadeByYear });

    try {
        // UPDATE remain dataValue not CascadeData
        yield call(dataApi.pushEvents, {
            events: [newCurrentEventPayload],
        });

        yield put(updateEvents(newCurrentEvents));

        // IF missing CASCADE data -> break
        if (!cascadeByYear) return;

        // Update cascade to REDUX store
        const newCurrentCascade = currentCascade
            ? JSON.parse(JSON.stringify(currentCascade))
            : {};
        newCurrentCascade[year] = cascadeByYear
            ? JSON.parse(cascadeByYear)?.dataVals
            : [];

        process.env.NODE_ENV && console.log({ newCurrentCascade });
        yield put(updateCascade(newCurrentCascade));

        // check wherether TEI is exist
        try {
            // get TEI of member details program | IF NOT -> catch errors
            const memberTEI = yield call(
                dataApi.getTrackedEntityInstanceById,
                selectedMember.id,
                programMetadataMember.id
            );
            process.env.NODE_ENV && console.log({ memberTEI });
            process.env.NODE_ENV && console.log({ selectedMember });

            // find ENR
            if (memberTEI) {
                // IF ENR exist
                if (memberTEI.enrollments.length > 0) {
                    // get event by current YEAR
                    let eventByYear = _.filter(
                        memberTEI.enrollments[0].events,
                        function (n) {
                            return moment(n.eventDate).isBetween(
                                `${year}-01-01`,
                                `${year}-12-31`,
                                undefined,
                                '[]'
                            );
                        }
                    );

                    process.env.NODE_ENV && console.log({ year, eventByYear });

                    if (selectedMember.isDelete) {
                        yield put(deleteMember({}));
                        return;
                    }

                    if (selectedMember.isNew || selectedMember.isUpdate) {
                        if (eventByYear.length > 0) {
                            // Generate member payload - UPDATE
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
                                console.log(
                                    'all TEI,ERN,EVENT exist',
                                    updatedMemberTei
                                );
                            yield call(pushTEI, updatedMemberTei);
                        } else {
                            // exist TEI but not events
                            // Generate member payload - UPDATE
                            let newEvent = {
                                event: generateCode(),
                                eventDate: newCurrentEvent.eventDate,
                                dueDate: newCurrentEvent.eventDate,
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
                                console.log('no EVENT', updatedMemberTei);
                            yield call(pushTEI, updatedMemberTei);
                        }
                    }
                } else {
                    let newEnrollment = {
                        enrollment: generateCode(),
                        enrollmentDate: newCurrentEvent.eventDate,
                        incidentDate: newCurrentEvent.eventDate,
                    };
                    let newEvent = {
                        event: generateCode(),
                        eventDate: newCurrentEvent.eventDate,
                        dueDate: newCurrentEvent.eventDate,
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
                    process.env.NODE_ENV &&
                        console.log('no ERN', updatedMemberTei);
                    yield call(pushTEI, updatedMemberTei);
                }
            }
            yield put(getTeiSuccessMessage(`Update successfully`));
        } catch (e) {
            // not exist TEI
            // CREATE whole new TEI
            if (selectedMember.isNew) {
                let newEnrollment = {
                    enrollment: generateCode(),
                    enrollmentDate: newCurrentEvent.eventDate,
                    incidentDate: newCurrentEvent.eventDate,
                };
                let newEvent = {
                    event: generateCode(),
                    eventDate: newCurrentEvent.eventDate,
                    dueDate: newCurrentEvent.eventDate,
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
                console.log('no TEI', updatedMemberTei);
                yield call(pushTEI, updatedMemberTei);
                yield put(getTeiSuccessMessage(`Created successfully`));
            }
        }
    } catch (e) {
        yield put(getTeiError(e.message));
    } finally {
        yield put(loadTei(false));
    }
}

function* pushTEI(updatedMemberTei) {
    try {
        // yield call(dataApi.postTrackedEntityInstance, updatedMemberTei.data);
        yield call(dataApi.postTrackedEntityInstance, {
            trackedEntityInstances: [updatedMemberTei.data],
        });
    } catch (e) {
        yield put(getTeiError(e.message));
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

function* getCurrentEvent() {
    const currentEvents = yield select(
        (state) => state.data.tei.data.currentEvents
    );
    const currentEventIndex = yield select(
        (state) => state.data.tei.selectedYear.index
    );
    return currentEvents[currentEventIndex];
}

export default function* submitAttributes() {
    yield takeLatest(SUBMIT_EVENT_DATA_VALUES, handleSubmitEventDataValues);
}
