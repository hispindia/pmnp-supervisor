import { GET_ME, SET_ME } from "../types/me";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ME:
      return {
        ...state,
        ...action.payload,
      };
    case GET_ME:
      return state;
    default:
      return state;
  }
};

export const getMe = (state) => state.me;
