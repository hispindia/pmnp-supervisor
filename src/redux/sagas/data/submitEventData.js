import { call, takeLatest } from "redux-saga/effects";
import { SUBMIT_EVENT_DATA } from "../../types/data/tei";

import { dataApi } from "@/api";


function* postEvent(eventData) {
  console.log("pushte",eventData);

  for (const tei of eventData.data.selectedList) {
    var events = {
      trackedEntityInstance: eventData.data.teiList[tei.key].trackedEntity,
      orgUnit: eventData.data.orgUnit,
    };
    yield call(dataApi.postAttribute, {tei:events.trackedEntityInstance,attributes:{orgUnit: eventData.data.orgUnit,attributes:[{attribute: 'CNqaoQva9S2', value: "Pending"},{attribute: 'AaFN0HwuzeK', value: eventData.data.assignedTo}]}});
    if(eventData.data.selectedList[eventData.data.selectedList.length-1].teiId == tei.teiId) {
      window.location.reload();
    }
  }
}

export default function* submitEventData() {
  yield takeLatest(SUBMIT_EVENT_DATA, postEvent);
}
