import {
  SET_OFFLINE_STATUS,
  SET_OFFLINE_LOADING_STATUS,
  PUSH_TO_SERVER,
} from "./type";

export const setOfflineStatus = (offlineStatus) => ({
  type: SET_OFFLINE_STATUS,
  offlineStatus,
});

export const setOfflineLoadingStatus = (offlineLoadingStatus) => ({
  type: SET_OFFLINE_LOADING_STATUS,
  offlineLoadingStatus,
});

export const pushToServer = () => ({
  type: PUSH_TO_SERVER,
});
