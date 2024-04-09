import {
  GET_OFFLINE_STATUS,
  SET_OFFLINE_STATUS,
} from "@/redux/actions/common/type";

const savedOfflineStatus = localStorage.getItem("offlineStatus");

const initialState = {
  offlineStatus: savedOfflineStatus === "true" ? true : false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_OFFLINE_STATUS: {
      return {
        ...state,
        offlineStatus: action.offlineStatus,
      };
    }
    default:
      return state;
  }
}

export const getOfflineStatus = () => ({
  type: GET_OFFLINE_STATUS,
});
