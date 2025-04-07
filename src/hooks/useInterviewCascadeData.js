import { HOUSEHOLD_INTERVIEW_ID_DE_ID } from "@/constants/app-config";
import { useSelector } from "react-redux";

export const useInterviewCascadeData = (interviewData) => {
  const interviewId = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
  const { currentInterviewCascade } = useSelector(
    (state) => state.data.tei.data
  );

  const getInterviewCascadeData = () => {
    if (!currentInterviewCascade?.[interviewId]) return [];
    return currentInterviewCascade?.[interviewId].map((r) => r.memberData);
  };

  const interviewCascadeData = getInterviewCascadeData();

  return { interviewCascadeData };
};
