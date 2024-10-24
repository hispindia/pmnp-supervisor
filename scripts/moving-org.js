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
  { from: "CXoDVCHXwSr", to: "L8jziUR2ma4" },
  { from: "O6EJGedmvs8", to: "Xmki8VIRAuh" },
  { from: "tbaOmWtfz8i", to: "GhO02tPjNNH" },
  { from: "OavbW8IpsbU", to: "UJ8iluWwAAE" },
  { from: "DqW53N4590X", to: "wt2Pw1id6iv" },
  { from: "JbGFjJidFnj", to: "wt2Pw1id6iv" },
  { from: "yRCbaBMYdOY", to: "rglFoFxDFW0" },
  { from: "gSxhr62dcD6", to: "O7D0ZvIKa9A" },
  { from: "AMJocbcEoD8", to: "O7D0ZvIKa9A" },
  { from: "sOlkzElSdWK", to: "GhO02tPjNNH" },
  { from: "xWVFPRIyIk4", to: "O7D0ZvIKa9A" },
  { from: "jl9WPLJBn88", to: "wt2Pw1id6iv" },
  { from: "TU474f7abpm", to: "rglFoFxDFW0" },
  { from: "sOzdo8wO8Jc", to: "XHdD3mNs6Nd" },
  { from: "fGCconG98yb", to: "Ifd0yIFRvBq" },
  { from: "VIM6bpKQ7dR", to: "XHdD3mNs6Nd" },
  { from: "zfgjNkGzORV", to: "BS5pTItc37J" },
  { from: "n7pKjMKS7ml", to: "GhO02tPjNNH" },
  { from: "iQVuGRseX8n", to: "UJ8iluWwAAE" },
  { from: "COxzTO1lGSN", to: "DBBbEtlV8GE" },
  { from: "TVYs8g7UpUb", to: "wZyhliHIouG" },
  { from: "yBUPBfBDAss", to: "jYqmG15kxT9" },
];

// FI - z7zj2wHeY3a
// Members - kGuveiKyIxB;j5UMD1h6xpc;M4v7XcIc3dW;kckSVreUTE5

const DEBUG = true;
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, 1000));

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

  if (DEBUG) console.log("familyTei");
  const familyTei = await getTrackedEntityInstance(familyTeiId);

  if (DEBUG) console.log("membersOfFamilyFrom");
  const membersOfFamilyFrom = await getTrackedEntityInstances({
    ou: from,
    filters: [`attribute=gv9xX5w4kKt:EQ:${familyTeiId}`],
    attributes: [], // Object.entries(teiMapping).map((e) => e[1]),
    program: MEMBER_PROGRAM_ID,
    fields: "*",
  });

  if (DEBUG) console.log("membersOfFamilyTo");
  const membersOfFamilyTo = await getTrackedEntityInstances({
    ou: to,
    filters: [`attribute=gv9xX5w4kKt:EQ:${familyTeiId}`],
    attributes: [], //Object.entries(teiMapping).map((e) => e[1]),
    program: MEMBER_PROGRAM_ID,
    fields: "*",
  });

  const updatedFamilyTei = updateOrgUnitValue(familyTei, "orgUnit", to);

  const membersOfFamily =
    membersOfFamilyFrom.instances.length > 0
      ? membersOfFamilyFrom
      : membersOfFamilyTo;

  const updatedMembers = membersOfFamily.instances.map((member) =>
    updateOrgUnitValue(member, "orgUnit", to)
  );

  if (DEBUG) {
    console.log(JSON.stringify(updatedFamilyTei));
    console.log(JSON.stringify(updatedMembers));
    return;
  }

  // POST section
  console.log("transferOwnership");
  const resultTransfer = await transferOwnership({
    trackedEntity: familyTeiId,
    program: FAMILY_PROGRAM_ID,
    to: to,
  });

  console.log("resultFamily");
  const resultFamily = await postTrackedEntityInstances({
    trackedEntities: [updatedFamilyTei],
  });

  console.log("resultMembers");
  const resultMembers = await postTrackedEntityInstances({
    trackedEntities: updatedMembers,
  });

  console.log(
    `tei: ${familyTeiId}, members: ${updatedMembers.length}, family: ${resultFamily.status}, members: ${resultMembers.status}, transfer: ${resultTransfer.status}, ${process}`
  );
};

const transferMembers = async (familyTeiId, pairOrg, process) => {
  const { from, to } = pairOrg;

  const membersOfFamily = await getTrackedEntityInstances({
    ou: from,
    filters: [`attribute=gv9xX5w4kKt:EQ:${familyTeiId}`],
    attributes: Object.entries(teiMapping).map((e) => e[1]),
    program: MEMBER_PROGRAM_ID,
    fields: "*",
  });

  for (const member of membersOfFamily.instances) {
    const resultTransferMember = await transferOwnership({
      trackedEntity: member.trackedEntity,
      program: MEMBER_PROGRAM_ID,
      to: to,
    });

    console.log(
      `tei: ${member.trackedEntity}, transfer: ${resultTransferMember.status}, ${process}`
    );
  }
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

        //sleep for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (DEBUG) return;

        // await transferMembers(
        //   trackedEntity,
        //   orgUnit,
        //   `${Number(idx) + 1}/${getFamilyTeiIds.instances.length}`
        // );
      }
      console.log(`End: ${from} -> ${to}`);
    }
  } catch (error) {
    console.error(error, "error");
  }
})();
