export const handleAgeAttrsOfTEI = (data, { days, weeks, months, years }) => {
  const daysAttr = "d2n5w4zpxuo";
  const weeksAttr = "xDSSvssuNFs";
  const monthsAttr = "X2Oln1OyP5o";
  const yearsAttr = "H42aYY9JMIR";

  data[daysAttr] = "";
  data[weeksAttr] = "";
  data[monthsAttr] = "";
  data[yearsAttr] = "";

  if (weeks === 0) {
    data[daysAttr] = days;
  } else if (months === 0) {
    data[weeksAttr] = weeks;
  } else if (years === 0 || years < 5) {
    data[monthsAttr] = months;
  } else if (years >= 5) {
    data[yearsAttr] = years;
  }
};

export const hhMemberRules = (metadata, data, { years }) => {
  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  metadata["g276qF2fXHi"].hidden = data["OiOvGqVEyY9"] !== "1";

  // 4Ps Household ID number	Only show when '4Ps membership' = Yes / 1
  const psMembership = data["wxN2PuLymoY"];
  metadata["CEF6Dkpe2jW"].hidden = psMembership !== "1";

  // Hide Philhealth ques for child <5 y (0-59 mo)
  metadata["JjFcU1L7Ll1"].hidden = !(years > 5);

  // PHIC ID	Only show when 'PHIC membership' = Yes / 1
  const PhiCMembership = data["JjFcU1L7Ll1"];

  // 12-123456789-1
  // metadata["Yp6gJAdu4yX"].valueType = "MASK";
  // metadata["Yp6gJAdu4yX"].pattern = /^\D{2}+$/;
  metadata["Yp6gJAdu4yX"].hidden = PhiCMembership !== "1" || !(years > 5);

  // Mother's member ID number
  metadata["q0WEgMBwi0p"].hidden = years > 5;
};
