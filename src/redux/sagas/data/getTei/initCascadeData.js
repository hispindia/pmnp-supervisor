import { put, select } from 'redux-saga/effects';
import { convertValue } from '../../../../utils';
import { getCascadeSuccess, changeFamily } from '../../../actions/data/tei';

import moment from 'moment';
import _ from 'lodash';

const teiMapping = {
    id: 'instance',
    firstname: 'IEE2BMhfoSc',
    lastname: 'IBLkiaYRRL3',
    sex: 'DmuazFb368B',
    ethnicity: 'tJrT8GIy477',
    birthyear: 'bIzDI9HJCB0',
    // age: 'BaiVwt8jVfg',
    nationality: 'NLth2WTyo7M',
    status: 'tASKWHyRolc',
    agetype: 'ck9h7CokxQE',
    DOB: 'tQeFLjYbqzv',
};

const eventMapping = {
    DOB: 'PzzayUNGasj',
    relation: 'u0Ke4EXsIKZ',
    education: 'Z9a4Vim1cuJ',
    insurance: 'vbBhehiwNLV',
    maritalstatus: 'xXybyxfggiE',
    age: 'it3Ih0CVTV1',
};

function* initCascadeData1(payload) {
    // const programStages = yield select(
    //     (state) => state.metadata.programMetadata.programStages
    // );
    let currentCascade = {};

    const currentEvents = yield select(
        (state) => state.data.tei.data.currentEvents
    );

    const memberTEIsWithEvents = payload ? payload.trackedEntityInstances : [];

    currentCascade =
        payload &&
        currentEvents.reduce((res, ce) => {
            let year = moment(ce.eventDate).year();
            process.env.NODE_ENV && console.log(year);

            let cascadeByYear = memberTEIsWithEvents.reduce((cas, tei) => {
                const enr = tei.enrollments[0];
                const events = enr.events;
                const eventByYear = _.filter(events, function (n) {
                    return moment(n.eventDate).isBetween(
                        `${year}-01-01`,
                        `${year}-12-31`,
                        undefined,
                        '[]'
                    );
                });

                if (eventByYear && eventByYear.length > 0) {
                    let theTEI = {
                        id: tei.trackedEntityInstance,
                    };
                    // TEI
                    Object.entries(teiMapping).forEach(([key, value]) => {
                        const attributeData = tei.attributes.find(
                            (attr) => attr.attribute === value
                        );
                        if (attributeData) {
                            theTEI[key] = attributeData.value;
                        }
                    });

                    // EVENT
                    Object.entries(eventMapping).forEach(([key, value]) => {
                        const event = eventByYear?.[0]?.dataValues.find(
                            (de) => de.dataElement === value
                        );
                        if (event) {
                            theTEI[key] = event.value;
                        }
                    });

                    cas.push(theTEI);
                }
                return cas;
            }, []);

            res[year] = cascadeByYear;
            return res;
        }, {});

    process.env.NODE_ENV && console.log('currentCascade', currentCascade);
    yield put(
        getCascadeSuccess({
            currentCascade,
        })
    );
}
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
            let year = moment(ce.eventDate).year();

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

export default initCascadeData;

// export default function* initData() {
//   yield takeLatest(INIT_DATA, handleInitData);
// }
