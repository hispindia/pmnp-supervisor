import { SET_OFFLINE_STATUS, PUSH_TO_SERVER } from './type';

export const setOfflineStatus = (offlineStatus) => ({
    type: SET_OFFLINE_STATUS,
    offlineStatus,
});

export const pushToServer = () => ({
    type: PUSH_TO_SERVER,
});
