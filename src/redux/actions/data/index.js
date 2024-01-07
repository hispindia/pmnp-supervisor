import {
  CHANGE_TAB,
  IS_EDITING_ATTRIBUTES,
  MUTATE_TEI,
  MUTATE_ATTRIBUTES,
  MUTATE_ENROLLMENT,
  MUTATE_EVENT,
  MUTATE_DATAVALUE,
  INIT_DATA,
  INIT_NEW_DATA,
  INIT_DATA_MEMBER,
  INIT_NEW_EVENT,
  SUBMIT_ATTRIBUTES,
  SUBMIT_EVENTS,
} from "../../types/data/tei";

export const mutateTei = (property, value) => ({
  type: MUTATE_TEI,
  payload: {
    property,
    value,
  },
});

export const mutateEnrollment = (property, value) => ({
  type: MUTATE_ENROLLMENT,
  payload: {
    property,
    value,
  },
});

export const mutateEvent = (eventId, dataValues) => ({
  type: MUTATE_EVENT,
  eventId,
  dataValues,
});

export const mutateDataValue = (eventId, dataElement, value) => ({
  type: MUTATE_DATAVALUE,
  payload: {
    eventId,
    dataElement,
    value,
  },
});

export const initNewData = () => ({
  type: INIT_NEW_DATA,
});

export const initData = (trackedEntityInstance) => ({
  type: INIT_DATA,
  trackedEntityInstance,
});

export const initDataMember = (trackedEntityInstance, programMetadata) => ({
  type: INIT_DATA_MEMBER,
  payload: {
    trackedEntityInstance,
    programMetadata,
  },
});

export const submitAttributes = (attributes) => {
  return {
    type: SUBMIT_ATTRIBUTES,
    attributes,
  };
};

export const submitEvent = (event) => {
  return {
    type: SUBMIT_EVENTS,
    event,
  };
};

export const initNewEvent = (eventId, programStage) => ({
  type: INIT_NEW_EVENT,
  payload: { eventId, programStage },
});

export const editingAttributes = (isEditingAttributes) => ({
  type: IS_EDITING_ATTRIBUTES,
  isEditingAttributes,
});

export const changeTab = (tabId) => ({
  type: CHANGE_TAB,
  tabId,
});
