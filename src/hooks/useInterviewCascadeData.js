import { HOUSEHOLD_INTERVIEW_DATE_DE_ID, HOUSEHOLD_INTERVIEW_ID_DE_ID } from "@/constants/app-config";
import { differenceInYears } from "date-fns";
import { useSelector } from "react-redux";

const filterMalesMoreThan5 = (eventDate) => (member) => {
  const dateOfbirth = new Date(member["fJPZFs2yYJQ"]);
  const ageInYears = differenceInYears(eventDate, dateOfbirth);

  return member["Qt4YSwPxw0X"] == "2" && ageInYears > 5;
};

export const useInterviewCascadeData = (interviewData) => {
  const interviewId = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];

  const { currentInterviewCascade } = useSelector((state) => state.data.tei.data);

  const getInterviewCascadeData = () => {
    if (!currentInterviewCascade?.[interviewId]) return [];
    const memberData = currentInterviewCascade?.[interviewId].map((r) => {
      const isSaved = r.events.length > 0;

      return {
        ...r.memberData,
        isSaved,
      };
    });

    const eventDate = new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    // Filter
    const filteredMemberData = memberData.filter((member) => !filterMalesMoreThan5(eventDate)(member));

    return filteredMemberData;
  };

  const interviewCascadeData = getInterviewCascadeData();

  return { interviewCascadeData };
};
