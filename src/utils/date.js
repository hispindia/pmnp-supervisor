import { format, quartersToMonths } from "date-fns";

export const getMidDateOfQuarterly = (quarterly) => {
  const year = quarterly.slice(0, 4);
  const quarter = quarterly.slice(-1);
  const months = quartersToMonths(Number(quarter));
  const midDate = format(new Date(Number(year), months - 2, 15), "yyyy-MM-dd");

  return midDate;
};
