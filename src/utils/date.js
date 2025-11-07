import { format, quartersToMonths } from "date-fns";
import moment from "moment";

export const getMidDateOfQuarterly = (quarterly) => {
  const year = quarterly.slice(0, 4);
  const quarter = quarterly.slice(-1);
  const months = quartersToMonths(Number(quarter));
  const midDate = format(new Date(Number(year), months - 2, 15), "yyyy-MM-dd");

  return midDate;
};

export const getQuarterlyFromDate = (date) => {
  const quarter = Math.floor((moment(date).month() + 3) / 3);
  return `Q${quarter}`;
};
