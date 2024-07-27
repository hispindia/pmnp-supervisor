import { isImmutableYear } from "../src/utils/event.js";
import dotenv from "dotenv";
import { pull, push } from "../src/api/Fetch.js";
dotenv.config(); // load env vars from .env
const { VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD } = process.env;

const orgMapping = [{ from: "TVYs8g7UpUb", to: "wZyhliHIouG" }];

console.log(VITE_BASE_URL);

const getTrackedEntityInstanceList = (
  orgUnit,
  program,
  pageSize,
  page,
  filter
) =>
  pull(
    this.baseUrl,
    this.username,
    this.password,
    `/api/tracker/trackedEntities.json`,
    {
      paging: true,
      pageSize: pageSize,
      totalPages: true,
      page: page,
      filter: filter,
    },
    [
      `orgUnit=${orgUnit}`,
      `ouMode=SELECTED`,
      `order=created:desc`,
      `program=${program}`,
    ]
  );

console.log(isImmutableYear(2021, [2021, 2022, 2023]));

// const getFamilyTeis = yield call(
//     dataApi.getTrackedEntityInstanceListByQuery,
//     selectedOrgUnit.id,
//     programMetadata.id,
//     nextPayload.pageSize,
//     nextPayload.page,
//     returnFilterString(nextPayload.filters),
//     nextPayload.orderString
//   );
