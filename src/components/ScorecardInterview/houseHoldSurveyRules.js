import { HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID } from "@/constants/app-config";
import { GOV_PROGRAMS_DE_ID, SOCIAL_AND_BEHAVIOR_DE_ID } from "../constants";
import { countRangeValue, countValue } from "./calculateHouseHoldFields";

export const hideSectionRules = (metadata, memberData, programMetadata) => {
  let shownSections = [];
  let hiddenSections = ["BhQveYSfLtE", "PYu2IlBP7vu", "wJ20JrVcQmh", "FHg89pCuFgU"];

  const pregnancyStatus = countValue(memberData, "ycBIHr9bYyw", "1");
  if (pregnancyStatus) {
    hiddenSections = hiddenSections.filter((h) => h !== "BhQveYSfLtE");
    shownSections.push("BhQveYSfLtE");
  }
  const within28days = countValue(memberData, "se8TXlLUzh8", "true");
  if (within28days) {
    hiddenSections = hiddenSections.filter((h) => h !== "PYu2IlBP7vu");
    shownSections.push("PYu2IlBP7vu");
  }
  const lessThan6Months = countRangeValue(memberData, "RoSxLAB5cfo", 0, 5);
  const lessThan26Weeks = countRangeValue(memberData, "Gds5wTiXoSK", 0, 26);
  if (lessThan6Months || lessThan26Weeks) {
    hiddenSections = hiddenSections.filter((h) => h !== "wJ20JrVcQmh");
    shownSections.push("wJ20JrVcQmh");
  }
  const form5to60Months = countRangeValue(memberData, "RoSxLAB5cfo", 6, 59);
  if (form5to60Months) {
    hiddenSections = hiddenSections.filter((h) => h !== "FHg89pCuFgU");
    shownSections.push("FHg89pCuFgU");
  }

  const hhSurveyStage = programMetadata.programStages.find((ps) => ps.id === HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID);

  if (hhSurveyStage) {
    hhSurveyStage.programStageSections.forEach((pss) => {
      if (hiddenSections.includes(pss.id)) {
        pss.dataElements.forEach((de) => {
          metadata[de.id].hidden = true;
        });
      }
      if (shownSections.includes(pss.id)) {
        pss.dataElements.forEach((de) => {
          metadata[de.id].hidden = false;
        });
      }
    });
  }
};

export const houseHoldSurveyRules = (metadata, newData) => {
  metadata[DEs.Q802].hidden = newData[DEs.Q801] !== "true";
  metadata[DEs.PleaseSpecifyTheOtherGovernment].hidden = newData["SKZZ4LQ7bWS"] !== "true";

  metadata[DEs.Q901].hidden = newData[DEs.Q900] !== "true";
  // SHOW 'Other social and behaviour Change (SBC) sessions' if 'social and behaviour Change (SBC) sessions (Q 901)' = 'Others'
  metadata["S6aWPoAIthD"].hidden = newData["qIS82s8psRN"] !== "true";

  // if Q801 = No, clear all data 802
  if (newData["dtTG7cjn1CH"] === "false" || !newData["dtTG7cjn1CH"]) {
    metadata[GOV_PROGRAMS_DE_ID].valueSet.forEach((option) => {
      newData[option.value] = null;
    });
  }

  // if Q900 = No, clear all data 801
  if (newData["dxag8YT8w46"] === "false" || !newData["dxag8YT8w46"]) {
    metadata[SOCIAL_AND_BEHAVIOR_DE_ID].valueSet.forEach((option) => {
      newData[option.value] = null;
    });
  }

  //(score 1) - MNu4naFgvBC - Option code 1, 2, 3, 4, 5 = Yes ; ELSE = No ; NULL = NA
  let score1 = newData["MNu4naFgvBC"];
  if (score1) {
    if (["1", "2", "3", "4", "5"].includes(score1)) {
      score1 = "true";
    } else {
      score1 = "false";
    }
  }

  //(score 2) - EeraoiUKKA6 - Option code 1, 2, 3, 4, 5, 6 = Yes ; ELSE = No ; NULL = NA
  let score2 = newData["EeraoiUKKA6"];
  if (score2) {
    if (["1", "2", "3", "4", "5", "6"].includes(score2)) {
      score2 = "true";
    } else {
      score2 = "false";
    }
  }

  //(score 3) - JOsQfzE5Lrl - Option code 1, 2 = Yes ; ELSE = No ; NULL = NA
  let score3 = newData["JOsQfzE5Lrl"];
  if (score3) {
    if (["1", "2"].includes(score3)) {
      score3 = "true";
    } else {
      score3 = "false";
    }
  }

  const yesNoNaToBool = (value) => {
    if (value === "1") return "true";
    if (value === "0") return "false";
    return null;
  };

  const yesNoNaListToBool = (values = []) => {
    if (values.filter((v) => v && v !== "NA").length === 0) return null;

    let value;
    values.forEach((v) => {
      if (v === "1") value = true;
    });

    if (value) return "true";
    return "false";
  };

  const score4 = newData["dxag8YT8w46"];
  const score5 = yesNoNaToBool(newData["EfmBmtzUDtA"]);
  const score6 = yesNoNaToBool(newData["BRxB2mqlxtq"]);
  const score7 = yesNoNaToBool(newData["wf68PYq7Loa"]);
  const score8 = yesNoNaListToBool([newData["l3vrPTVrY45"], newData["ULshoKF1PfR"]]);
  const score9 = yesNoNaToBool(newData["sbKn8bylu58"]);
  const score10 = yesNoNaToBool(newData["Kl5LLsA10rk"]);
  const score11 = yesNoNaListToBool([newData["Xsi5z2a7JMY"], newData["kL0aNVBx5M"]]);
  const score12 = yesNoNaToBool(newData["pOaMwFxZFmw"]);
  const score13 = yesNoNaToBool(newData["sXCoUlbEULM"]);
  const score14 = yesNoNaToBool(newData["nVzXtXKKiGI"]);

  const scores = [
    score1,
    score2,
    score3,
    score4,
    score5,
    score6,
    score7,
    score8,
    score9,
    score10,
    score11,
    score12,
    score13,
    score14,
  ];

  let finalScore;
  if (scores.filter((v) => v && v !== "NA").length === 0) {
    finalScore = "NA";
  } else {
    scores.forEach((score) => {
      if (score === "false") finalScore = "0";
    });
    // if none of scores = 0 => finalScore = "1"
    if (!finalScore) finalScore = "1";
  }

  newData["wrebGMGk0a2"] = finalScore;
};

const DEs = {
  Q801: "dtTG7cjn1CH",
  Q802: "RC5B8EETrOM",
  PleaseSpecifyTheOtherGovernment: "b918Rl73Eu0",
  Q900: "dxag8YT8w46",
  Q901: "gNBFmUFtW6a",
};
