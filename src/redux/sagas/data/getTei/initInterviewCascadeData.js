import { put, select } from "redux-saga/effects";
import { getCascadeSuccess, getInterviewCascadeSuccess } from "../../../actions/data/tei";

import _ from "lodash";
import moment from "moment";
import { HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID, HOUSEHOLD_INTERVIEW_ID_DE_ID } from "@/constants/app-config";

// construct data for family form Teis and Events
function* initInterviewCascadeDataFromTEIsEvents(payload) {
  if (!payload) return [];

  console.log("initInterviewCascadeDataFromTEIsEvents", { payload });

  let currentInterviewCascade = {};

  const currentEvents = yield select((state) => state.data.tei.data.currentEvents);

  const interviewDetailEvents = currentEvents.filter(
    (e) => e.programStage === HOUSEHOLD_INTERVIEW_DETAILS_PROGRAM_STAGE_ID,
  );

  const memberTEIsWithEvents = payload ? payload.instances : [];

  interviewDetailEvents.forEach((e) => {
    const interviewId = e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID];

    if (interviewId) {
      currentInterviewCascade[interviewId] = memberTEIsWithEvents.reduce((cas, tei) => {
        const enr = tei.enrollments[0];

        if (!enr) return cas;

        const events = enr.events.filter((e) => {
          const eventInterview = e.dataValues.find((dv) => dv.dataElement === HOUSEHOLD_INTERVIEW_ID_DE_ID)?.value;

          return eventInterview === interviewId;
        });

        const theTEI = {
          memberData: {
            id: tei.trackedEntity,
            enrId: enr.enrollment,
            enrolledAt: enr.enrolledAt,
            updatedAt: tei.updatedAt,
          },
          events,
        };

        tei.attributes.forEach((attr) => {
          theTEI.memberData[attr.attribute] = attr.value;
        });

        events.forEach((event) => {
          event.dataValues.forEach((de) => {
            const key = de.dataElement;
            const value = de.value;

            theTEI.memberData[key] = value;
          });

          theTEI.memberData.status = event.status;
        });

        cas.push(theTEI);

        return cas;
      }, []);
    }
  });

  process.env.NODE_ENV &&
    console.log("currentInterviewCascade", {
      currentInterviewCascade,
      memberTEIsWithEvents,
    });

  yield put(
    getInterviewCascadeSuccess({
      currentInterviewCascade,
    }),
  );
}

export default initInterviewCascadeDataFromTEIsEvents;
