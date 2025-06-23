import { MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID } from "@/constants/app-config";
import { getZScoreHFA, getZScoreWFA, getZScoreWFH } from "@/d2-tracker/dhis2.angular.services";
import { differenceInDays, differenceInMonths } from "date-fns";

export const handleZScore = (data, { ageInMonths, heightInCm, weight, gender }) => {
  // HFA status	TON0hSWcaw7
  const HFA_DE = "TON0hSWcaw7";

  // Normal	:1:	- 2 >= HFA = < 2
  // 	stunted	:2:	- 3 < HFA < -2
  // 	severely stunted 	:3:	HFA < -3
  // 	tall	:4:	HFA > 2
  const zScoreHFA = getZScoreHFA(ageInMonths, heightInCm, gender);
  if (zScoreHFA >= -2 && zScoreHFA < 2) {
    data[HFA_DE] = "1";
  }
  if (zScoreHFA < -2 && zScoreHFA > -3) {
    data[HFA_DE] = "2";
  }
  if (zScoreHFA < -3) {
    data[HFA_DE] = "3";
  }
  if (zScoreHFA > 2) {
    data[HFA_DE] = "4";
  }

  // WFA status	Wj1Re9XKW5P
  const WFA_DE = "Wj1Re9XKW5P";

  // Normal	:1:	- 2 >= WFA = < 2
  // underweight	:2:	- 3 < WFA < -2
  // Severely underweight	:3:	WFA < -3
  // overweight / obese	:4:	WFA > 2
  const zScoreWFA = getZScoreWFA(ageInMonths, weight, gender);
  if (zScoreWFA >= -2 && zScoreWFA < 2) {
    data[WFA_DE] = "1";
  }
  if (zScoreWFA < -2 && zScoreWFA > -3) {
    data[WFA_DE] = "2";
  }
  if (zScoreWFA < -3) {
    data[WFA_DE] = "3";
  }
  if (zScoreWFA > 2) {
    data[WFA_DE] = "4";
  }

  // WFH status	RXWSlNxAwq1
  const WFH_DE = "RXWSlNxAwq1";

  // Normal	:1:	- 2 >= WFH = < 2
  // moderately wasted	:2:	- 3 < WFH < -2
  // severely wasted	:3:	WFH < -3
  // overweight / obese	:4:	WFH > 2
  const zScoreWFH = getZScoreWFH(heightInCm, weight, gender);
  if (zScoreWFH >= -2 && zScoreWFH < 2) {
    data[WFH_DE] = "1";
  }
  if (zScoreWFH < -2 && zScoreWFH > -3) {
    data[WFH_DE] = "2";
  }
  if (zScoreWFH < -3) {
    data[WFH_DE] = "3";
  }
  if (zScoreWFH > 2) {
    data[WFH_DE] = "4";
  }
};

export const handleAgeFields = (metadata, { weeks, months, years }) => {
  const de_year = "Hc9Vgt4LXjb";
  const de_month = "RoSxLAB5cfo";
  const de_week = "Gds5wTiXoSK";
  const de_day = "ICbJBQoOsVt";

  metadata(de_year).disabled = true;
  metadata(de_month).disabled = true;
  metadata(de_week).disabled = true;
  metadata(de_day).disabled = true;

  // if (weeks < 0) {
  //   metadata(de_year).hidden = true;
  //   metadata(de_month).hidden = true;
  //   metadata(de_week).hidden = true;
  //   metadata(de_day).hidden = false;
  // } else if (weeks > 0 && years < 1) {
  //   metadata(de_year).hidden = true;
  //   metadata(de_month).hidden = true;
  //   metadata(de_week).hidden = false;
  //   metadata(de_day).hidden = true;
  // } else if (years >= 1 || years < 2) {
  //   metadata(de_year).hidden = true;
  //   metadata(de_month).hidden = false;
  //   metadata(de_week).hidden = true;
  //   metadata(de_day).hidden = true;
  // } else if (years >= 2) {
  //   metadata(de_year).hidden = false;
  //   metadata(de_month).hidden = true;
  //   metadata(de_week).hidden = true;
  //   metadata(de_day).hidden = true;
  // }
};

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

