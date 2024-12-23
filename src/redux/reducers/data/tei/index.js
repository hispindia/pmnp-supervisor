import { combineReducers } from "redux";
import {
  CHANGE_TAB,
  CHANGE_EVENT_FAMILY,
  CHANGE_MEMBER,
  CLEAR,
  GET_TEI,
  GET_TEI_ERROR,
  GET_TEI_SUCCESS,
  GET_TEI_SUCCESS_MESSAGE,
  GET_TEI_ERROR_MESSAGE,
  IS_EDITING_ATTRIBUTES,
  LOAD_TEI,
  SET_PARENT_OU_PATTERN,
} from "../../../types/data/tei";
import currentTei from "./currentTei";
import currentEvents from "./currentEvents";
import currentEnrollment from "./currentEnrollment";
import currentCascade from "./currentCascade";

const data = combineReducers({
  currentTei,
  currentEvents,
  currentEnrollment,
  currentCascade,
});

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

const error = (state = null, { type, ...args }) => {
  switch (type) {
    case GET_TEI_SUCCESS:
    case GET_TEI:
    case CLEAR:
      return null;
    case GET_TEI_ERROR:
      return args.error;
    case GET_TEI_ERROR_MESSAGE:
      return args.message;
    default:
      return state;
  }
};

const isEditingAttributes = (state = false, { type, ...args }) => {
  switch (type) {
    case IS_EDITING_ATTRIBUTES:
      return args.isEditingAttributes;
    case CLEAR:
      return false;
    default:
      return state;
  }
};

const currentTab = (state = "1", { type, ...agrs }) => {
  switch (type) {
    case CHANGE_TAB:
      return agrs.tabId;
    case CLEAR:
      return "1";
    default:
      return state;
  }
};
const ouPattern = (state = null, { type,payload, ...agrs }) => {
  switch (type) {
    case SET_PARENT_OU_PATTERN:
      return payload.pattern;
    default:
      return state;
  }
};

const lastYear = new Date().getFullYear() - 1;
const defaultSelectedFamily = { index: 0, year: lastYear, selected6Month: 1 };

const selectedYear = (state = defaultSelectedFamily, { type, ...args }) => {
  switch (type) {
    case CHANGE_EVENT_FAMILY:
      return {
        index: args.index,
        year: args.year,
        selected6Month: args.selected6Month,
      };
    case CLEAR:
      return defaultSelectedFamily;
    default:
      return state;
  }
};

const selectedMember = (state = {}, { type, ...args }) => {
  switch (type) {
    case CHANGE_MEMBER:
      return args.member;
    case CLEAR:
      return {};
    default:
      return state;
  }
};

const success = (state = null, { type, ...args }) => {
  switch (type) {
    case GET_TEI_SUCCESS_MESSAGE:
      return args.message;
    case CLEAR:
      return null;
    default:
      return state;
  }
};

export default combineReducers({
  loading,
  data,
  error,
  isEditingAttributes,
  currentTab,
  selectedYear,
  selectedMember,
  success,
  ouPattern
});
