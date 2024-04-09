const currentYear = new Date().getFullYear();
const NUMBER_OF_YEARS = currentYear - 2018 + 1;
const years = Array.from(
  {
    length: NUMBER_OF_YEARS,
  },
  (value, index) => {
    return currentYear - NUMBER_OF_YEARS + 1 + index;
  }
);

const options = years
  .map((year) => ({
    value: year.toString(),
    label: year,
  }))
  .concat([
    {
      value: years.join(";"),
      label: "all",
    },
  ]);

export default options;
