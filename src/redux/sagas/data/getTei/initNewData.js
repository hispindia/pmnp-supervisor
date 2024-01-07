import { put, select } from 'redux-saga/effects';
import { generateCode } from '../../../../utils';
import { getTeiSuccess } from '../../../actions/data/tei';
import moment from 'moment';

function* handleInitNewData() {
    const {
        selectedOrgUnit: { id: orgUnit },
        programMetadata: { id: program, trackedEntityType, programStages },
    } = yield select((state) => state.metadata);
    const generatedTeiId = generateCode();
    const generatedEnrollmentId = generateCode();
    const currentTei = {
        trackedEntityInstance: generatedTeiId,
        orgUnit,
        isDirty: false,
        isNew: true,
        isSaved: false,
        trackedEntityType,
        attributes: {
            BUEzQEErqa7: moment().subtract(1, 'y').format('YYYY'),
        },
    };
    const currentEnrollment = {
        enrollment: generatedEnrollmentId,
        orgUnit,
        program,
        isDirty: false,
        isNew: true,
        trackedEntityInstance: generatedTeiId,
    };
    // const currentEvents = programStages.map((ps) => {
    //     return {
    //         event: generateCode(),
    //         orgUnit,
    //         programStage: ps.id,
    //         program,
    //         isDirty: false,
    //         isNew: true,
    //         trackedEntityInstance: generatedTeiId,
    //         enrollment: generatedEnrollmentId,
    //         dataValues: {},
    //     };
    // });
    const currentEvents = [];
    yield put(
        getTeiSuccess({
            currentTei,
            currentEnrollment,
            currentEvents,
        })
    );
}

export default handleInitNewData;

// export default function* mutateTei() {
//   yield takeLatest(INIT_NEW_DATA, handleInitNewData);
// }
