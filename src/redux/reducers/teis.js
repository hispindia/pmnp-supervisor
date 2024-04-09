import {
  CHANGE_PAGER,
  FILTER,
  GET_TEIS_ERROR_MESSAGE,
  GET_TEIS_SUCCEED,
  GET_TEIS_SUCCESS_MESSAGE,
  LOAD_TEIS,
  SORT,
} from "../types/teis";

const initialState = {
  teis: null,
  loading: false,
  success: null,
  error: null,
  pager: {
    page: 1,
    total: 0,
    pageSize: 10,
  },
  filters: [],
  orderString: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TEIS_SUCCEED: {
      return {
        ...state,
        teis: action.teis,
      };
    }

    case LOAD_TEIS: {
      return {
        ...state,
        loading: action.loading,
      };
    }

    case GET_TEIS_SUCCESS_MESSAGE: {
      return {
        ...state,
        success: action.success,
      };
    }

    case GET_TEIS_ERROR_MESSAGE: {
      return {
        ...state,
        error: action.error,
      };
    }

    case FILTER: {
      return {
        ...state,
        filters: action.filters,
      };
    }

    case SORT: {
      return {
        ...state,
        orderString: action.orderString,
      };
    }

    case CHANGE_PAGER: {
      return {
        ...state,
        pager: {
          ...state.pager,
          ...action.pager,
        },
      };
    }

    default:
      return state;
  }
}
