import {
  getTrackedEntityInstanceListByQuery,
  getTrackedEntityInstance,
  getTrackedEntityInstances,
} from "./utils.js";

const orgMapping = [{ from: "TVYs8g7UpUb", to: "wZyhliHIouG" }];

const FAMILY_PROGRAM_ID = "L0EgY4EomHv";
const MEMBER_PROGRAM_ID = "xvzrp56zKvI";

const teiMapping = {
  firstname: "IEE2BMhfoSc",
  lastname: "IBLkiaYRRL3",
  sex: "DmuazFb368B",
  ethnicity: "tJrT8GIy477",
  birthyear: "bIzDI9HJCB0",
  age: "BaiVwt8jVfg",
  nationality: "NLth2WTyo7M",
  status: "tASKWHyRolc",
  agetype: "ck9h7CokxQE",
  DOB: "tQeFLjYbqzv",
};

const updateOrgUnitValue = (obj, keyName, newValue) => {
  if (obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => updateOrgUnitValue(item, keyName, newValue));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (key === keyName) {
      acc[key] = newValue;
    } else if (typeof value === "object" && value !== null) {
      acc[key] = updateOrgUnitValue(value, keyName, newValue);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const updateFamilyOrgUnit = async (familyTeiId, pairOrg) => {
  const { from, to } = pairOrg;
  const familyTei = await getTrackedEntityInstance(familyTeiId);

  const membersOfFamily = await getTrackedEntityInstances({
    ou: from,
    filters: [`attribute=gv9xX5w4kKt:EQ:${familyTeiId}`],
    attributes: Object.entries(teiMapping).map((e) => e[1]),
    program: MEMBER_PROGRAM_ID,
    fields: "*",
  });

  const updatedFamilyTei = updateOrgUnitValue(familyTei, "orgUnit", to);

  // console.log({ trackedEntities: updatedFamilyTei });

  const updatedMembers = membersOfFamily.instances.map((member) =>
    updateOrgUnitValue(member, "orgUnit", to)
  );

  console.log(updatedMembers);
};

(async () => {
  for (const orgUnit of orgMapping) {
    const { from, to } = orgUnit;

    const getFamilyTeiIds = await getTrackedEntityInstanceListByQuery({
      orgUnit: from,
      program: FAMILY_PROGRAM_ID,
      fields: "trackedEntity",
    });

    for (const { trackedEntity } of getFamilyTeiIds.instances) {
      await updateFamilyOrgUnit(trackedEntity, orgUnit);

      break;
    }
  }
})();
