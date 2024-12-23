import { takeLatest, call, put, select } from 'redux-saga/effects';
import { GET_TEI } from '../../types/data/tei';
import { initData, initNewData, setSelectedParentOuPattern } from '../../actions/data';
import { dataApi } from '../../../api';

function* handleGetTei({ tei: teiId }) {
    const programId = yield select(
        (state) => state.metadata.programMetadata.id
    );

    if (teiId) {
        try {
            const data = yield call(
                dataApi.getTrackedEntityInstanceById,
                teiId,
                programId
            );
            yield put(initData(data));
        } catch (e) {
            console.log(e);
            yield put(initNewData());
        }
    } else {
        // TODO: [Liem]: redirect to tei = null
        yield put(initNewData());
    }
}
export default function* getTei() {
    yield takeLatest(GET_TEI, handleGetTei);
}

// export function* getParentOuPatern() {
//     console.log('getParentOuPatern: called');
//     const { offlineStatus = null } = yield select((state) => state?.common);
//     const { selectedOrgUnit: { id: orgUnit } } = yield select((state) => state.metadata);
//     // handle parent nodes
//     let parent = null

//     function extractValues(obj) {
//         let values = [];
//         if (obj.attributeValues) {
//             values.push(...obj.attributeValues?.map(av => av?.value));
//         }
//         if (obj.parent) {
//             values.push(...extractValues(obj.parent));
//         }
//         return values;
//     }

//     if (offlineStatus) { }
//     else {
//         try {
//             parent = yield call(dataApi.getParentsByOuId, orgUnit);
//             let parent = extractValues(parent);
//             console.log('allParents:>>>>>>', parent)
//             yield put(setSelectedParentOuPattern(parent?.join(' ')))
//         } catch (error) {
//             yield put(setSelectedParentOuPattern())
//         }
//     }

//     return parent;
// }