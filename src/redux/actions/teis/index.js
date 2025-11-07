import {
    CHANGE_PAGER,
    FILTER,
    GET_TEIS,
    GET_TEIS_ERROR_MESSAGE,
    GET_TEIS_SUCCEED,
    GET_TEIS_SUCCESS_MESSAGE,
    LOAD_TEIS,
    SORT,
    SELECTED,
    TABLE_CHANGE_PAGE,
    TABLE_FILTER,
    TABLE_SORT,
    DATACOLLECTERCOUNT,
    SUCCESSCOUNTLIST,
    HH_STATUS_LIST
} from '../../types/teis';

export const getTeis = () => ({
    type: GET_TEIS,
});

export const getTeisSucceed = (teis) => ({
    type: GET_TEIS_SUCCEED,
    teis,
});

export const getTeisSuccessMessage = (success) => ({
    type: GET_TEIS_SUCCESS_MESSAGE,
    success,
});

export const getTeisErrorMessage = (error) => ({
    type: GET_TEIS_ERROR_MESSAGE,
    error,
});

export const loadTeis = (loading) => ({
    type: LOAD_TEIS,
    loading,
});

export const filter = (filters) => ({
    type: FILTER,
    filters,
});

export const sort = (orderString) => ({
    type: SORT,
    orderString,
});

export const changePager = (pager) => ({
    type: CHANGE_PAGER,
    pager,
});

export const tableFilter = (value, teiId) => ({
    type: TABLE_FILTER,
    value,
    teiId,
});

export const tableSort = (tableFilterData) => ({
    type: TABLE_SORT,
    tableFilterData,
});

export const tableChangePage = (page, pageSize) => ({
    type: TABLE_CHANGE_PAGE,
    page,
    pageSize,
});

export const setSelectedTeis = (selectedList) => ({
    type: SELECTED,
    selectedList,
});
export const getHHStatusList = (hhStatusList) =>({
    type: HH_STATUS_LIST,
    hhStatusList
})
export const getHouseHoldList =(assignedHouseHoldcount) =>({
    type:DATACOLLECTERCOUNT,
    assignedHouseHoldcount

})
export const AssginList =(assignedHouseHoldcount) =>({
    type:SUCCESSCOUNTLIST,
    assignedHouseHoldcount

})
