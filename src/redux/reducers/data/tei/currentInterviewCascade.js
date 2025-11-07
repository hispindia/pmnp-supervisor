import {
  CLEAR,
  GET_TEI_ERROR,
  GET_INTERVIEW_CASCADE_SUCCESS,
  UPDATE_INTERVIEW_CASCADE,
} from "../../../types/data/tei";

const currentInterviewCascade = (
  state = null,
  { type, currentInterviewCascade, newCascade }
) => {
  switch (type) {
    case GET_INTERVIEW_CASCADE_SUCCESS:
      return currentInterviewCascade;
    case GET_TEI_ERROR:
    case CLEAR:
      return null;
    case UPDATE_INTERVIEW_CASCADE:
      return newCascade;
    default:
      return state;
  }
};

export default currentInterviewCascade;
