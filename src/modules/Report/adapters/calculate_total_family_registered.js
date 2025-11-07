import bindDataContext from "./data_context";

const calculateTotalFamilyRegisteredData = (data) => {
  const dataContext = bindDataContext(data);

  const years = data.metaData.dimensions.pe;
  return years.map((year) => {
    const valueIndex = dataContext.getDataValueIndex("value");
    const peIndex = dataContext.getDataValueIndex("pe");
    const rowValue = data.rows.find((row) => row[peIndex] === year);
    return rowValue ? rowValue[valueIndex] : 0;
  });
};

export { calculateTotalFamilyRegisteredData };
