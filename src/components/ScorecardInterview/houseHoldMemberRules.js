import { MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID } from "@/constants/app-config";

export const handleAgeFields = (metadata, { weeks, months, years }) => {
  metadata["Hc9Vgt4LXjb"].disabled = true;
  metadata["RoSxLAB5cfo"].disabled = true;
  metadata["Gds5wTiXoSK"].disabled = true;
  metadata["ICbJBQoOsVt"].disabled = true;

  if (weeks === 0) {
    metadata["Hc9Vgt4LXjb"].hidden = true;
    metadata["RoSxLAB5cfo"].hidden = true;
    metadata["Gds5wTiXoSK"].hidden = true;
    metadata["ICbJBQoOsVt"].hidden = false;
  } else if (months === 0) {
    metadata["Hc9Vgt4LXjb"].hidden = true;
    metadata["RoSxLAB5cfo"].hidden = true;
    metadata["Gds5wTiXoSK"].hidden = false;
    metadata["ICbJBQoOsVt"].hidden = true;
  } else if (years === 0 || years < 5) {
    metadata["Hc9Vgt4LXjb"].hidden = true;
    metadata["RoSxLAB5cfo"].hidden = false;
    metadata["Gds5wTiXoSK"].hidden = true;
    metadata["ICbJBQoOsVt"].hidden = true;
  } else if (years > 5) {
    metadata["Hc9Vgt4LXjb"].hidden = false;
    metadata["RoSxLAB5cfo"].hidden = true;
    metadata["Gds5wTiXoSK"].hidden = true;
    metadata["ICbJBQoOsVt"].hidden = true;
  }
};

export const demographicDetailRules = (metadata, data, { years }) => {
  // Menstrual history should be NA (option code 3) for females under 10 and older than 49
  if (years < 10 || years > 49) data["WbgQ0SZFiAU"] = "3";

  // Menstrual history should be NA for males and questions on LMP, pregnancy status should be hidden
  if (data["Qt4YSwPxw0X"] === "2" || data["WbgQ0SZFiAU"] === "3") {
    metadata["qlt8LOSENj8"].hidden = true;
    metadata["ycBIHr9bYyw"].hidden = true;
    data["WbgQ0SZFiAU"] = "3";
  } else {
    metadata["qlt8LOSENj8"].hidden = false;
    metadata["ycBIHr9bYyw"].hidden = false;
  }

  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  if (data["OiOvGqVEyY9"] === "2" || data["OiOvGqVEyY9"] === "3") {
    metadata["g276qF2fXHi"].hidden = true;
    metadata["wxN2PuLymoY"].hidden = true;
  } else {
    metadata["g276qF2fXHi"].hidden = false;
    metadata["wxN2PuLymoY"].hidden = false;
  }

  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  if (data["WbgQ0SZFiAU"] !== "1") {
    metadata["qlt8LOSENj8"].hidden = true;
  } else {
    metadata["qlt8LOSENj8"].hidden = false;
  }

  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  if (data["OiOvGqVEyY9"] !== "1") {
    metadata["g276qF2fXHi"].hidden = true;
  } else {
    metadata["g276qF2fXHi"].hidden = false;
  }

  // 4Ps Household ID number	Only show when '4Ps membership' = Yes / 1
  const psMembership = data["wxN2PuLymoY"];
  if (psMembership !== "1") {
    metadata["CEF6Dkpe2jW"].hidden = true;
  } else {
    metadata["CEF6Dkpe2jW"].hidden = false;
  }

  // PHIC ID	Only show when 'PHIC membership' = Yes / 1
  const PhiCMembership = data["JjFcU1L7Ll1"];
  if (PhiCMembership !== "1") {
    metadata["Yp6gJAdu4yX"].hidden = true;
  } else {
    metadata["Yp6gJAdu4yX"].hidden = false;
  }
};

