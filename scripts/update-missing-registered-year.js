import fs from "fs";
import util from "util";
import { getFamilyTeis, postTrackedEntityInstancesOld } from "./utils.js";

const __dirname = "./";

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

const transformTEI = (teis) => {
  return teis.map((tei) => ({
    orgUnit: tei[15],
    trackedEntityInstance: tei[1],
    attributes: [
      {
        displayName: "Registered Year",
        valueType: "TEXT",
        attribute: "BUEzQEErqa7",
        value: tei[2].split("-")[0],
      },
    ],
  }));
};

(async () => {
  try {
    const getFamilyTeiIds = await getFamilyTeis(1);

    const { metaData } = getFamilyTeiIds;
    const { pager } = metaData;
    const { pageCount } = pager;

    for (let i = 1; i <= pageCount; i++) {
      const getFamilyTeiIds = await getFamilyTeis(i);

      if (getFamilyTeiIds.rows.length > 0) {
        const payload = transformTEI(getFamilyTeiIds.rows);

        const result = await postTrackedEntityInstancesOld(payload);

        console.log(`Start: page: ${i}/${pageCount}, status: ${result.status}`);
      }

      return;
    }
    return;
  } catch (error) {
    console.error(error, "error");
  }
})();
