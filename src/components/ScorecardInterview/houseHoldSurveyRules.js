import { GOV_PROGRAMS_DE_ID, SOCIAL_AND_BEHAVIOR_DE_ID } from "../constants";

export const houseHoldSurveyRules = (metadata, newData) => {
  metadata[DEs.Q802].hidden = newData[DEs.Q801] !== "true";
  metadata[DEs.PleaseSpecifyTheOtherGovernment].hidden = newData[DEs.Q802] !== "Others";

  metadata[DEs.Q901].hidden = newData[DEs.Q900] !== "true";
  // SHOW 'Other social and behaviour Change (SBC) sessions' if 'social and behaviour Change (SBC) sessions (Q 901)' = 'Others'
  metadata["S6aWPoAIthD"].hidden = newData["gNBFmUFtW6a"] !== "5";

  // if Q801 = No, clear all data 802
  if (newData["dtTG7cjn1CH"] === "false" || !newData["dtTG7cjn1CH"]) {
    metadata[GOV_PROGRAMS_DE_ID].valueSet.forEach((option) => {
      newData[option.trueOnlyDeId] = null;
    });
  }

  // if Q900 = No, clear all data 801
  if (newData["dxag8YT8w46"] === "false" || !newData["dxag8YT8w46"]) {
    metadata[SOCIAL_AND_BEHAVIOR_DE_ID].valueSet.forEach((option) => {
      newData[option.trueOnlyDeId] = null;
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
    if (values.filter(Boolean).filter((v) => v !== "NA").length === 0) return null;

    let value;
    values.forEach((value) => {
      if (value) {
        if (value === "1") value = true;
      }
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
  if (scores.filter(Boolean).length === 0) {
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
