import moment from 'moment';

export const toDhis2Enrollments = (enrollments, events = []) => {
    return enrollments.map(
        ({
            enrollment,
            enrollmentDate,
            enrollmentStatus,
            /*remove*/
            id,
            value,

            /*remain*/
            ...props
        }) => ({
            ...props,
            enrollment,
            enrollmentDate: moment(enrollmentDate).format('YYYY-MM-DD'),
            status: enrollmentStatus,
            events: events,
        })
    );
};