export const childHeathRules = (metadata, data, { months, years }) => {
  if (years > 5) {
    return;
  }

  // CH - BCG vaccine date	If 'CH - BCG vaccine given' = Yes
  metadata["K37pq3b5Qra"].hidden = data["v98slN2SMpf"] !== "true";
  // CH - Pentavalent 1 vaccine date	If 'CH - Pentavalent 1 vaccine given' = Yes
  metadata["kzaCPuPzy6o"].hidden = data["XhrgV4nfrRK"] !== "true";
  // CH - Pentavalent 2 vaccine date	If 'CH - Pentavalent 2 vaccine given' = Yes
  metadata["PQS3vSrsIBO"].hidden = data["mSfZRdFRWdh"] !== "true";
  // CH - Pentavalent 3 vaccine date	If 'CH - Pentavalent 3 vaccine given' = Yes
  metadata["EhIlZ6OO8Fu"].hidden = data["eXwMBOUSwuB"] !== "true";
  // CH - Hepatitis B vaccine date	If 'CH - Hepatitis B vaccine given' = Yes
  metadata["bsPGbR6F18a"].hidden = data["AF4aauVCm9B"] !== "true";
  // CH - IPV 1 vaccine date	If 'CH - IPV 1 vaccine given' = Yes
  metadata["LE5EQiIK7Lz"].hidden = data["YkaEO9PDBvy"] !== "true";
  // CH - IPV 2 vaccine date	If 'CH - IPV 2 vaccine given' = Yes
  metadata["WfeWZFMoy6E"].hidden = data["tkOnbJSiKXy"] !== "true";
  // CH - HEXA 1 vaccine date	If 'CH - HEXA 1 vaccine given' = Yes
  metadata["DHXhabUfBHA"].hidden = data["Lp9Y5Z5P78t"] !== "true";
  // CH - HEXA 2 vaccine date	If 'CH - HEXA 2 vaccine given' = Yes
  metadata["i4gomCWd0y9"].hidden = data["zQK0SZQ7Dot"] !== "true";
  // CH - HEXA 3 vaccine date	If 'CH - HEXA 3 vaccine given' = Yes
  metadata["ew3lMYvyfeV"].hidden = data["IjbZlh5uehM"] !== "true";
  // CH - OPV 1 vaccine date	If 'CH - OPV 1 vaccine given' = Yes
  metadata["EH1L3NCv2tC"].hidden = data["uxGX9k4mJ51"] !== "true";
  // CH - OPV 2 vaccine date	If 'CH - OPV 2 vaccine given' = Yes
  metadata["AVpmlIXDUmW"].hidden = data["l48paDcsu9Y"] !== "true";
  // CH - OPV 3 vaccine date	If 'CH - OPV 3 vaccine given' = Yes
  metadata["qD6ZrhRMGjk"].hidden = data["v6emyxZlDds"] !== "true";
  // CH - PCV 1 vaccine date	If 'CH - PCV 1 vaccine given' = Yes
  metadata["By0qcLTxEPN"].hidden = data["g7do0N1hjSt"] !== "true";
  // CH - PCV 2 vaccine date	If 'CH - PCV 2 vaccine given' = Yes
  metadata["d5WhzyidsX8"].hidden = data["gY3CmzKjYL7"] !== "true";
  // CH - PCV 3 vaccine date	If 'CH - PCV 3 vaccine given' = Yes
  metadata["jnumk6j4OJ3"].hidden = data["e42qQtK3tRM"] !== "true";
  // CH - MMR 1 or MCV 1 or any measles-containing vaccine date	If 'CH - MMR 1 or MCV 1 or any measles-containing vaccine given' = Yes
  metadata["NL22zOZXlvb"].hidden = data["r3zAoTxKpTt"] !== "true";
  // CH - MMR 2 or MCV 2 vaccine date	If 'CH - MMR 2 or MCV 2 vaccine given' = Yes
  metadata["vxIQzyyUq1M"].hidden = data["tQbe491SjPw"] !== "true";

  // show / hide vaccines
  // Pentavalent 1 vaccine given	Hide when age in months < 1 month
  metadata["XhrgV4nfrRK"].hidden = months < 1;
  // Pentavalent 2 vaccine given	Hide when age in months < 2 month
  metadata["mSfZRdFRWdh"].hidden = months < 2;
  // Pentavalent 3 vaccine given	Hide when age in months < 3 month
  metadata["eXwMBOUSwuB"].hidden = months < 3;
  // IPV 1 vaccine given	Hide when age in months < 3 month
  metadata["YkaEO9PDBvy"].hidden = months < 3;
  // IPV 2 vaccine given	Hide when age in months < 9 month
  metadata["tkOnbJSiKXy"].hidden = months < 9;
  // HEXA 1 vaccine given	Hide when age in months < 2 month
  metadata["Lp9Y5Z5P78t"].hidden = months < 2;
  // HEXA 2 vaccine given	Hide when age in months < 3 month
  metadata["zQK0SZQ7Dot"].hidden = months < 3;
  // HEXA 3 vaccine given	Hide when age in years < 1 year
  metadata["IjbZlh5uehM"].hidden = years < 1;
  // OPV 1 vaccine given	Hide when age in months < 1 month
  metadata["uxGX9k4mJ51"].hidden = months < 1;
  // OPV 2 vaccine given	Hide when age in months < 2 month
  metadata["l48paDcsu9Y"].hidden = months < 2;
  // OPV 3 vaccine given	Hide when age in months < 3 month
  metadata["v6emyxZlDds"].hidden = months < 3;
  // PCV 1 vaccine given	Hide when age in months < 1 month
  metadata["g7do0N1hjSt"].hidden = months < 1;
  // PCV 2 vaccine given	Hide when age in months < 2 month
  metadata["gY3CmzKjYL7"].hidden = months < 2;
  // PCV 3 vaccine given	Hide when age in months < 3 month
  metadata["e42qQtK3tRM"].hidden = months < 3;
  // MMR 1 or MCV 1 or any measles-containing vaccine given	Hide when age in months < 9 month
  metadata["r3zAoTxKpTt"].hidden = months < 9;
  // MMR 2 or MCV 2 vaccine given	Hide when age in years < 1 year
  metadata["tQbe491SjPw"].hidden = months < 9;
};

