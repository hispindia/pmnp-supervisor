import { sum } from "./utils";

const getOptionsFromDE = data => deId => {
  const optionIds = data.metaData.dimensions[deId];
  return optionIds.map(optionId => data.metaData.items[optionId]);
};

const getDataValueIndex = data => deId => {
  const index = data.headers.findIndex(header => header.name === deId);
  if (index < 0) console.warn(`Cant find deId: ${deId}`);
  return index;
};

const countByOptionsFromDE = data => deId => {
  const options = getOptionsFromDE(data)(deId);
  return options.map(({ code }) => {
    return countByDE(data)({
      deId,
      compareFunc: dataValue => dataValue === code
    });
  });
};

const sumBySingleDeId = data => deId => {
  const dataValueIndex = getDataValueIndex(data)(deId);
  return data.rows.reduce((total, value) => {
    total += +value[dataValueIndex];
    return total;
  }, 0);
};

const sumByDEs = data => deIds => {
  return deIds.map(deId => {
    if (Array.isArray(deId)) {
      return sumByDEs(data)(deId);
    }
    return sumBySingleDeId(data)(deId);
  });
};

const countByDE = data => ({ deId, transformFunc = null, compareFunc }) => {
  const dataValueIndex = getDataValueIndex(data)(deId);
  return data.rows.reduce((result, dataValues) => {
    let dataValue = dataValues[dataValueIndex];
    dataValue = transformFunc ? transformFunc(dataValue) : dataValue;
    if (compareFunc(dataValue)) result += 1;
    return result;
  }, 0);
};

const getValueFromDeId = data => deId => {
  // sum all year with DEID
  const valueIndex = getDataValueIndex(data)("value");
  const deIndex = getDataValueIndex(data)("dx");
  return data.rows
    .filter(row => {
      const deValue = row[deIndex];
      return deValue.includes(deId);
    })
    .map(row => {
      return +row[valueIndex];
    })
    .reduce((result, value) => (result += value), 0);
};

const getValuesFromDeIds = data => deIds =>
  deIds.map(deId => {
    if (Array.isArray(deId)) return getValuesFromDeIds(data)(deId);
    return getValueFromDeId(data)(deId);
  });

const getCountOptionValuesFromDeId = data => deId => {
  const options = getOptionsFromDE(data)(deId);
  const deIndex = getDataValueIndex(data)(deId);
  const valueIndex = getDataValueIndex(data)("value");
  return options.map(({ code }) => {
    return sum(
      data.rows
        .filter(row => {
          return row[deIndex] === code;
        })
        .map(row => +row[valueIndex])
    );
  });
};
const bindDataContext = data => ({
  sumByDEs: sumByDEs(data),
  getOptionsFromDE: getOptionsFromDE(data),
  countByOptionsFromDE: countByOptionsFromDE(data),
  countByDE: countByDE(data),
  getDataValueIndex: getDataValueIndex(data),
  getValueFromDE: getValueFromDeId(data),
  getValuesFromDeIds: getValuesFromDeIds(data),
  getCountOptionValuesFromDeId: getCountOptionValuesFromDeId(data)
});

export default bindDataContext;
