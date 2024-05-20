import {
  SET_OFFLINE_STATUS,
  SET_OFFLINE_LOADING_STATUS,
  SET_CURRENT_OFFLINE_LOADING,
  RESET_CURRENT_OFFLINE_LOADING,
  PUSH_TO_SERVER,
  SET_OFFLINE_SELECTED_ORGUNITS,
} from "./type";

export const setOfflineStatus = (offlineStatus) => ({
  type: SET_OFFLINE_STATUS,
  offlineStatus,
});

export const setOfflineLoadingStatus = (offlineLoading) => ({
  type: SET_OFFLINE_LOADING_STATUS,
  offlineLoading,
});

export const setCurrentOfflineLoading = (currentOfflineLoading) => ({
  type: SET_CURRENT_OFFLINE_LOADING,
  currentOfflineLoading,
});

export const setOfflineSelectedOrgUnits = (offlineSelectedOrgUnits) => ({
  type: SET_OFFLINE_SELECTED_ORGUNITS,
  offlineSelectedOrgUnits,
});

export const resetCurrentOfflineLoading = () => ({
  type: RESET_CURRENT_OFFLINE_LOADING,
});

export const pushToServer = () => ({
  type: PUSH_TO_SERVER,
});