const DEs = {
  Q511: "RXWSlNxAwq1",
  Q512: "zLJX0cTUhbU",
};

export const childNutritionRules = (metadata, data, { months, years }) => {
  switch (data[DEs.Q511]) {
    case "1":
      metadata[DEs.Q512].hidden = true;
      break;
    case "2":
    case "3":
    case "4":
      metadata[DEs.Q512].hidden = false;
      break;
    default:
      metadata[DEs.Q512].hidden = true;
      break;
  }

  // CN - child exclusively breastfed in the last 24 hours (Q 501)	child age less than 6 months
  metadata["SMfz85dxBrG"].hidden = months > 6;
  // CN - child consumed breastmilk yesterday	child age 6-23 mos
  metadata["YJEM6K4r8B6"].hidden = months < 6 || months > 23;
  // CN - child consumed grains yesterday	child age 6-23 mos
  metadata["aIMeDdwzVQQ"].hidden = months < 6 || months > 23;
  // CN - child consumed legumes yesterday	child age 6-23 mos
  metadata["nVFnpIJFBtP"].hidden = months < 6 || months > 23;
  // CN - child consumed dairy yesterday	child age 6-23 mos
  metadata["iiAjifuwYOE"].hidden = months < 6 || months > 23;
  // CN - child consumed flesh foods yesterday	child age 6-23 mos
  metadata["hQgU2xbT2CL"].hidden = months < 6 || months > 23;
  // CN - child consumed eggs yesterday	child age 6-23 mos
  metadata["xbPC3AWgDrB"].hidden = months < 6 || months > 23;
  // CN - child consumed vitamin A rich fruits and vegetables yesterday	child age 6-23 mos
  metadata["qfYU7s0EylE"].hidden = months < 6 || months > 23;
  // CN - child consumed other fruits and vegetables yesterday	child age 6-23 mos
  metadata["ZxGgsjfOje1"].hidden = months < 6 || months > 23;
  // CN - child given micronutrient powder (Q 503)	child age 6-23 mos
  metadata["saTG1WrWtEW"].hidden = months < 6 || months > 23;
  // CN - child given Vitamin A (Q 504)	child age 6-59 mos
  metadata["JoD2AagclsB"].hidden = months < 6 || months > 59;
  // CN - child's weight and height measured during Operation Timbang (Q 505)	Child < 5 y
  metadata["eoSzVJd8ofS"].hidden = years > 5;
  // CN - child's weight and height monitored (Q 506)	Child < 5 y
  metadata["YgK3LWUrA6f"].hidden = years > 5;
  // CN - follow up monitoring date (Q 507A)	Child < 5 y
  metadata["uYWxyRYP7GN"].hidden = years > 5;
  // CN - Child weight (in kgs) (Q 507B)	Child < 5 y
  metadata["iFiOPAxrJIF"].hidden = years > 5;
  // CN - Weight for age (Q 508)	Child < 5 y
  metadata["Wj1Re9XKW5P"].hidden = years > 5;
  // CN - Child's length or height (in cms) (Q 509)	Child < 5 y
  metadata["CY4OTulUceX"].hidden = years > 5;
  // CN - Length or Height for age (Q 510)	Child < 5 y
  metadata["TON0hSWcaw7"].hidden = years > 5;
  // CN - Weight for height status (Q 511)	Child < 5 y
  metadata["RXWSlNxAwq1"].hidden = years > 5;
  // CN - MUAC findings	Child < 5 y
  metadata["s3q2EVu3qe0"].hidden = years > 5;
  // CN - MUAC (cm)	Child < 5 y
  metadata["sCOCt8eF0Fr"].hidden = years > 5;
  // Mother's member ID number
  metadata["q0WEgMBwi0p"].hidden = years > 5;

  // If CN_MUAC (cm) < 11.5 cm ; CN_MUAC findings = Severe Acute Malnutrition (SAM)
  // If CN_MUAC (cm) >= 11.5 AND < 12.5 cm ; CN_MUAC findings = Moderate Acute Malnutrition (MAM)
  // if CN_MUAC (cm) >= 12.5 cm ; CN_MUAC findings = Normal
  const cm = +data["sCOCt8eF0Fr"];
  if (cm > 0 && cm < 11.5) {
    data["s3q2EVu3qe0"] = "Severe Acute Malnutrition (SAM)";
  } else if (cm >= 11.5 && cm < 12.5) {
    data["s3q2EVu3qe0"] = "Moderate Acute Malnutrition (MAM)";
  } else if (cm >= 12.5) {
    data["s3q2EVu3qe0"] = "Normal";
  }

  // For age >23 months, hide data element Adequate Diet Diversity
  metadata["RLms3EMK6Lx"].hidden = months > 23;

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
  if (months < 6) {
    if (data["SMfz85dxBrG"] === "false") {
      data["RLms3EMK6Lx"] = "false";
    } else {
      data["RLms3EMK6Lx"] = "true";
    }
  } else if (months >= 6 && months <= 23) {
    if (data["YJEM6K4r8B6"] === "true" && countOfTrue >= 5 && countOfTrue <= 7) {
      data["RLms3EMK6Lx"] = "true";
    }

    if (data["YJEM6K4r8B6"] == "false" || countOfTrue < 5) {
      data["RLms3EMK6Lx"] = "false";
    }
  }
};

