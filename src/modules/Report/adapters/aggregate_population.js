import bindDataContext from "./data_context";

const labels = [
  "<1",
  "1",
  "2-4",
  "5-14",
  "15-44",
  "45-49",
  "50-59",
  "60+",
].reverse();

const maleDEIds = [
  "Eqi1288N8Nd",
  "hx5FKOqT18B",
  "cz6oa275ize",
  "S91BBc2Op9Z",
  "yHQ9LbhuLPh",
  "osp7h6GLyV8",
  "GTEknIuyEiO",
  "y9zGBpMBAhQ",
].reverse(); // in order by age

const femaleDEIds = [
  "eDwcbrF4Qsr",
  "xllqsmDiexq",
  "DG9EvDsL801",
  "qaAsAc4DBlE",
  "CCtvT9h1yB4",
  "Gf8F7hQqygz",
  "AI5nHnkf5WR",
  "dE6mw0hXdAt",
].reverse(); // in order by age

// const calculatePopulationAggregatedData = data => {
//   const dataContext = bindDataContext(data);
//   return dataContext.sumByDEs([maleDEIds, femaleDEIds]);
// };

const calculatePopulationAggregatedData = (data) => {
  const dataContext = bindDataContext(data);
  const maleDataValues = dataContext.getValuesFromDeIds(maleDEIds);
  const femaleDataValues = dataContext.getValuesFromDeIds(femaleDEIds);
  return [maleDataValues, femaleDataValues];
};

export { calculatePopulationAggregatedData, labels };