export const handleAgeDatavaluesOfEvents = (data, { days, weeks, months, years }) => {
  const daysDE = "ICbJBQoOsVt";
  const weeksDE = "Gds5wTiXoSK";
  const monthsDE = "RoSxLAB5cfo";
  const yearsDE = "Hc9Vgt4LXjb";

  data[daysDE] = "";
  data[weeksDE] = "";
  data[monthsDE] = "";
  data[yearsDE] = "";

  data[daysDE] = days;
  data[weeksDE] = weeks;
  data[monthsDE] = months;
  data[yearsDE] = years;
};

export const demographicDetailRules = (metadata, data, { years }) => {
  // Menstrual history should be NA (option code 3) for females under 10 and older than 49
  if (years < 10 || years > 49) {
    data["WbgQ0SZFiAU"] = "3";
    metadata("WdnS7uGEKJT").hidden = true;
  }

  //"Pregnancy status (DE UID: ycBIHr9bYyw) == 2
  // Show Recently gave birth within 28 days (DE UID: se8TXlLUzh8)"
  metadata("se8TXlLUzh8").hidden = data["ycBIHr9bYyw"] !== "2";

  // Recently gave birth within 28 days (DE UID: se8TXlLUzh8) == true
  // Show Date of delivery (DE UID: rvv5Hfyczyh)
  metadata("rvv5Hfyczyh").hidden = data["se8TXlLUzh8"] !== "true";

  // Menstrual history should be NA for males and questions on LMP, pregnancy status should be hidden
  if (data["Qt4YSwPxw0X"] === "2" || data["WbgQ0SZFiAU"] === "3") {
    metadata("qlt8LOSENj8").hidden = true;
    metadata("ycBIHr9bYyw").hidden = true;
    data["WbgQ0SZFiAU"] = "3";
  } else {
    metadata("qlt8LOSENj8").hidden = false;
    metadata("ycBIHr9bYyw").hidden = false;
  }

  if (data["WbgQ0SZFiAU"] !== "1") metadata("ycBIHr9bYyw").hidden = true;

  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  if (data["OiOvGqVEyY9"] === "2" || data["OiOvGqVEyY9"] === "3") {
    metadata("g276qF2fXHi").hidden = true;
  } else {
    metadata("g276qF2fXHi").hidden = false;
  }

  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  metadata("qlt8LOSENj8").hidden = data["WbgQ0SZFiAU"] !== "1";

  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  metadata("g276qF2fXHi").hidden = data["OiOvGqVEyY9"] !== "1";

  // 4Ps Household ID number	Only show when '4Ps membership' = Yes / 1
  const psMembership = data["wxN2PuLymoY"];
  metadata("CEF6Dkpe2jW").hidden = psMembership !== "1";

  // Hide Philhealth ques for child <5 y (0-59 mo)
  metadata("JjFcU1L7Ll1").hidden = !(years > 5);

  // PHIC ID	Only show when 'PHIC membership' = Yes / 1
  const PhiCMembership = data["JjFcU1L7Ll1"];

  // 12-123456789-1
  // metadata("Yp6gJAdu4yX").valueType = "MASK";
  // metadata("Yp6gJAdu4yX").pattern = /^\D{2}+$/;
  metadata("Yp6gJAdu4yX").hidden = PhiCMembership !== "1" || !(years > 5);
};

