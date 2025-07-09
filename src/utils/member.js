export const getMaxHHMemberID = (cascadeData) => {
  if (!cascadeData) {
    return "001";
  }

  const allMemberIDs = cascadeData
    .map((members) => ("Cn37lbyhz6f" in members ? members.Cn37lbyhz6f : null))
    .flat()
    .filter((id) => !isNaN(id));

  if (allMemberIDs.length === 0) {
    return "001";
  }

  const maxMemberID = Math.max(...allMemberIDs);
  const paddedMemberIDs = (maxMemberID + 1).toString().padStart(3, "0");

  return paddedMemberIDs;
};

export const getHouseholdMemberValueSet = (cascadeData) => {
  if (!cascadeData) {
    return [];
  }

  const allMemberIDs = cascadeData
    .map((member) => {
      const age = Number(member["H42aYY9JMIR"] || 0);
      if (age < 18) return;

      let label = "";
      if (member["PIGLwIaw0wy"]) {
        label += `${member["PIGLwIaw0wy"]}`;
      }
      if (member["WC0cShCpae8"]) {
        label += ` ${member["WC0cShCpae8"]}`;
      }
      if (member["IENWcinF8lM"]) {
        label += ` ${member["IENWcinF8lM"]}`;
      }
      return { label, value: label, memberId: member["Cn37lbyhz6f"] };
    })
    .filter(Boolean);

  // filter duplicates
  const uniqueMemberIDs = [...new Set(allMemberIDs)];

  return uniqueMemberIDs;
};

export const isHeadOfHousehold = (member) => {
  if (!member) {
    return false;
  }

  return member["QAYXozgCOHu"] === "1";
};
