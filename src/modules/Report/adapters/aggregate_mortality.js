import { sum } from "./utils";
import bindDataContext from "./data_context";

const labels = [
  "totalDeath",
  "stillBirth",
  "deathUnder1Year",
  "death1To4Years",
  "death5To19Years",
  "maternalDeath",
];

const mortalityDeIds = [
  "AB4m6KuUXF8",
  "m5y4aLbmIOO",
  "akAYIsCrRwV",
  "mPTyd0nP5Xx",
  "LmGX6VpLkIX",
];

const calculateAggregatedMortalityData = (data) => {
  const originalMortalityData =
    bindDataContext(data).getValuesFromDeIds(mortalityDeIds);
  return [sum(originalMortalityData), ...originalMortalityData];
};

export { calculateAggregatedMortalityData, labels };
