import {
  CLEAR,
  GET_TEI_ERROR,
  GET_TEI_SUCCESS,
  MUTATE_ATTRIBUTES,
  UPDATE_IS_NEW,
} from "../../../types/data/tei";

const currentTei = (state = null, { type, ...args }) => {
  switch (type) {
    case GET_TEI_SUCCESS:
      return args.currentTei;
    case GET_TEI_ERROR:
      return null;
    case MUTATE_ATTRIBUTES:
      return {
        ...state,
        attributes: {
          ...state.attributes,
          ...args.newValues,
        },
      };
    case UPDATE_IS_NEW: {
      return { ...state, isNew: args.isNew };
    }
    case CLEAR:
      return null;
    default:
      return state;
  }
};

export default currentTei;
