import bindDataContext from "./data_context";
import sum from "lodash/sum";

const familyMemberDeIds = [
  //   {
  //     displayName: "MD: Total Members",
  //     id: "MLyfF22nQdp",
  //   },
  {
    displayName: "FI: Family members 1 year Female",
    id: "xllqsmDiexq",
  },
  {
    displayName: "FI: Family members 1 year Male",
    id: "hx5FKOqT18B",
  },
  {
    displayName: "FI: Family members 15-44 years Female",
    id: "CCtvT9h1yB4",
  },
  {
    displayName: "FI: Family members 15-44 years Male",
    id: "yHQ9LbhuLPh",
  },
  {
    displayName: "FI: Family members 2-4 years Female",
    id: "DG9EvDsL801",
  },
  {
    displayName: "FI: Family members 2-4 years Male",
    id: "cz6oa275ize",
  },
  {
    displayName: "FI: Family members 45-49 years Female",
    id: "Gf8F7hQqygz",
  },
  {
    displayName: "FI: Family members 45-49 years Male",
    id: "osp7h6GLyV8",
  },
  {
    displayName: "FI: Family members 5-14 years Female",
    id: "qaAsAc4DBlE",
  },
  {
    displayName: "FI: Family members 5-14 years Male",
    id: "S91BBc2Op9Z",
  },
  {
    displayName: "FI: Family members 50-59 years Female",
    id: "AI5nHnkf5WR",
  },
  {
    displayName: "FI: Family members 50-59 years Male",
    id: "GTEknIuyEiO",
  },
  {
    displayName: "FI: Family members 60+ years Female",
    id: "dE6mw0hXdAt",
  },
  {
    displayName: "FI: Family members 60+ years Male",
    id: "y9zGBpMBAhQ",
  },
  {
    displayName: "FI: Family members <1 year Female",
    id: "eDwcbrF4Qsr",
  },
  {
    displayName: "FI: Family members <1 year Male",
    id: "Eqi1288N8Nd",
  },
];

const calculateTotalPopulation = (data) => {
  process.env.NODE_ENV && console.log("test data", data);
  const dataContext = bindDataContext(data);
  const years = data.metaData.dimensions.pe;
  return years.map((year) => {
    const valueIndex = dataContext.getDataValueIndex("value");
    process.env.NODE_ENV && console.log("valueIndex", valueIndex);
    const peIndex = dataContext.getDataValueIndex("pe");
    process.env.NODE_ENV && console.log("peIndex", peIndex);

    const dxIndex = dataContext.getDataValueIndex("dx");
    process.env.NODE_ENV && console.log("dxIndex", dxIndex);
    const rowValues = data.rows
      .filter(
        (row) =>
          row[peIndex] === year &&
          familyMemberDeIds
            .map((de) => de.id)
            .find((deId) => row[dxIndex].includes(deId))
      )
      .map((row) => +row[valueIndex]);
    process.env.NODE_ENV && console.log("rowValues", rowValues);
    return rowValues && rowValues.length ? sum(rowValues) : 0;
  });
};

export { calculateTotalPopulation };
