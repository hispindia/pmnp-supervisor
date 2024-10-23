import dotenv from "dotenv";
import { pull, push } from "../src/api/Fetch.js";
dotenv.config(); // load env vars from .env
const { VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD } = process.env;

export const getTrackedEntityInstanceListByQuery = ({
  orgUnit,
  program,
  fields,
}) => {
  return pull(
    VITE_BASE_URL,
    VITE_USERNAME,
    VITE_PASSWORD,
    `/api/tracker/trackedEntities.json`,
    {
      skipPaging: true,
    },
    [
      `orgUnit=${orgUnit}`,
      `ouMode=SELECTED`,
      `program=${program}`,
      `fields=${fields}`,
    ]
  );
};

export const getFamilyTeis = (page) => {
  // /api/29/analytics/enrollments/query/L0EgY4EomHv.json?dimension=pe:LAST_5_YEARS&dimension=ou:IWp9dQGM0bS&dimension=BUEzQEErqa7:EQ:NV&stage=vY4mlqYfJEH&displayProperty=NAME&totalPages=true&outputType=ENROLLMENT&desc=enrollmentdate&pageSize=100&page=2
  return pull(
    VITE_BASE_URL,
    VITE_USERNAME,
    VITE_PASSWORD,
    `/api/29/analytics/enrollments/query/L0EgY4EomHv.json`,
    {
      paging: true,
      pageSize: 100,
      totalPages: true,
      page,
    },
    [
      `dimension=pe:LAST_5_YEARS`,
      `dimension=ou:IWp9dQGM0bS`,
      `dimension=BUEzQEErqa7:EQ:NV`,
      `stage=vY4mlqYfJEH`,
      `displayProperty=NAME`,
      `outputType=ENROLLMENT`,
      `desc=enrollmentdate`,
      // `pageSize=100`,
      // `totalPages=true`,
      // `page=${page}`,
    ]
  );
};

export const postTrackedEntityInstances = async (teis) => {
  return await push(
    VITE_BASE_URL,
    VITE_USERNAME,
    VITE_PASSWORD,
    `/api/tracker?async=false`,
    teis,
    "POST"
  );
};

export const postTrackedEntityInstancesOld = async (teis) => {
  return await push(
    VITE_BASE_URL,
    VITE_USERNAME,
    VITE_PASSWORD,
    `/api/trackedEntityInstances`,
    {
      trackedEntityInstances: teis,
    },
    "POST"
  );
};

export const getTrackedEntityInstances = ({
  ou,
  filters,
  attributes,
  program,
  fields,
}) => {
  return pull(
    VITE_BASE_URL,
    VITE_USERNAME,
    VITE_PASSWORD,
    `/api/tracker/trackedEntities.json`,
    { skipPaging: true },
    [
      `orgUnit=${ou}`,
      `program=${program}`,
      filters.join("&"),
      attributes.map((e) => "attribute=" + e).join("&"),
      `fields=${fields}`,
    ]
  );
};

export const getTrackedEntityInstance = (trackedEntityInstance) => {
  return pull(
    VITE_BASE_URL,
    VITE_USERNAME,
    VITE_PASSWORD,
    `/api/tracker/trackedEntities/${trackedEntityInstance}.json`,
    {},
    [`fields=*`]
  );
};

export const transferOwnership = async ({ trackedEntity, program, to }) => {
  return await push(
    VITE_BASE_URL,
    VITE_USERNAME,
    VITE_PASSWORD,
    `/api/tracker/ownership/transfer?trackedEntityInstance=${trackedEntity}&program=${program}&ou=${to}`,
    {},
    "PUT"
  );
};
