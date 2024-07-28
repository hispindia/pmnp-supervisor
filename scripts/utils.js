import { pull, push } from "../src/api/Fetch.js";
import dotenv from "dotenv";
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
    {},
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
