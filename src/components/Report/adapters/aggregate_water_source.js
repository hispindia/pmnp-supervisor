import bindDataContext from "./data_context";

const waterSourceDEId = "p2P8g0MnDBK";

const calculateWaterSourceAggregatedData = data =>
  bindDataContext(data).getCountOptionValuesFromDeId(waterSourceDEId);

const getOptionLabels = data =>
  bindDataContext(data)
    .getOptionsFromDE(waterSourceDEId)
    .map(({ name }) => name);

export { calculateWaterSourceAggregatedData, getOptionLabels };
