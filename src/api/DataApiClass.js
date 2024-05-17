import { pull, push } from "./Fetch";
import BaseApiClass from "./BaseApiClass";
import moment from "moment";

export default class DataApiClass extends BaseApiClass {
  constructor(...agrs) {
    super(...agrs);
    this.this = this;
  }

  getTrackedEntityInstanceList = (orgUnit, program, pageSize, page, filter) =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/trackedEntities.json`,
      {
        paging: true,
        pageSize: pageSize,
        totalPages: true,
        page: page,
        filter: filter,
      },
      [
        `orgUnit=${orgUnit}`,
        `ouMode=SELECTED`,
        `order=created:desc`,
        `program=${program}`,
      ]
    );

  getTrackedEntityInstanceListByQuery = (
    orgUnit,
    program,
    pageSize,
    page,
    filter,
    order
  ) =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/trackedEntities.json`,
      {
        paging: true,
        pageSize: pageSize,
        totalPages: true,
        page: page,
        filter: filter,
        order: order,
      },
      [`orgUnit=${orgUnit}`, `ouMode=SELECTED`, `program=${program}`]
    );

  getAllTrackedEntityInstancesByIDs = (program, teiList) =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/trackedEntities.json`,
      {
        paging: false,
      },
      [`fields=*`, `trackedEntity=${teiList.join(";")}`, `program=${program}`]
    );

  getAllTrackedEntityInstanceList = (orgUnit, program) =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/query`,
      {
        paging: false,
      },
      [`orgUnit=${orgUnit}`, `ouMode=SELECTED`, `program=${program}`]
    );

  getEventsByTEI = (program, trackedEntityInstance, startDate, endDate) => {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/events`,
      {
        paging: false,
      },
      [
        `fields=:all`,
        `program=${program}`,
        `trackedEntityInstance=${trackedEntityInstance}`,
        `startDate=${startDate}&endDate=${endDate}`,
      ]
    );
  };

  getEventsByQuery = (programStage, orgUnit, filters, startDate, endDate) => {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/events/query`,
      {
        paging: false,
      },
      [
        filters.join("&"),
        `includeAllDataElements`,
        `orgUnit=${orgUnit}`,
        `programStage=${programStage}`,
        `startDate=${startDate}&endDate=${endDate}`,
      ]
    );
  };

  getAllTrackedEntityFiltersList = (program) =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstanceFilters`,
      {
        paging: false,
      },
      [`fields=:all`, `program=${program}`]
    );

  findTei = (orgUnit, program, attributes) => {
    let filters = "";
    attributes.forEach((attr) => {
      filters += `&filter=${attr.attribute}:EQ:${attr.value}`;
    });
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/trackedEntities.json`,
      {
        paging: false,
        filter: filters,
      },
      [`orgUnit=${orgUnit}`, `ouMode=SELECTED`, `program=${program}`]
    );
  };

  search = (ouId, ouMode, queryUrl, program, attribute, pager, paging) => {
    var url = this.getSearchUrl(
      ouId,
      ouMode,
      queryUrl,
      program,
      attribute,
      pager,
      paging
    );
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/query`,
      {},
      [url]
    );
  };

  getSearchUrl = (
    ouId,
    ouMode,
    queryUrl,
    program,
    attribute,
    pager,
    paging
  ) => {
    var url = "";
    url += "orgUnit=" + ouId + "&ouMode=" + ouMode;

    if (queryUrl) {
      url = url + "&" + queryUrl;
    }
    if (program) {
      url = url + "&program=" + program;
    }
    if (attribute) {
      url = url + "&" + attribute;
    }
    if (paging) {
      var pgSize = (pager && pager.pageSize) || 50;
      var pg = (pager && pager.page) || 1;
      pgSize = pgSize > 1 ? pgSize : 1;
      pg = pg > 1 ? pg : 1;
      url = url + "&pageSize=" + pgSize + "&page=" + pg;
      if (pager && pager.skipTotalPages) {
        url += "&totalPages=false";
      } else {
        url += "&totalPages=true";
      }
    } else {
      url = url + "&paging=false";
    }
    return url;
  };

  getPeriodDate = (days) => moment().add(days, "days").format("YYYY-MM-DD");

  getEventUrl = (eventFilter) => {
    var eventUrl = "";
    if (eventFilter) {
      if (eventFilter.eventStatus)
        eventUrl = "eventStatus=" + eventFilter.eventStatus;
      if (eventFilter.eventCreatedPeriod) {
        if (eventUrl) eventUrl += "&";
        eventUrl +=
          "eventStartDate=" +
          this.getPeriodDate(eventFilter.eventCreatedPeriod.periodFrom);
        eventUrl +=
          "&eventEndDate=" +
          this.getPeriodDate(eventFilter.eventCreatedPeriod.periodTo);
      }
      if (eventFilter.programStage) {
        if (eventUrl) eventUrl += "&";
        eventUrl += "programStage=" + eventFilter.programStage;
      }
      if (eventFilter.assignedUserMode) {
        if (eventUrl) eventUrl += "&";
        eventUrl += "assignedUserMode=" + eventFilter.assignedUserMode;
      }
      if (
        !eventFilter.assignedUserMode ||
        (eventFilter.assignedUserMode == "PROVIDED" &&
          eventFilter.assignedUsers &&
          eventFilter.assignedUsers.length > 0)
      ) {
        if (eventUrl) eventUrl += "&";
        eventUrl += "assignedUser=";
        for (var i = 0; i < eventFilter.assignedUsers.length; i++) {
          if (i > 0) eventUrl += ";";
          eventUrl += eventFilter.assignedUsers[i];
        }
      }
    }
    return eventUrl;
  };

  getTrackedEntityInstanceById = (id, program) => {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/trackedEntities/${id}.json`,
      { paging: false },
      [`fields=*`, `program=${program}`]
    );
  };

  getTrackedEntityInstanceByQuery = (ou, filters, attributes) => {
    console.log("getTrackedEntityInstanceByQuery");
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/query.json`,
      {},
      [
        `orgUnit=${ou}`,
        filters.join("&"),
        attributes.map((e) => "attribute=" + e).join("&"),
      ]
    );
  };

  getTrackedEntityInstances = (ou, filters, attributes, program) => {
    console.log("trackedEntities");
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/trackedEntities.json`,
      {},
      [
        `orgUnit=${ou}`,
        `program=${program}`,
        filters.join("&"),
        attributes.map((e) => "attribute=" + e).join("&"),
      ]
    );
  };

  getWorkingListDataWithMultipleEventFilters = (
    workingList,
    ou,
    program,
    pager,
    sortColumn
  ) =>
    new Promise((resolve) => {
      var promises = [];
      workingList.eventFilters.forEach((eventFilter) => {
        var eventUrl = this.getEventUrl(eventFilter);
        var tempPager = {
          pageSize: 1000,
          page: 1,
        };
        promises.push(
          this.search(
            ou,
            "SELECTED",
            eventUrl, //queryUrl
            program,
            null, //attribute
            tempPager,
            true // paging
          )
        );
      });

      Promise.all(promises).then((response) => {
        var data = { height: 0, width: 0, rows: [] };
        var existingTeis = {};
        var allRows = [];

        response.forEach((responseData) => {
          data.headers =
            data.headers && data.headers.length > responseData.headers.length
              ? data.headers
              : responseData.headers;
          data.width =
            data.width > responseData.width ? data.width : responseData.width;
          allRows = allRows.concat(responseData.rows);
        });

        //Getting distinct list
        var existing = {};
        data.rows = allRows.filter(function (d) {
          if (existing[d[0]]) return false;
          existing[d[0]] = true;
          return true;
        });

        // var sortColumnIndex = data.headers.findIndex(function (h) {
        //   return h.name === sortColumn.id;
        // });
        // if (sortColumnIndex)
        //   data.rows = orderByKeyFilter(
        //     data.rows,
        //     sortColumnIndex,
        //     sortColumn.direction
        //   );
        // //order list
        // cachedMultipleEventFiltersData[workingList.name] = data;
        // workingList.cachedSorting = searchParams.sortUrl;
        // workingList.cachedOrgUnit = searchParams.orgUnitId;
        // var data = getCachedMultipleEventFiltersData(
        //   workingList,
        //   pager,
        //   sortColumn
        // );
        resolve(data);
      });
    });

  pushTrackedEntityInstance = (tei, program) =>
    push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker?async=false&program=${program}`,
      tei
    );

  postTrackedEntityInstance = async (tei) => {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker?async=false`,
      tei,
      "POST"
    );
  };

  postTrackedEntityInstances = async (teis) => {
    return await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker?async=false`,
      teis,
      "POST"
    );
  };

  putTrackedEntityInstance = async (tei, program) => {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/${tei.trackedEntity}?program=${program}`,
      tei,
      "PUT"
    );
  };

  pushEnrollment = (enrollment, program) =>
    push(
      this.baseUrl,
      this.username,
      this.password,
      [`/api/tracker?async=false`, program ? `&program=${program}` : null]
        .filter((e) => Boolean(e))
        .join(""),
      enrollment
    );

  pushEvents = (events) =>
    push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker?async=false`,
      events
    );

  deleteEvent = async (event) => {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker?importStrategy=DELETE&async=false`,
      event
    );
    return result.status == "OK";
  };

  deleteTei = async (tei) => {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker?importStrategy=DELETE`,
      tei
    );
    return result.status == "OK";
  };
}
