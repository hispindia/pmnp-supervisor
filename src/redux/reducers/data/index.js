// import {
//   MUTATE_TEI,
//   MUTATE_ATTRIBUTES,
//   MUTATE_ENROLLMENT,
//   MUTATE_EVENT,
//   MUTATE_DATAVALUE,
//   INIT_DATA,
//   INIT_NEW_DATA,
//   INIT_DATA_MEMBER,
//   INIT_NEW_EVENT,
// } from "../../actions/data/type";
// import {
//   mutateTei,
//   mutateAttribute,
//   mutateEnrollment,
//   mutateEvent,
//   mutateDataValue,
//   initData,
//   initDataMember,
//   initNewData,
//   initNewEvent,
// } from "../data-methods";
import { combineReducers } from "redux";
import tei from "./tei";

// const initialState = {
//   currentEvents: null,
//   currentEnrollment: null,
//   currentEvents: [],
//   memberTei: null,
//   memberEnrollment: null,
//   memberEvents: null,
// };

export default combineReducers({
  // mutateDataValue,
  tei,
});

// export default function (state = initialState, action) {
//   switch (action.type) {
//     case MUTATE_TEI: {
//       return initData(state, action);
//     }
//     case MUTATE_ATTRIBUTES: {
//       return mutateAttribute(state, action);
//     }
//     case MUTATE_ENROLLMENT: {
//       return mutateEnrollment(state, action);
//     }
//     case MUTATE_EVENT: {
//       return mutateEvent(state, action);
//     }
//     case MUTATE_DATAVALUE: {
//       return mutateDataValue(state, action);
//     }
//     case INIT_NEW_DATA: {
//       return initNewData(state, action);
//     }
//     case INIT_DATA: {
//       return initData(state, action);
//     }
//     case INIT_DATA_MEMBER: {
//       return initDataMember(state, action);
//     }
//     case INIT_NEW_EVENT: {
//       return initNewEvent(state, action);
//     }
//     default:
//       return state;
//   }
// }