export const childHeathRules = (metadata, data, { months, years }, code, CHILD_VACCINES) => {
  if (years > 5) {
    return;
  }

  //Data Saving validation
  metadata("EMHed4Yi7L6").disabled = true;
  CHILD_VACCINES.list.forEach((item) => {
    if (item.vaccineMonth.start > months) {
      metadata(item.ids.vaccineDone).hidden = true;
      metadata(item.ids.vaccineDate).hidden = true;
      metadata(item.ids.discrepancy).hidden = true;
    }
    if (data[item.ids.vaccineDone] == "false") {
      metadata(item.ids.vaccineDate).disabled = true;
    }
    //bypass
    metadata(item.ids.discrepancy).disabled = true;
  });

  //For checking discrepancy
  const vaccineDateDetails = CHILD_VACCINES.list.find((vaccine) => vaccine.ids.vaccineDate == code);

  if (vaccineDateDetails) {
    const dateOfBirth = new Date(data["fJPZFs2yYJQ"]);
    const vaccineDate = new Date(data[code]);

    if (vaccineDateDetails.age.type == "days") {
      const days = differenceInDays(vaccineDate, dateOfBirth);
      if (data[code] && days > vaccineDateDetails.age.value) {
        data[vaccineDateDetails.ids.discrepancy] = true;
      } else {
        data[vaccineDateDetails.ids.discrepancy] = "";
      }
    } else if (vaccineDateDetails.age.type == "month") {
      const months = differenceInMonths(vaccineDate, dateOfBirth);
      if (data[code] && months > vaccineDateDetails.age.value) {
        data[vaccineDateDetails.ids.discrepancy] = true;
      } else {
        data[vaccineDateDetails.ids.discrepancy] = "";
      }
    }
  }

  //For disabling vaccine Date
  const vaccineDoneDetails = CHILD_VACCINES.list.find((vaccine) => vaccine.ids.vaccineDone == code);

  if (vaccineDoneDetails) {
    if (data[vaccineDoneDetails.ids.vaccineDone] == "true") {
      if (!data[vaccineDoneDetails.ids.vaccineDate]) {
        data[vaccineDoneDetails.ids.discrepancy] = "";
      }
      metadata(vaccineDoneDetails.ids.vaccineDate).disabled = false;
    } else if (data[vaccineDoneDetails.ids.vaccineDone] == "false") {
      data[vaccineDoneDetails.ids.vaccineDate] = "";
      data[vaccineDoneDetails.ids.discrepancy] = true;
      metadata(vaccineDoneDetails.ids.vaccineDate).disabled = true;
    }
  }

  const VaccineDoneList = CHILD_VACCINES.list.filter((vaccine) => data[vaccine.ids.vaccineDone] == "true");
  const vaccineDiscrepency = CHILD_VACCINES.list.filter((vaccine) => data[vaccine.ids.discrepancy]);
  //Rule Prority 2
  if (VaccineDoneList.length) data["EMHed4Yi7L6"] = "true";
  //Rule Prority 1
  if (vaccineDiscrepency.length) data["EMHed4Yi7L6"] = "false";

  if (data["XhrgV4nfrRK"] || data["kzaCPuPzy6o"]) {
    metadata("Lp9Y5Z5P78t").disabled = true;
    metadata("DHXhabUfBHA").disabled = true;
  }
  if (data["mSfZRdFRWdh"] || data["PQS3vSrsIBO"]) {
    metadata("zQK0SZQ7Dot").disabled = true;
    metadata("i4gomCWd0y9").disabled = true;
  }
  if (data["eXwMBOUSwuB"] || data["EhIlZ6OO8Fu"]) {
    metadata("IjbZlh5uehM").disabled = true;
    metadata("ew3lMYvyfeV").disabled = true;
  }
  if (data["Lp9Y5Z5P78t"] || data["DHXhabUfBHA"]) {
    metadata("XhrgV4nfrRK").disabled = true;
    metadata("zqDWAyTTTDd").disabled = true;
  }
  if (data["zQK0SZQ7Dot"] || data["i4gomCWd0y9"]) {
    metadata("mSfZRdFRWdh").disabled = true;
    metadata("PQS3vSrsIBO").disabled = true;
  }
  if (data["IjbZlh5uehM"] || data["ew3lMYvyfeV"]) {
    metadata("eXwMBOUSwuB").disabled = true;
    metadata("EhIlZ6OO8Fu").disabled = true;
  }
};

const DEs = {
  Q511: "RXWSlNxAwq1",
  Q512: "zLJX0cTUhbU",
};

