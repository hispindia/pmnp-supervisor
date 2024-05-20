import {
  GET_OFFLINE_STATUS,
  SET_OFFLINE_STATUS,

  // Loading
  GET_OFFLINE_LOADING_STATUS,
  SET_OFFLINE_LOADING_STATUS,
  SET_CURRENT_OFFLINE_LOADING,
  GET_CURRENT_OFFLINE_LOADING,
  RESET_CURRENT_OFFLINE_LOADING,
  SET_OFFLINE_SELECTED_ORGUNITS,
} from "@/redux/actions/common/type";

const savedOfflineStatus = localStorage.getItem("offlineStatus");

const initialState = {
  offlineStatus: savedOfflineStatus === "true" ? true : false,
  offlineLoading: false,
  currentOfflineLoading: {
    id: null,
    percent: 0,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_OFFLINE_STATUS: {
      return {
        ...state,
        offlineStatus: action.offlineStatus,
      };
    }
    case SET_OFFLINE_LOADING_STATUS: {
      return {
        ...state,
        offlineLoading: action.offlineLoading,
      };
    }
    case SET_CURRENT_OFFLINE_LOADING: {
      return {
        ...state,
        currentOfflineLoading: action.currentOfflineLoading,
      };
    }
    case RESET_CURRENT_OFFLINE_LOADING: {
      return {
        ...state,
        currentOfflineLoading: initialState.currentOfflineLoading,
      };
    }
    case SET_OFFLINE_SELECTED_ORGUNITS: {
      return {
        ...state,
        offlineSelectedOrgUnits: action.offlineSelectedOrgUnits,
      };
    }
    default:
      return state;
  }
}

export const getOfflineStatus = () => ({
  type: GET_OFFLINE_STATUS,
});

export const getOfflineLoadingStatus = () => ({
  type: GET_OFFLINE_LOADING_STATUS,
});

export const getCurrentOfflineLoading = () => ({
  type: GET_CURRENT_OFFLINE_LOADING,
});
