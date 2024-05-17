import _ from "lodash";
import moment from "moment";
export const toDhis2Events = (events) => {
  let resEvents = _.groupBy(events, "event");

  return Object.entries(resEvents).map(([event, eventDataValues]) => {
    let dataValues = [];
    eventDataValues.map((e) => {
      dataValues.push({
        dataElement: e.dataElement,
        value: e.value,
      });
    });

    let {
      eventStatus,
      isOnline,
      program,
      orgUnit,
      enrollment,
      trackedEntity,
      occurredAt,
      dueDate,
      programStage,
      isDeleted,
    } = eventDataValues[0];

    return {
      event,
      eventStatus,
      isOnline,
      program,
      programStage,
      enrollment,
      orgUnit,
      trackedEntity,
      // relationships: relationships,
      occurredAt: moment(occurredAt).format("YYYY-MM-DD"),
      dueDate: moment(dueDate).format("YYYY-MM-DD"),
      dataValues: dataValues,
      // notes: notes,
      deleted: isDeleted,
    };
  });
};
