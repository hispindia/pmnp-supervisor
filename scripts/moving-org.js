import fs from "fs";
import util from "util";
import {
  getTrackedEntityInstanceListByQuery,
  getTrackedEntityInstance,
  getTrackedEntityInstances,
  postTrackedEntityInstances,
  transferOwnership,
} from "./utils.js";

const orgMapping = [
  { from: "bN75ZaVTvIH", to: "QB8DhjrKnFb" },
  { from: "hLCT7boOi0L", to: "QB8DhjrKnFb" },
];

const __dirname = "./";

const FAMILY_PROGRAM_ID = "L0EgY4EomHv";
const MEMBER_PROGRAM_ID = "xvzrp56zKvI";

var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var error_file = fs.createWriteStream(__dirname + "/error.log", { flags: "w" });
var log_stdout = process.stdout;
console.error = function (d, type) {
  switch (type) {
    default: {
      error_file.write(util.format(d) + "\n");
    }
  }
  log_stdout.write(util.format(d) + "\n");
};

console.log = function (d) {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

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

    // remove value of "geometry" key
    if (key === "geometry") {
      acc[key] = null;
      return acc;
    }

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

const updateFamilyOrgUnit = async (familyTeiId, pairOrg, process) => {
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

  const updatedMembers = membersOfFamily.instances.map((member) =>
    updateOrgUnitValue(member, "orgUnit", to)
  );

  const resultTransfer = await transferOwnership({
    trackedEntity: familyTeiId,
    program: FAMILY_PROGRAM_ID,
    to: to,
  });

  const resultFamily = await postTrackedEntityInstances({
    trackedEntities: [updatedFamilyTei],
  });

  const resultMembers = await postTrackedEntityInstances({
    trackedEntities: updatedMembers,
  });

  console.log(
    `tei: ${familyTeiId}, members: ${updatedMembers.length}, family: ${resultFamily.status}, members: ${resultMembers.status}, transfer: ${resultTransfer.status}, ${process}`
  );
};

(async () => {
  try {
    for (const orgUnit of orgMapping) {
      const { from, to } = orgUnit;

      const getFamilyTeiIds = await getTrackedEntityInstanceListByQuery({
        orgUnit: from,
        program: FAMILY_PROGRAM_ID,
        fields: "trackedEntity",
      });
      console.log(
        `Start: ${from} -> ${to}: ${getFamilyTeiIds.instances.length}`
      );

      for (const idx in getFamilyTeiIds.instances) {
        const { trackedEntity } = getFamilyTeiIds.instances[idx];

        await updateFamilyOrgUnit(
          trackedEntity,
          orgUnit,
          `${Number(idx) + 1}/${getFamilyTeiIds.instances.length}`
        );
      }
      console.log(`End: ${from} -> ${to}`);
    }
  } catch (error) {
    console.error(error, "error");
  }
})();
