import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID,
} from "@/constants/app-config";
import { differenceInYears } from "date-fns";
import { is } from "date-fns/locale";
import { useSelector } from "react-redux";

const filterMalesMoreThan5 = (eventDate) => (member) => {
  const dateOfbirth = new Date(member["fJPZFs2yYJQ"]);
  const ageInYears = differenceInYears(eventDate, dateOfbirth);

  return member["Qt4YSwPxw0X"] == "2" && ageInYears > 5;
};

const filterFemalesIn10And49 = (eventDate) => (member) => {
  const dateOfbirth = new Date(member["fJPZFs2yYJQ"]);
  const ageInYears = differenceInYears(eventDate, dateOfbirth);

  return member["Qt4YSwPxw0X"] == "1" && ageInYears >= 10 && ageInYears <= 49;
};

const filterFemalesIn15And49 = (eventDate) => (member) => {
  const dateOfbirth = new Date(member["fJPZFs2yYJQ"]);
  const ageInYears = differenceInYears(eventDate, dateOfbirth);

  return member["Qt4YSwPxw0X"] == "1" && ageInYears >= 15 && ageInYears <= 49;
};

const filterFemailsSmallerThan10AndLargerThan49 = (eventDate) => (member) => {
  const dateOfbirth = new Date(member["fJPZFs2yYJQ"]);
  const ageInYears = differenceInYears(eventDate, dateOfbirth);

  return member["Qt4YSwPxw0X"] == "1" && (ageInYears < 10 || ageInYears > 49);
};

const filterChildrenUnder5 = (eventDate) => (member) => {
  const dateOfbirth = new Date(member["fJPZFs2yYJQ"]);
  const ageInYears = differenceInYears(eventDate, dateOfbirth);

  return ageInYears <= 5;
};

export const useInterviewCascadeData = (interviewData) => {
  const interviewId = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
  const { currentInterviewCascade, currentEvents } = useSelector((state) => state.data.tei.data);

  const getInterviewCascadeData = () => {
    if (!currentInterviewCascade?.[interviewId]) return [];

    const addSavedData = currentInterviewCascade?.[interviewId].map((r) => {
      const isSaved = r.events.length > 0;
      const eventDate = new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);
      const memberData = r.memberData;
      const ableToStart =
        !filterMalesMoreThan5(eventDate)(memberData) &&
        (filterFemalesIn10And49(eventDate)(memberData) || filterChildrenUnder5(eventDate)(memberData));

      return {
        ...r,
        memberData: {
          ...memberData,
          ableToStart,
          isSaved,
        },
      };
    });

    return addSavedData;
  };

  const interviewCascadeData = getInterviewCascadeData();
  const femalesIn15And49 =
    currentInterviewCascade?.[interviewId]?.filter((member) =>
      filterFemalesIn15And49(new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]))(member.memberData)
    ) || [];

  let isAllMemberEventsCompleted = true;
  interviewCascadeData?.forEach((member) => {
    if (member.memberData.ableToStart && member.memberData.status !== "COMPLETED") isAllMemberEventsCompleted = false;
  });

  const foundHHEvent = currentEvents.find(
    (e) =>
      e.programStage === HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID && e.dataValues[HOUSEHOLD_INTERVIEW_ID_DE_ID] === interviewId
  );

  if (!foundHHEvent || (foundHHEvent && foundHHEvent.status !== "COMPLETED")) isAllMemberEventsCompleted = false;

  return { interviewCascadeData, femalesIn15And49, isAllMemberEventsCompleted };
};
