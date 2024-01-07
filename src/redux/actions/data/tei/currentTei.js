import { MUTATE_ATTRIBUTES, UPDATE_IS_NEW } from "../../../types/data/tei";

export const mutateAttributes = (newValues) => ({
  type: MUTATE_ATTRIBUTES,
  newValues,
});

export const updateNewStatus = (isNew) => ({
  type: UPDATE_IS_NEW,
  isNew,
});
