import {
  GET_OFFLINE_STATUS,
  SET_OFFLINE_STATUS,

  // Loading
  GET_OFFLINE_LOADING_STATUS,
  SET_OFFLINE_LOADING_STATUS,
} from "@/redux/actions/common/type";

const savedOfflineStatus = localStorage.getItem("offlineStatus");

const initialState = {
  offlineStatus: savedOfflineStatus === "true" ? true : false,
  offlineLoading: false,
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
