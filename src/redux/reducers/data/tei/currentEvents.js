import {
  CLEAR,
  GET_TEI_ERROR,
  GET_TEI_SUCCESS,
  MUTATE_EVENT,
  UPDATE_EVENTS,
} from "../../../types/data/tei";

const currentEvents = (state = null, action) => {
  switch (action.type) {
    case GET_TEI_SUCCESS:
      return action.currentEvents;
    case GET_TEI_ERROR:
    case CLEAR:
      return null;
    case UPDATE_EVENTS:
      return action.newEvents;
    default:
      return state;
  }
};

export default currentEvents;
