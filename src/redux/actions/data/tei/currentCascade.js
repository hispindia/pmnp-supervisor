
import {
    UPDATE_CASCADE
} from "../../../types/data/tei";

export const updateCascade = (newCascade) => ({
    type: UPDATE_CASCADE,
    newCascade,
});
