import { put, select } from "redux-saga/effects";
import { getCascadeSuccess } from "../../../actions/data/tei";

import _ from "lodash";
import moment from "moment";

const teiMapping = {
  id: "instance",
  firstname: "IEE2BMhfoSc",
  lastname: "IBLkiaYRRL3",
  sex: "DmuazFb368B",
  ethnicity: "tJrT8GIy477",
  birthyear: "bIzDI9HJCB0",
  // age: 'BaiVwt8jVfg',
  nationality: "NLth2WTyo7M",
  status: "tASKWHyRolc",
  agetype: "ck9h7CokxQE",
  DOB: "tQeFLjYbqzv",
  // New Family Book Number
  newFamilyBookNum: "W4aInCTn8p5",
  // Covid Number
  covidNum: "rSETgSvyVpJ",
  // Police Number
  policeNum: "PYgXM3R2TQd",
  // Phone Number
  phoneNum: "g9wNk1T3MLE",
};

const eventMapping = {
  // DOB: "PzzayUNGasj", DOB of event ( do not use this )
  relation: "u0Ke4EXsIKZ",
  education: "Z9a4Vim1cuJ",
  insurance: "vbBhehiwNLV",
  maritalstatus: "xXybyxfggiE",
  age: "it3Ih0CVTV1",
};

// construct data for family form Teis and Events
function* initCascadeDataFromTEIsEvents(payload) {
  // const programStages = yield select(
  //   (state) => state.metadata.programMetadata.programStages
  // );

  console.log("initCascadeDataFromTEIsEvents", { payload });

  let currentCascade = {};

  const currentEvents = yield select(
    (state) => state.data.tei.data.currentEvents
  );

  const memberTEIsWithEvents = payload ? payload.instances : [];

  currentCascade =
    payload &&
    currentEvents.reduce((res, ce) => {
      let year = moment(ce.occurredAt).year();

      let cascadeByYear = memberTEIsWithEvents.reduce((cas, tei) => {
        const enr = tei.enrollments[0];
        const events = enr.events;
        const eventByYear = _.filter(events, function (n) {
          return moment(n.occurredAt).isBetween(
            `${year}-01-01`,
            `${year}-12-31`,
            undefined,
            "[]"
          );
        });

        if (eventByYear && eventByYear.length > 0) {
          let theTEI = {
            id: tei.trackedEntity,
          };

          tei.attributes.forEach((attr) => {
            theTEI[attr.attribute] = attr.value;
          });

          const event = eventByYear?.[0];
          if (event) {
            event.dataValues.forEach((de) => {
              const key = de.dataElement;
              const value = de.value;

              theTEI[key] = value;
            });
          }

          cas.push(theTEI);
        }
        return cas;
      }, []);

      res[year] = cascadeByYear;
      return res;
    }, {});

  process.env.NODE_ENV && console.log("currentCascade", currentCascade);
  yield put(
    getCascadeSuccess({
      currentCascade,
    })
  );
}

// getting cascade data from oC9jreyd9SD
function* initCascadeData(payload) {
  // const programStages = yield select(
  //     (state) => state.metadata.programMetadata.programStages
  // );
  let currentCascade = {};

  const currentEvents = yield select(
    (state) => state.data.tei.data.currentEvents
  );

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
    })
  );
}

export default initCascadeDataFromTEIsEvents;

// export default function* initData() {
//   yield takeLatest(INIT_DATA, handleInitData);
// }
