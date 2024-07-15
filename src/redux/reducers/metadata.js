import moment from "moment";
import {
  SET_ORGUNITS,
  SET_ORGUNIT_GROUPS,
  SET_ORGUNIT_LEVELS,
  SET_PROGRAM_METADATA,
  SET_PROGRAM_METADATA_MEMBER,
  SET_SELECTED_ORGUNIT,
  SET_TEAS,
  SET_TRACKER_DATA_ELEMENTS,
  SET_USERS,
} from "../actions/metadata/type";

const initialState = {
  programMetadata: null,
  programMetadataMember: null,
  selectedOrgUnit: null,
  orgUnitGroups: null,
  orgUnitLevels: null,
  orgUnits: null,
  minDate: "2021-01-01",
  maxDate: moment().endOf("year").format("YYYY-MM-DD"),
  immutableYear: [2018, 2019],
  // subtract(1, "years")
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PROGRAM_METADATA: {
      return {
        ...state,
        programMetadata: action.payload.programMetadata,
      };
    }
    case SET_PROGRAM_METADATA_MEMBER: {
      return {
        ...state,
        programMetadataMember: action.payload.programMetadataMember,
      };
    }
    case SET_SELECTED_ORGUNIT: {
      return {
        ...state,
        selectedOrgUnit: action.payload.selectedOrgUnit,
      };
    }
    case SET_ORGUNITS: {
      return {
        ...state,
        orgUnits: action.payload.orgUnits,
      };
    }
    case SET_ORGUNIT_GROUPS: {
      return {
        ...state,
        orgUnitGroups: action.payload.orgUnitGroups,
      };
    }
    case SET_ORGUNIT_LEVELS: {
      return {
        ...state,
        orgUnitLevels: action.payload.orgUnitLevels,
      };
    }
    case SET_TEAS: {
      return {
        ...state,
        trackedEntityAttributes: action.payload.trackedEntityAttributes,
      };
    }
    case SET_TRACKER_DATA_ELEMENTS: {
      return {
        ...state,
        dataElements: action.payload.dataElements,
      };
    }
    case SET_USERS: {
      return {
        ...state,
        users: action.payload.users,
      };
    }

    default:
      return state;
  }
}
