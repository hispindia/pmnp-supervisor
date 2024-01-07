import { call, put, select, takeLatest } from 'redux-saga/effects';
import { GET_TEI } from '../../../types/data/tei';
import { editingAttributes } from '../../../actions/data';
import { dataApi } from '../../../../api';
import {
    getTeiError,
    getTeiSuccessMessage,
    loadTei,
} from '../../../actions/data/tei';
import { getSelectedOrgUnitByOuId, getTeiId, getHeaderIndexes } from '../utils';
import handleInitData from './initData';
import handleInitNewData from './initNewData';
import handleInitCascadeData from './initCascadeData';
import { setSelectedOrgUnit } from '../../../actions/metadata';
import { push } from 'connected-react-router';

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

const eventMapping = {
    relation: 'u0Ke4EXsIKZ',
    education: 'Z9a4Vim1cuJ',
    insurance: 'vbBhehiwNLV',
    maritalstatus: 'xXybyxfggiE',
};

function* handleGetTei() {
    yield put(loadTei(true));
    try {
        const teiId = yield call(getTeiId);
        if (teiId) {
            yield call(initExistedDataSaga, teiId);
            yield put(
                getTeiSuccessMessage(`Get tracked entity instance: ${teiId}`)
            );
        } else {
            const selectedOu = yield select(
                (state) => state.metadata.selectedOrgUnit
            );
            if (!selectedOu) {
                return yield put(push('/'));
            }
            yield call(initNewDataSaga);
            yield put(getTeiSuccessMessage(`Open add new family form`));
        }
    } catch (e) {
        yield put(getTeiError(e.message));
    } finally {
        yield put(loadTei(false));
    }
}

export default function* getTei() {
    yield takeLatest(GET_TEI, handleGetTei);
}

function* initExistedDataSaga() {
    const teiId = yield call(getTeiId);
    const programId = yield select(
        (state) => state.metadata.programMetadata.id
    );
    // get Family TEI
    const data = yield call(
        dataApi.getTrackedEntityInstanceById,
        teiId,
        programId
    );
    const { orgUnit } = data;

    const selectedOrgUnit = yield call(getSelectedOrgUnitByOuId, orgUnit);

    // get Members TEI
    const memberTEIs = yield call(
        dataApi.getTrackedEntityInstances,
        orgUnit,
        [`attribute=gv9xX5w4kKt:EQ:${teiId}`],
        Object.entries(teiMapping).map((e) => e[1])
    );

    // const headerIndexes = yield call(getHeaderIndexes, memberTEIs);
    const memberTEIsUid = memberTEIs.trackedEntityInstances.map(
        (tei) => tei.trackedEntityInstance
    );

    // get by event query
    let memberTEIsEvents = null;
    if (memberTEIsUid && memberTEIsUid.length > 0) {
        memberTEIsEvents = yield call(
            dataApi.getAllTrackedEntityInstancesByIDs,
            'xvzrp56zKvI',
            memberTEIsUid
        );
    }

    if (!selectedOrgUnit) {
        throw new Error('Org Unit not found!');
    }
    yield put(setSelectedOrgUnit(selectedOrgUnit));
    yield call(handleInitData, data);
    yield call(handleInitCascadeData, memberTEIsEvents);
    yield put(editingAttributes(false));
}

function* initNewDataSaga() {
    yield call(handleInitNewData);
    yield put(editingAttributes(true));
}
