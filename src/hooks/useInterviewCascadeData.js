import { HOUSEHOLD_INTERVIEW_ID_DE_ID } from "@/constants/app-config";
import { useSelector } from "react-redux";

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

    return memberData;
  };

  const interviewCascadeData = getInterviewCascadeData();

  return { interviewCascadeData };
};
