const sum = dataValues =>
  dataValues.reduce((total, dataValue) => (total += +dataValue), 0);

const deepSum = array => {
  if (!Array.isArray(array)) {
    return array;
  }
  return sum(array.map(subArray => deepSum(subArray)));
};

const sumByLevel = level => {
  const sumSubArray = (array, fromLevel = 0) => {
    if (!Array.isArray(array)) return array;
    const nextLevel = fromLevel + 1;
    if (fromLevel === level) {
      return deepSum(array);
    }
    return array.map(subArray => sumSubArray(subArray, nextLevel));
  };
  return sumSubArray;
};

export { sumByLevel, sum, deepSum };
