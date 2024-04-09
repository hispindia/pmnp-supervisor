import { takeEvery, select, all } from 'redux-saga/effects';
import { MUTATE_DATAVALUE } from '../../actions/data/type';

function* handleMutateDataValue({
    eventId: eventId,
    dataElement: dataElement,
    value: value,
}) {
    console.log('handleMutateDataValue', eventId, dataElement, value);

    const { currentEvents } = select((state) => state.data.tei.data);
    const state = select((state) => state);

    const currentEventIndex = currentEvents.findIndex(
        (event) => event.event === eventId
    );
    currentEvents[currentEventIndex].dataValues[dataElement] = value;
    currentEvents[currentEventIndex].isDirty = true;

    return { ...state, currentEvents: [...currentEvents] };
}

export default function* mutateDataValue() {
    yield takeEvery(MUTATE_DATAVALUE, handleMutateDataValue);
}
