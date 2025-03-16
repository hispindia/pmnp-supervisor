export const getMaxHHMemberID = (cascadeData) => {
  if (!cascadeData) {
    return "001";
  }

  const allMemberIDs = Object.values(cascadeData)
    .map((members) => members.map((member) => Number(member.Cn37lbyhz6f)))
    .flat()
    .filter((id) => !isNaN(id));

  if (allMemberIDs.length === 0) {
    return "001";
  }

  const maxMemberID = Math.max(...allMemberIDs);
  const paddedMemberIDs = (maxMemberID + 1).toString().padStart(3, "0");

  return paddedMemberIDs;
};

export const getHouseholdMemberIDs = (cascadeData) => {
  if (!cascadeData) {
    return [];
  }

  const allMemberIDs = Object.values(cascadeData)
    .map((members) => members.map((member) => member.Cn37lbyhz6f))
    .flat()
    .filter((id) => !isNaN(id));

  // filter duplicates
  const uniqueMemberIDs = [...new Set(allMemberIDs)];

  return uniqueMemberIDs;
};
