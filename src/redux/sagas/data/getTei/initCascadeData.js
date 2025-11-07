import { put, select } from "redux-saga/effects";
import { getCascadeSuccess } from "../../../actions/data/tei";

import _ from "lodash";
import moment from "moment";

// construct data for family form Teis and Events
function* initCascadeDataFromTEIsEvents(payload, eventIncluded = true) {
  if (!payload) return [];

  let currentCascade = {};

  const memberTEIsWithEvents = payload ? payload.instances : [];

  currentCascade = memberTEIsWithEvents.reduce((cas, tei) => {
    let theTEI = {
      id: tei.trackedEntity,
    };

    tei.attributes.forEach((attr) => {
      theTEI[attr.attribute] = attr.value;
    });

    if (eventIncluded) {
      const enr = tei.enrollments[0];
      const events = enr.events;

      events.forEach((event) => {
        event.dataValues.forEach((de) => {
          const key = de.dataElement;
          const value = de.value;

          theTEI[key] = value;
        });
      });
    }

    cas.push(theTEI);

    return cas;
  }, []);

  process.env.NODE_ENV && console.log("currentCascade", currentCascade, memberTEIsWithEvents);

  yield put(
    getCascadeSuccess({
      currentCascade,
    }),
  );
}

// getting cascade data from oC9jreyd9SD
function* initCascadeData(payload) {
  // const programStages = yield select(
  //     (state) => state.metadata.programMetadata.programStages
  // );
  let currentCascade = {};

  const currentEvents = yield select((state) => state.data.tei.data.currentEvents);

  currentCascade =
    payload &&
    currentEvents.reduce((res, ce) => {
      let year = moment(ce.occurredAt).year();

      const cascadeByYear = JSON.parse(ce.dataValues.oC9jreyd9SD);

      res[year] = cascadeByYear.dataVals;
      return res;
    }, {});

  yield put(
    getCascadeSuccess({
      currentCascade,
    }),
  );
}

export default initCascadeDataFromTEIsEvents;
