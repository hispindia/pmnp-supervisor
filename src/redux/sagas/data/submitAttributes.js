import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SUBMIT_ATTRIBUTES } from '../../types/data/tei';
import { generateDhis2Payload } from '../../../utils';
import { dataApi } from '../../../api';
import {
    mutateAttributes,
    updateNewStatus,
} from '../../actions/data/tei/currentTei';
import {
    getTeiError,
    getTeiSuccessMessage,
    loadTei,
} from '../../actions/data/tei';
import { editingAttributes } from '../../actions/data';
import { getTeiId } from './utils';
import moment from 'moment';
import { push } from 'connected-react-router';

function* handleSubmitAttributes({ attributes }) {
    yield put(loadTei(true));

    const teiId = yield call(getTeiId);
    const { currentTei, currentEnrollment } = yield call(
        makePayload,
        attributes
    );
    try {
        if (teiId) {
            yield call(putTeiToServer, {
                currentTei,
                currentEnrollment,
                attributes,
            });
            yield put(
                getTeiSuccessMessage(
                    `Updated tracked entity instance: ${teiId} successfully`
                )
            );
        } else {
            yield call(postTeiToServer, {
                currentTei,
                currentEnrollment,
                attributes,
            });
            yield put(
                getTeiSuccessMessage(
                    `Created new tracked entity instance: ${currentTei.trackedEntityInstance} successfully`
                )
            );
        }
        yield put(mutateAttributes(attributes));
        yield put(updateNewStatus(false));
        yield put(editingAttributes(false));
    } catch (e) {
        console.error('test e', e);
        yield put(getTeiError(e.message));
    }

    yield put(loadTei(false));
}

function* makePayload(attributes) {
    const data = yield select((state) => state.data.tei.data);
    const programMetadata = yield select(
        (state) => state.metadata.programMetadata
    );
    const newCurrentTei = { ...data.currentTei, attributes };
    const { currentTei, currentEnrollment } = generateDhis2Payload(
        { ...data, currentTei: newCurrentTei },
        programMetadata
    );
    return {
        currentTei,
        currentEnrollment,
    };
}

function* putTeiToServer({ currentTei, currentEnrollment, attributes }) {
    const programMetadataId = yield select(
        (state) => state.metadata.programMetadata.id
    );
    yield call(dataApi.putTrackedEntityInstance, currentTei, programMetadataId);
}

function* postTeiToServer({ currentTei, currentEnrollment, attributes }) {
    const programMetadataId = yield select(
        (state) => state.metadata.programMetadata.id
    );
    const newEnrollment = {
        ...currentEnrollment,
        enrollmentDate: moment([+attributes.BUEzQEErqa7, 11, 31]).format(
            'YYYY-MM-DD'
        ),
        incidentDate: moment([+attributes.BUEzQEErqa7, 11, 31]).format(
            'YYYY-MM-DD'
        ),
    };
    yield call(
        dataApi.pushTrackedEntityInstance,
        currentTei,
        programMetadataId
    );
    yield call(dataApi.pushEnrollment, newEnrollment, programMetadataId);
    yield put(push(`/form?tei=${currentTei.trackedEntityInstance}`));
}

export default function* submitAttributes() {
    yield takeLatest(SUBMIT_ATTRIBUTES, handleSubmitAttributes);
}
