import { GET_TEIS_ERROR_MESSAGE } from "@/redux/types/teis";
import {
  CLEAR,
  DELETE_TEI,
  DELETE_EVENT,
  DELETE_FAMILY_EVENT,
  GET_TEI,
  GET_CASCADE_SUCCESS,
  GET_TEI_ERROR,
  GET_TEI_SUCCESS,
  GET_TEI_SUCCESS_MESSAGE,
  GET_TEI_ERROR_MESSAGE,
  LOAD_TEI,
  CHANGE_EVENT_FAMILY,
  CLONE_EVENT,
  UPDATE_EVENT_DATE,
  CHANGE_MEMBER,
  DELETE_MEMBER,
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

export const deleteEvent = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

export const deleteEventFamily = (eventId) => ({
  type: DELETE_FAMILY_EVENT,
  eventId,
});

export const cloneFamily = (year) => ({
  type: CLONE_EVENT,
  year,
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
  getTei,
  getTeiError,
  getTeiSuccess,
  getCascadeSuccess,
  loadTei,
  clear,
  getTeiSuccessMessage,
  getTeiErrorMessage,
  deleteTei,
};
