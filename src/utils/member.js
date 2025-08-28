export const getMaxHHMemberID = (cascadeData) => {
  if (!cascadeData || !Array.isArray(cascadeData)) {
    return "001";
  }

  // Extract all member IDs and remove duplicates
  const allMemberIDs = cascadeData
    .filter((members) => members && typeof members === "object") // Filter out null/undefined elements
    .map((members) => ("Cn37lbyhz6f" in members ? members.Cn37lbyhz6f : null))
    .filter((id) => id !== null && id !== undefined && id !== "") // Filter out null/undefined/empty values
    .map((id) => parseInt(id, 10)) // Convert to numbers for proper comparison
    .filter((id) => !isNaN(id) && id > 0); // Filter out invalid numbers and ensure positive

  // Remove duplicates using Set
  const uniqueMemberIDs = [...new Set(allMemberIDs)];

  if (uniqueMemberIDs.length === 0) {
    return "001";
  }

  // Find the maximum ID and increment by 1
  const maxMemberID = Math.max(...uniqueMemberIDs);
  const nextMemberID = (maxMemberID + 1).toString().padStart(3, "0");

  return nextMemberID;
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
