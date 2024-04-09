import { sumByLevel } from "./utils";
import bindDataContext from "./data_context";

const insuranceDEIds = [
  "jxfyOMxkbIw",
  "y3h4wxW3w50",
  "ispm3X8fxSY",
  "U4fdHCMef6x",
  "SJ0Cvi4jeGy",
  "XM59B0Lw2Md", // health center
  [
    "DZqf1SBDDqv", // out side country
    "w19F9i9XORa" // other place
  ]
];

const labels = [
  "deliveryAtHome",
  "deliveryAtDistrictHospital",
  "deliveryAtProvincialHospital",
  "deliveryAtCentralHospital",
  "deliveryAtPrivateHospital",
  "deliveryInHealthCenter",
  "deliveryInOtherPlaces"
];

const calculateDeliveryPlaceAggregatedData = data => {
  const aggregatedData = bindDataContext(data).getValuesFromDeIds(
    insuranceDEIds
  );
  return sumByLevel(1)(aggregatedData);
};

export { calculateDeliveryPlaceAggregatedData, labels };
