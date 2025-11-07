import bindDataContext from "./data_context";

const labels = [
  "selfBirth",
  "deliveryByHusbandRelatives",
  "deliveryByTBAVHV",
  "deliveryBySBA",
  "deliveryByOthers"
];

const personnelDEIds = [
  "hRlVw3IeQ45",
  "c8E0s3lqCmD",
  "iYpP9mXDw1W",
  "FOTKm0DKO4Q",
  "YIg4eMjDYLg"
];

const calculatePersonnelAggregatedData = data =>
  bindDataContext(data).getValuesFromDeIds(personnelDEIds);

export { labels, calculatePersonnelAggregatedData };
