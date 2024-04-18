import moment from "moment";

export const toDhis2Enrollments = (enrollments, events = []) => {
  return enrollments.map(
    ({
      enrollment,
      enrolledAt,
      enrollmentStatus,
      /*remove*/
      id,
      value,

      /*remain*/
      ...props
    }) => ({
      ...props,
      enrollment,
      enrolledAt: moment(enrolledAt).format("YYYY-MM-DD"),
      occurredAt: moment(enrolledAt).format("YYYY-MM-DD"),
      status: enrollmentStatus,
      events: events,
    })
  );
};
