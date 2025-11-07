import bindDataContext from "./data_context";

const ethnicityDEIds = [
  "HJCjFyZe3fd",
  "ueeqalP1NnB",
  "NnsZ7Yq0ZMl",
  "AZULo0fgAPA",
  "jObBjI31SHJ",
];

const labels = ["laoTai", "monKhmer", "hmongMien", "chineseTibet", "others"];

const calculateEthnicityAggregatedData = (data) =>
  bindDataContext(data).getValuesFromDeIds(ethnicityDEIds);

export { calculateEthnicityAggregatedData, labels };
