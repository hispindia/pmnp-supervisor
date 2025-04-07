const countValue = (data, de_ids, value) => {
  const count = data.filter((item) => {
    return item[de_ids] === value;
  });
  return count.length;
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

export const calculateHouseHoldFields = (newData, interviewCascadeData) => {
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
  newData["kT9vaHCgFDZ"] = countRangeValue(interviewCascadeData, "RoSxLAB5cfo", 6, 23);
  //Score_Eligible Children 24-59 mos old
  newData["kT9vaHCgFDZ"] = countRangeValue(interviewCascadeData, "RoSxLAB5cfo", 24, 59);
};
