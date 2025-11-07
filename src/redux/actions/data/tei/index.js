import {
  CHANGE_EVENT_FAMILY,
  CHANGE_MEMBER,
  CLEAR,
  DELETE_EVENT,
  DELETE_FAMILY_EVENT,
  DELETE_MEMBER,
  DELETE_TEI,
  GET_CASCADE_SUCCESS,
  GET_INTERVIEW_CASCADE_SUCCESS,
  GET_TEI,
  GET_TEI_ERROR,
  GET_TEI_ERROR_MESSAGE,
  GET_TEI_SUCCESS,
  GET_TEI_SUCCESS_MESSAGE,
  LOAD_TEI,
  UPDATE_EVENT_DATE,
} from "../../../types/data/tei";

const getTei = (tei) => ({
  type: GET_TEI,
  tei,
});

const getTeiSuccess = ({ currentTei, currentEnrollment, currentEvents }) => ({
  type: GET_TEI_SUCCESS,
  currentTei,
  currentEnrollment,
  currentEvents,
});

const getTeiError = (error) => {
  return {
    type: GET_TEI_ERROR,
    error,
  };
};

const getCascadeSuccess = ({ currentCascade }) => ({
  type: GET_CASCADE_SUCCESS,
  currentCascade,
});

const getInterviewCascadeSuccess = ({ currentInterviewCascade }) => ({
  type: GET_INTERVIEW_CASCADE_SUCCESS,
  currentInterviewCascade,
});

const getTeiSuccessMessage = (message) => ({
  type: GET_TEI_SUCCESS_MESSAGE,
  message,
});

const getTeiErrorMessage = (message) => ({
  type: GET_TEI_ERROR_MESSAGE,
  message,
});

const loadTei = (loading) => ({
  type: LOAD_TEI,
  loading,
});

const clear = () => ({
  type: CLEAR,
});

const deleteTei = (teiId) => ({
  type: DELETE_TEI,
  teiId,
});

export const changeEventFamily = (index, year, selected6Month) => ({
  type: CHANGE_EVENT_FAMILY,
  index,
  year,
  selected6Month,
});

export const deleteEvent = (eventId, refreshTei = true) => ({
  type: DELETE_EVENT,
  eventId,
  refreshTei,
});

export const deleteEventFamily = (eventId) => ({
  type: DELETE_FAMILY_EVENT,
  eventId,
});

export const updateFamilyDate = (year) => ({
  type: UPDATE_EVENT_DATE,
  year,
});

export const changeMember = (member) => ({
  type: CHANGE_MEMBER,
  member,
});

export const deleteMember = (member) => ({
  type: DELETE_MEMBER,
  member,
});

export {
  clear,
  deleteTei,
  getCascadeSuccess,
  getInterviewCascadeSuccess,
  getTei,
  getTeiError,
  getTeiErrorMessage,
  getTeiSuccess,
  getTeiSuccessMessage,
  loadTei,
};