export const childNutritionRules = (metadata, data, { months, years }) => {
  switch (data[DEs.Q511]) {
    case "1":
      metadata(DEs.Q512).hidden = true;
      break;
    case "2":
    case "3":
    case "4":
      metadata(DEs.Q512).hidden = false;
      break;
    default:
      metadata(DEs.Q512).hidden = true;
      break;
  }

  // CN - child exclusively breastfed in the last 24 hours (Q 501)	child age less than 6 months
  metadata("SMfz85dxBrG").hidden = months > 6;
  // CN - child consumed breastmilk yesterday	child age 6-23 mos
  metadata("YJEM6K4r8B6").hidden = months < 6 || months > 23;
  // CN - child consumed grains yesterday	child age 6-23 mos
  metadata("aIMeDdwzVQQ").hidden = months < 6 || months > 23;
  // CN - child consumed legumes yesterday	child age 6-23 mos
  metadata("nVFnpIJFBtP").hidden = months < 6 || months > 23;
  // CN - child consumed dairy yesterday	child age 6-23 mos
  metadata("iiAjifuwYOE").hidden = months < 6 || months > 23;
  // CN - child consumed flesh foods yesterday	child age 6-23 mos
  metadata("hQgU2xbT2CL").hidden = months < 6 || months > 23;
  // CN - child consumed eggs yesterday	child age 6-23 mos
  metadata("xbPC3AWgDrB").hidden = months < 6 || months > 23;
  // CN - child consumed vitamin A rich fruits and vegetables yesterday	child age 6-23 mos
  metadata("qfYU7s0EylE").hidden = months < 6 || months > 23;
  // CN - child consumed other fruits and vegetables yesterday	child age 6-23 mos
  metadata("ZxGgsjfOje1").hidden = months < 6 || months > 23;
  // CN - child given micronutrient powder (Q 503)	child age 6-23 mos
  metadata("saTG1WrWtEW").hidden = months < 6 || months > 23;
  // CN - child given Vitamin A (Q 504)	child age 6-59 mos
  metadata("JoD2AagclsB").hidden = months < 6 || months > 59;
  // CN - child's weight and height measured during Operation Timbang (Q 505)	Child < 5 y
  metadata("eoSzVJd8ofS").hidden = years > 5;
  // CN - child's weight and height monitored (Q 506)	Child < 5 y
  metadata("YgK3LWUrA6f").hidden = years > 5;
  // CN - follow up monitoring date (Q 507A)	Child < 5 y
  metadata("uYWxyRYP7GN").hidden = years > 5;
  // CN - Child weight (in kgs) (Q 507B)	Child < 5 y
  metadata("iFiOPAxrJIF").hidden = years > 5;
  // CN - Weight for age (Q 508)	Child < 5 y
  metadata("Wj1Re9XKW5P").hidden = years > 5;
  // CN - Child's length or height (in cms) (Q 509)	Child < 5 y
  metadata("CY4OTulUceX").hidden = years > 5;
  // CN - Length or Height for age (Q 510)	Child < 5 y
  metadata("TON0hSWcaw7").hidden = years > 5;
  // CN - Weight for height status (Q 511)	Child < 5 y
  metadata("RXWSlNxAwq1").hidden = years > 5;
  // CN - MUAC findings	Child < 5 y
  metadata("s3q2EVu3qe0").hidden = years > 5 || months < 6;
  // CN - MUAC (cm)	Child < 5 y
  metadata("sCOCt8eF0Fr").hidden = years > 5 || months < 6;
  // Mother's member ID number
  metadata("q0WEgMBwi0p").hidden = years > 5;

  // If CN_MUAC (cm) < 11.5 cm ; CN_MUAC findings = Severe Acute Malnutrition (SAM)
  // If CN_MUAC (cm) >= 11.5 AND < 12.5 cm ; CN_MUAC findings = Moderate Acute Malnutrition (MAM)
  // if CN_MUAC (cm) >= 12.5 cm ; CN_MUAC findings = Normal

  const cm = +data["sCOCt8eF0Fr"];

  // should not accept values less than 5.0 and more than 26.5. Show warning otherwise.
  if (cm < 5.0 || cm > 26.5) {
    metadata("sCOCt8eF0Fr").error = "Please enter a value between 5.0 and 26.5";
  } else {
    metadata("sCOCt8eF0Fr").error = "";
  }

  if (cm > 0 && cm < 11.5) {
    data["s3q2EVu3qe0"] = "Severe Acute Malnutrition (SAM)";
  } else if (cm >= 11.5 && cm < 12.5) {
    data["s3q2EVu3qe0"] = "Moderate Acute Malnutrition (MAM)";
  } else if (cm >= 12.5) {
    data["s3q2EVu3qe0"] = "Normal";
  }

  // For age >23 months, hide data element Adequate Diet Diversity
  metadata("RLms3EMK6Lx").hidden = months > 23 || months < 6;

  // adequate diet diversity (ADD)
  // For children 6–23 months the ADD is yes if the child was breastfed in the last 24 hours and consumed at least 5 of the 7 food group
  // , which means - (Q 502 (A) = Yes AND (SUM of below 7 data elements > 4))
  const deIds = [
    "iiAjifuwYOE",
    "xbPC3AWgDrB",
    "hQgU2xbT2CL",
    "aIMeDdwzVQQ",
    "nVFnpIJFBtP",
    "qfYU7s0EylE",
    "ZxGgsjfOje1",
  ];

  const countOfTrue = deIds.reduce((acc, id) => {
    if (data[id] === "true") {
      acc++;
    }
    return acc;
  }, 0);

  // For Children less than 6 mos, the ADD is yes if (Q501=Yes),
  if (months >= 6 && months <= 23) {
    if (data["YJEM6K4r8B6"] === "true" && countOfTrue > 4) {
      data["RLms3EMK6Lx"] = "true";
    }

    if (data["YJEM6K4r8B6"] == "false" || countOfTrue < 5) {
      data["RLms3EMK6Lx"] = "false";
    }
  }
};

