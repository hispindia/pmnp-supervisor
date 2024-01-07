import {
  SET_PROGRAM_METADATA,
  SET_PROGRAM_METADATA_MEMBER,
  SET_SELECTED_ORGUNIT,
  SET_TRACKER_DATA_ELEMENTS,
  SET_TEAS,
  SET_USERS,
  SET_ORGUNIT_GROUPS,
  SET_ORGUNIT_LEVELS,
  SET_ORGUNITS,
} from "./type";

export const setProgramMetadata = (programMetadata) => ({
  type: SET_PROGRAM_METADATA,
  payload: {
    programMetadata,
  },
});

export const setProgramMetadataMember = (programMetadataMember) => ({
  type: SET_PROGRAM_METADATA_MEMBER,
  payload: {
    programMetadataMember,
  },
});

export const setSelectedOrgUnit = (selectedOrgUnit) => ({
  type: SET_SELECTED_ORGUNIT,
  payload: {
    selectedOrgUnit,
  },
});

export const setTeas = (trackedEntityAttributes) => ({
  type: SET_TEAS,
  payload: {
    trackedEntityAttributes,
  },
});

export const setTrackerDataElements = (dataElements) => ({
  type: SET_TRACKER_DATA_ELEMENTS,
  payload: {
    dataElements,
  },
});

export const setUsers = (users) => ({
  type: SET_USERS,
  payload: {
    users,
  },
});
export const setOrgUnitGroups = (orgUnitGroups) => ({
  type: SET_ORGUNIT_GROUPS,
  payload: {
    orgUnitGroups,
  },
});
export const setOrgUnitLevels = (orgUnitLevels) => ({
  type: SET_ORGUNIT_LEVELS,
  payload: {
    orgUnitLevels,
  },
});
export const setOrgUnits = (orgUnits) => ({
  type: SET_ORGUNITS,
  payload: {
    orgUnits,
  },
});
