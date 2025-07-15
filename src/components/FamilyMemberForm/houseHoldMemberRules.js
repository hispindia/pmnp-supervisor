import { differenceInDays, differenceInMonths } from "date-fns";

export const handleAgeAttrsOfTEI = (data, { days, weeks, months, years }) => {
  const daysAttr = "d2n5w4zpxuo";
  const weeksAttr = "xDSSvssuNFs";
  const monthsAttr = "X2Oln1OyP5o";
  const yearsAttr = "H42aYY9JMIR";

  data[daysAttr] = "";
  data[weeksAttr] = "";
  data[monthsAttr] = "";
  data[yearsAttr] = "";

  // if (weeks === 0) {
  //   data[daysAttr] = days;
  // } else if (months === 0) {
  //   data[weeksAttr] = weeks;
  // } else if (years === 0 || years < 5) {
  //   data[monthsAttr] = months;
  // } else if (years >= 5) {
  //   data[yearsAttr] = years;
  // }

  data[daysAttr] = days;
  data[weeksAttr] = weeks;
  data[monthsAttr] = months;
  data[yearsAttr] = years;
};

export const hhMemberRules = (metadata, data, { years }) => {
  // Name of IP group (Ethnicity)	Only show when 'IP membership' = Yes /1
  metadata["g276qF2fXHi"].hidden = data["OiOvGqVEyY9"] !== "1";

  // 4Ps Household ID number	Only show when '4Ps membership' = Yes / 1
  metadata["CEF6Dkpe2jW"].hidden = data["wxN2PuLymoY"] !== "1";

  //PWD ID number (E6KdOG1IB6O)	Only show when PWD = 1, (xwMJHEDdpGc)
  metadata["E6KdOG1IB6O"].hidden = data["xwMJHEDdpGc"] !== "1";

  // Hide Philhealth ques for child <5 y (0-59 mo)
  metadata["JjFcU1L7Ll1"].hidden = !(years > 5);
  metadata["JjFcU1L7Ll1"].error = !metadata["JjFcU1L7Ll1"].hidden && !data["JjFcU1L7Ll1"] && "This field is required";

  // PHIC ID	Only show when 'PHIC membership' = Yes / 1
  const PhiCMembership = data["JjFcU1L7Ll1"];

  metadata["Yp6gJAdu4yX"].hidden = PhiCMembership !== "1" || !(years > 5);

  // Mother's member ID number
  metadata["q0WEgMBwi0p"].hidden = years > 5;
};

export const childHeathRules = (metadata, data, { months, years }, code, CHILD_VACCINES) => {
  debugger;
  if (years > 5 || !data["fJPZFs2yYJQ"]) {
    CHILD_VACCINES.list.forEach((item) => {
      metadata[item.ids.vaccineDone].hidden = true;
      metadata[item.ids.vaccineDate].hidden = true;
      metadata[item.ids.discrepancy].hidden = true;
    })
    return;
  }

  //Data Saving validation
  CHILD_VACCINES.list.forEach((item) => {
    metadata[item.ids.vaccineDone].hidden = false;
    metadata[item.ids.vaccineDate].hidden = false;
    metadata[item.ids.discrepancy].hidden = false;

    if (item.vaccineMonth.start > months ) {
      metadata[item.ids.vaccineDone].hidden = true;
      metadata[item.ids.vaccineDate].hidden = true;
      metadata[item.ids.discrepancy].hidden = true;
    }
    if (data[item.ids.vaccineDone] == "false" || !data[item.ids.vaccineDone]) {
      metadata[item.ids.vaccineDate].disabled = true;
    }
    //bypass
    metadata[item.ids.discrepancy].disabled = true;
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
      metadata[vaccineDoneDetails.ids.vaccineDate].disabled = false;
    } else if (data[vaccineDoneDetails.ids.vaccineDone] == "false") {
      data[vaccineDoneDetails.ids.vaccineDate] = "";
      data[vaccineDoneDetails.ids.discrepancy] = true;
      metadata[vaccineDoneDetails.ids.vaccineDate].disabled = true;
    }
  }

  if (data["XhrgV4nfrRK"] || data["kzaCPuPzy6o"]) {
    metadata["Lp9Y5Z5P78t"].disabled = true;
    metadata["DHXhabUfBHA"].disabled = true;
  }
  if (data["mSfZRdFRWdh"] || data["PQS3vSrsIBO"]) {
    metadata["zQK0SZQ7Dot"].disabled = true;
    metadata["i4gomCWd0y9"].disabled = true;
  }
  if (data["eXwMBOUSwuB"] || data["EhIlZ6OO8Fu"]) {
    metadata["IjbZlh5uehM"].disabled = true;
    metadata["ew3lMYvyfeV"].disabled = true;
  }
  if (data["Lp9Y5Z5P78t"] || data["DHXhabUfBHA"]) {
    metadata["XhrgV4nfrRK"].disabled = true;
    metadata["zqDWAyTTTDd"].disabled = true;
  }
  if (data["zQK0SZQ7Dot"] || data["i4gomCWd0y9"]) {
    metadata["mSfZRdFRWdh"].disabled = true;
    metadata["PQS3vSrsIBO"].disabled = true;
  }
  if (data["IjbZlh5uehM"] || data["ew3lMYvyfeV"]) {
    metadata["eXwMBOUSwuB"].disabled = true;
    metadata["EhIlZ6OO8Fu"].disabled = true;
  }
};
