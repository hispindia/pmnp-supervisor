import { SET_ME } from "@/redux/types/me";

export const setMe = (me) => ({
  type: SET_ME,
  payload: me,
});
