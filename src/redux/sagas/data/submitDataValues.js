import { call, put, takeLatest } from "redux-saga/effects";
import { SUBMIT_DATA_VALUES } from "../../types/data/tei";

import { dataApi } from "@/api";
import {
  getTeiError,
  getTeiSuccessMessage,
} from "../../actions/data/tei";


function* postDataCollector(de) {  
  try {
    var attributes = [];
    if(de.data.value) {
      attributes = [{attribute: 'CNqaoQva9S2', value: "Pending"},{attribute: 'AaFN0HwuzeK', value: de.data.value}]
    } else {
      attributes = [{attribute: 'CNqaoQva9S2', value: ""},{attribute: 'AaFN0HwuzeK', value: ''}]
    }
    
    yield call(dataApi.postAttribute, {tei:de.data.teiId,attributes:{orgUnit: de.data.orgUnit,attributes}});
    yield put(getTeiSuccessMessage(`Data Collector Updated successfully!`));
  } catch (e) {
    console.error("pushTEI", e);
    yield put(getTeiError("Data submission failed"));
  }
}

export default function* submitDataValues() {
  yield takeLatest(SUBMIT_DATA_VALUES, postDataCollector);
}