export const hideSectionRules = (metadata, data, programMetadataMember, { years, months }) => {
  let shownSections = [];
  let hiddenSections = [
    "IxbqFSJPfEN",
    "A2TBfLOW8HG",
    "tlNWZDOWfP2",
    "jV8O1ZITgIn",
    "E4FpYkBzAsW",
    "fVGAPxIFZoO",
    "Nh4Bqjoopm3",
  ];

  const pregnancyStatus = data["ycBIHr9bYyw"];
  if (pregnancyStatus === "1") {
    hiddenSections = hiddenSections.filter((h) => h !== "IxbqFSJPfEN");
    shownSections.push("IxbqFSJPfEN");
  }
  if (pregnancyStatus === "2" && data["se8TXlLUzh8"] === "true") {
    hiddenSections = hiddenSections.filter((h) => h !== "A2TBfLOW8HG");
    shownSections.push("A2TBfLOW8HG");

    hiddenSections = hiddenSections.filter((h) => h !== "fVGAPxIFZoO");
    shownSections.push("fVGAPxIFZoO");
  }

  if (years < 5) {
    hiddenSections = hiddenSections.filter((s) => s !== "tlNWZDOWfP2" || s !== "jV8O1ZITgIn");
    shownSections.push("tlNWZDOWfP2");
    shownSections.push("jV8O1ZITgIn");
  } else {
    hiddenSections = hiddenSections.filter((s) => s !== "Nh4Bqjoopm3");
    shownSections.push("Nh4Bqjoopm3");
  }

  const sex = data["Qt4YSwPxw0X"];
  if (years >= 10 && years <= 49 && sex === "1" && (pregnancyStatus === "3" || data["se8TXlLUzh8"] === "false")) {
    hiddenSections = hiddenSections.filter((h) => h !== "E4FpYkBzAsW");
    shownSections.push("E4FpYkBzAsW");
  }

  programMetadataMember.programStages.forEach((ps) => {
    ps.programStageSections.forEach((pss) => {
      if (hiddenSections.includes(pss.id)) {
        pss.dataElements.forEach((de) => {
          metadata(de.id).hidden = true;
        });
      }
      if (shownSections.includes(pss.id)) {
        pss.dataElements.forEach((de) => {
          metadata(de.id).hidden = false;
        });
      }
    });
  });

  metadata("khD9FKDEw7k").hidden = true;
  if (months >= 6 && months <= 23) {
    metadata("khD9FKDEw7k").hidden = false;
  }
};
