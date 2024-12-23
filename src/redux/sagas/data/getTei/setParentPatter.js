import { dataApi } from "@/api";
import { setSelectedParentOuPattern } from "@/redux/actions/data";
import { call, put, select } from "redux-saga/effects";

export function* getParentOuPatern() {
    console.log('getParentOuPatern: called');
    const { offlineStatus } = yield select((state) => state.common);
    const { selectedOrgUnit: { id: orgUnit } } = yield select((state) => state.metadata);
    // handle parent nodes
    let parent = null

    let randomNumber = Math.floor(100 + Math.random() * 900);

    function extractValues(obj) {
        let values = [];
        if (obj.attributeValues) {
            values.push(...obj.attributeValues?.map(av => av?.value));
        }
        if (obj.parent) {
            values.push(...extractValues(obj.parent));
        }
        return values;
    }

    if (offlineStatus) { }
    else {
        try {
            parent = yield call(dataApi.getParentsByOuId, orgUnit);
            parent = extractValues(parent);
            // console.log('allParents:>>>>>>', parent)
            yield put(setSelectedParentOuPattern(parent?.join(' ') + ' ' + randomNumber))
        } catch (error) {
            yield put(setSelectedParentOuPattern())
        }
    }

    return parent

}
