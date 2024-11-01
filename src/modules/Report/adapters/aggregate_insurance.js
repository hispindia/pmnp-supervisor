import bindDataContext from "./data_context";

const insuranceDEIds = [
  "bXy7dRTxSUN",
  "Pwttxh8qzbh",
  "qMEd4h2s2jA",
  "SyPLRSV1NCn",
  "Oov8I1ZmXo3",
  "C2zynun5YMh",
  "fqdxmeIjMGq",
];

const labels = ["sasssso", "mps", "nhi", "chi", "phi", "dh", "dn"];

const calculateInsuranceAggregatedData = (data) =>
  bindDataContext(data).getValuesFromDeIds(insuranceDEIds);

export { calculateInsuranceAggregatedData, labels };
