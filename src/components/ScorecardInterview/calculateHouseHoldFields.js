const countValue = (data, de_ids, value) => {
  const count = data.filter((item) => {
    return item[de_ids] === value;
  });
  return count.length;
};

const countValues = (data, de_ids, values = []) => {
  return data.reduce((acc, item) => {
    values.forEach((value, valueIndex) => {
      if (item[de_ids] === value) acc[valueIndex]++;
    });
    return acc;
  }, Array.from({ length: values.length }).fill(0));
};

const countValueForEachMember = (data, de_ids = [], value) => {
  return data.reduce(
    (acc, item, memberIndex) => {
      de_ids.forEach((de_id, deIndex) => {
        if (item[de_id] === value) acc[memberIndex][deIndex]++;
      });
      return acc;
    },
    Array.from({ length: data.length }).map(() => Array.from({ length: de_ids.length }).fill(0))
  );
};

// count number in range
const countRangeValue = (data, de_ids, min, max) => {
  const count = data.filter((item) => {
    // convert to number
    const itemValue = Number(item[de_ids]);
    return itemValue >= min && itemValue <= max;
  });
  return count.length;
};

export const calculateHouseHoldFields = (newData, interviewCascadeData, interviewData) => {
  //Score_Number of 4Ps Members
  newData["MQxRIx9bGdi"] = countValue(interviewCascadeData, "wxN2PuLymoY", "1");
  //Score_Number of IPs
  newData["qN11CGOlmok"] = countValue(interviewCascadeData, "OiOvGqVEyY9", "1");
  //Score_Number of PWDs
  //Score_Number of Philhealth Members
  newData["dR8u9RQeFFy"] = countValue(interviewCascadeData, "JjFcU1L7Ll1", "1");
  //Score_Number of Pregnant Women
  newData["TQ3aHbROh6S"] = countValue(interviewCascadeData, "ycBIHr9bYyw", "1");
  //Score_Number of women of reproductive age
  newData["fSfUdKcDszD"] = countValue(interviewCascadeData, "WbgQ0SZFiAU", "1");
  //Score_Number of eligible children
  newData["MJEA2zUcLU5"] = countRangeValue(interviewCascadeData, "Hc9Vgt4LXjb", 0, 4);
  //Score_Eligible Children 0-59 mos old
  newData["hMKNapnbCsL"] = countRangeValue(interviewCascadeData, "Hc9Vgt4LXjb", 0, 4);
  //Score_Eligible Children less than 6 mos old
  newData["XcSzUYAghmc"] = countRangeValue(interviewCascadeData, "RoSxLAB5cfo", 0, 5);
  //Score_Eligible Children 6-23 mos old
  newData["dCux2E2IbaS"] = countRangeValue(interviewCascadeData, "RoSxLAB5cfo", 6, 23);
  //Score_Eligible Children 24-59 mos old
  newData["kT9vaHCgFDZ"] = countRangeValue(interviewCascadeData, "RoSxLAB5cfo", 24, 59);

  //"Yes, if yes for any member of the HH
  // No, if no for any member and none of them reported yes
  // NA, if blank for all members"
  const mapDE = {
    EfmBmtzUDtA: "wqR0L5WGV6S",
    XyB2wZHVIl2: "cMg8stHS4aH",
    BRxB2mqlxtq: "AO4P3pcKqek",
    cCmfPA1ZimP: "ZkoIX2TigZA",
    F8HbucuMBPn: "zbbkBO029vE",
    lR5i8LamGQ2: "mT44qeiiVpv",
    crduQGHUdK3: "HK1uGfoC77d",
    sbKn8bylu58: "tQ9bxb0faAR",
    B7iS4fcJmoq: "nDlTfnM6GMU",
    wf68PYq7Loa: "L6IwuUPsbOT",
    l3vrPTVrY45: "jIAwnqn8GTU",
    ULshoKF1PfR: "AhH8CegcpvQ",
    d8YNAX1lDm6: "CBiTOMjcxNk",
    DFTA7Pmksoe: "hcFTBjB1VAT",
    cQj7wYS66HD: "p6NUCwXg99o",
    Kl5LLsA10rk: "EMHed4Yi7L6",
    XWVLpGEyr0e: "saTG1WrWtEW",
    pOaMwFxZFmw: "JoD2AagclsB",
    Xsi5z2a7JMY: "SMfz85dxBrG",
    sXCoUlbEULM: "YgK3LWUrA6f",
    kL0aNVBx5MS: "RLms3EMK6Lx",
    nVzXtXKKiGI: "zLJX0cTUhbU",
  };

  const yesNoNa = { YES: "1", NO: "0", NA: "NA" };
  Object.keys(mapDE).map((surveyDe) => {
    const HH_DE = mapDE[surveyDe];
    const [count_true, count_false] = countValues(interviewCascadeData, HH_DE, ["true", "false"]);

    if (count_true === 0 && count_false === 0) {
      newData[surveyDe] = yesNoNa.NA;
    } else if (count_false > 0 && count_true === 0) {
      newData[surveyDe] = yesNoNa.NO;
    } else {
      newData[surveyDe] = yesNoNa.YES;
    }
  });

  // Score_Adequate Diet Diversity Score kL0aNVBx5MS
  // CN_Child consumed dairy yesterday iiAjifuwYOE
  // CN_Child consumed eggs yesterday xbPC3AWgDrB
  // CN_Child consumed flesh foods yesterday hQgU2xbT2CL
  // CN_Child consumed grains yesterday aIMeDdwzVQQ
  // CN_Child consumed legumes yesterday nVFnpIJFBtP
  // CN_Consumed Vitamin A rich fruits and vegetables qfYU7s0EylE
  // CN_Consumed other fruits and vegetables ZxGgsjfOje1
  // Yes if all of these are yes for a member

  // const deIds = [
  //   "iiAjifuwYOE",
  //   "xbPC3AWgDrB",
  //   "hQgU2xbT2CL",
  //   "aIMeDdwzVQQ",
  //   "nVFnpIJFBtP",
  //   "qfYU7s0EylE",
  //   "ZxGgsjfOje1",
  // ];

  // let yes;
  // interviewCascadeData.forEach((memberData) => {
  //   if (deIds.every((id) => memberData[id] === "true")) yes = true;
  // });

  // if (yes) {
  //   newData["kL0aNVBx5MS"] = yesNoNa.YES;
  // } else if (newData["kL0aNVBx5MS"]) newData["kL0aNVBx5MS"] = undefined;

  // Score_Monitoring and Treatment for SAM/MAM/OB/OW	nVzXtXKKiGI	CN_Referred to any health facility for treatment	zLJX0cTUhbU.	Yes, if yes for any member of the HH
  if (countValue(interviewCascadeData, "zLJX0cTUhbU", "true") > 0) newData["nVzXtXKKiGI"] = yesNoNa.YES;

  // Score_Underweight / Severely Underweight	nOmBrSXim3l	CN_Weight for age	Wj1Re9XKW5P	Yes if any member has CN_Weight for age = Underweight OR Severely Underweight
  const [count_underweight, count_severely_underweight] = countValues(interviewCascadeData, "Wj1Re9XKW5P", ["2", "3"]);
  newData["nOmBrSXim3l"] = count_underweight > 0 || count_severely_underweight > 0 ? "true" : undefined;

  // Score_Stunted / Severely Stunted	sT4DDV1R8GB	CN_Length or Height for age	TON0hSWcaw7	Yes if any member has CN_Length or Height for age = Stunted OR Severely Stunted for any member of the HH
  const [count_stunted, count_severely_stunted] = countValues(interviewCascadeData, "TON0hSWcaw7", ["2", "3"]);
  newData["sT4DDV1R8GB"] = count_stunted > 0 || count_severely_stunted > 0 ? "true" : undefined;

  // Score_Wasted / Obese	Hx4Qt40JpnN	CN_Weight for height status	RXWSlNxAwq1	Yes if any member has CN_Weight for height status = Moderately wasted OR Severely wasted OR Overweight / Obese for any member of the HH
  const [count_moderately_wasted, count_severely_wasted, count_overweight_obese] = countValues(
    interviewCascadeData,
    "RXWSlNxAwq1",
    ["2", "3", "4"]
  );
  newData["Hx4Qt40JpnN"] =
    count_moderately_wasted > 0 || count_severely_wasted > 0 || count_overweight_obese > 0 ? "true" : undefined;

  // Score_Severe / moderate acute malnutrition	MCU0CCDKkwe	CN_MUAC finding	s3q2EVu3qe0	Yes if any member has CN_MUAC finding = Severe Acute Malnutrition (SAM) OR Moderate Acute Malnutriton (MAM) for any member of the HH
  const [count_sam, count_mam] = countValues(interviewCascadeData, "s3q2EVu3qe0", [
    "Severe Acute Malnutrition (SAM)",
    "Moderate Acute Malnutrition (MAM)",
  ]);
  newData["MCU0CCDKkwe"] = count_sam > 0 || count_mam > 0 ? "true" : undefined;

  // Pregnant women identified in the HH	LNTl0FjkMaD	HHM_Pregnancy status	ycBIHr9bYyw	"Yes, If any member has HHM_Pregnancy status = Yes
  const [count_pregnancy_status, count_pregnancy_status_2] = countValues(interviewCascadeData, "ycBIHr9bYyw", [
    "1",
    "2",
  ]);
  newData["LNTl0FjkMaD"] = count_pregnancy_status > 0 ? "true" : undefined;

  // Non-pregnant woman who recently gave birth within the last 28 days identified in the HH	yZXpvusfhSC	HHM_Pregnancy status	ycBIHr9bYyw	Yes, If any member has HHM_Pregnancy status = No, but recently gave birth within the last 28 days
  newData["yZXpvusfhSC"] = count_pregnancy_status_2 > 0 ? "true" : undefined;

  // Pregnant women identified in the HH	LNTl0FjkMaD	HHM_Pregnancy status	ycBIHr9bYyw	"Yes, If any member has HHM_Pregnancy status = Yes
  const count_menstrual_history = countValue(interviewCascadeData, "WbgQ0SZFiAU", "1");
  newData["usT2QWekRjm"] = count_menstrual_history > 0 ? "true" : undefined;

  // Child less than 5 yrs identified in the HH	Ud7pdtnOz0p	Age in years	Hc9Vgt4LXjb	Yes, if any member has Age in years < 5
  const count_age_lt_5 = countRangeValue(interviewCascadeData, "RoSxLAB5cfo", 0, 60);
  newData["Ud7pdtnOz0p"] = count_age_lt_5 > 0 ? "true" : undefined;

  const respondent = interviewCascadeData.find((item) => item?.["Cn37lbyhz6f"] === interviewData["SrFa2O3m6ff"]);

  if (respondent) {
    newData["lVOceUugk7C"] = respondent["OiOvGqVEyY9"];
    newData["TKSp7xKJEan"] = respondent["wxN2PuLymoY"];
    newData["nJ9peoKuLoX"] = respondent["JjFcU1L7Ll1"];
    newData["MKR5nlRe5EJ"] = respondent["NOKzq4dAKF7"];
    newData["WGqRCnEYzux"] = respondent["Wdg76PCqsBn"];
  }
};
