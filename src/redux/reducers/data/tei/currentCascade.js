import { CLEAR, GET_TEI_ERROR, GET_CASCADE_SUCCESS, UPDATE_CASCADE } from "../../../types/data/tei";

const currentCascade = (
    state = null,
    { type, currentCascade, newCascade }
) => {
    switch (type) {
        case GET_CASCADE_SUCCESS:
            return currentCascade;
        case GET_TEI_ERROR:
        case CLEAR:
            return null;
        case UPDATE_CASCADE:
            return newCascade;
        default:
            return state;
    }
};

export default currentCascade;