export const hideSectionRules = (metadata, data, programMetadataMember, { years }) => {
  let shownSections = [];
  let hiddenSections = ["IxbqFSJPfEN", "A2TBfLOW8HG", "tlNWZDOWfP2", "jV8O1ZITgIn", "E4FpYkBzAsW", "fVGAPxIFZoO"];

  const pregnancyStatus = data["ycBIHr9bYyw"];
  if (pregnancyStatus === "1") {
    hiddenSections = hiddenSections.filter((h) => h !== "IxbqFSJPfEN");
    shownSections.push("IxbqFSJPfEN");
  }
  if (pregnancyStatus === "2") {
    hiddenSections = hiddenSections.filter((h) => h !== "A2TBfLOW8HG");
    shownSections.push("A2TBfLOW8HG");

    hiddenSections = hiddenSections.filter((h) => h !== "fVGAPxIFZoO");
    shownSections.push("fVGAPxIFZoO");
  }

  if (years <= 5) {
    hiddenSections = hiddenSections.filter((s) => s !== "tlNWZDOWfP2" || s !== "jV8O1ZITgIn");
    shownSections.push("tlNWZDOWfP2");
    shownSections.push("jV8O1ZITgIn");
  }

  const sex = data["Qt4YSwPxw0X"];
  if (years >= 10 && years <= 49 && sex === "1" && (pregnancyStatus === "2" || pregnancyStatus === "3")) {
    hiddenSections = hiddenSections.filter((h) => h !== "E4FpYkBzAsW");
    shownSections.push("E4FpYkBzAsW");
  }

  const scorecardSurveyStage = programMetadataMember.programStages.find(
    (ps) => ps.id === MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID
  );

  if (scorecardSurveyStage) {
    scorecardSurveyStage.programStageSections.forEach((pss) => {
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
