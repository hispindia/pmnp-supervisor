import { CLEAR, GET_TEI_ERROR, GET_TEI_SUCCESS } from "../../../types/data/tei";

const currentFamily = (
  state = null,
  { type, currentTei, currentEnrollment, currentEvents }
) => {
  switch (type) {
    case GET_TEI_SUCCESS:
      return currentEnrollment;
    case GET_TEI_ERROR:
    case CLEAR:
      return null;
    default:
      return state;
  }
};

export default currentFamily;
