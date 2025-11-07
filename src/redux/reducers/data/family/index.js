import { combineReducers } from "redux";
import { GET_FAMILY } from "../../../types/data/family";

const loading = (state = false, { type, ...args }) => {
  switch (type) {
    case LOAD_TEI:
      return args.loading;
    case CLEAR:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  loading,
  // data,
  // error,
  // isEditingAttributes,
  // currentTab,
  // success,
});
