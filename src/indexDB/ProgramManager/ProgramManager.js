import db from "../db";
import { metadataApi } from "../../api";
import { TABLE_NAME } from ".";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();
    const result = await metadataApi.getProgramsMetadata();

    await db[TABLE_NAME].bulkPut(result.programs);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const getPrograms = async () => {
  try {
    return await db[TABLE_NAME].toArray();
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};

export const getProgramById = async (id) => {
  try {
    return await db[TABLE_NAME].get(id);
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};

// id	INTEGER	NO	NULL
// code	varchar(255)	YES	NULL
// name	TEXT	NO	NULL
// shortName	TEXT	YES	NULL
// description	TEXT	YES	NULL
// programType	TEXT	YES	NULL
// version	INTEGER	NO	0
// organisationUnits	TEXT	YES	NULL
// options	TEXT	YES	NULL
// body	TEXT	NO	NULL
// translations	TEXT	NO	NULL
// attributes	TEXT	NO	NULL
// sharing	TEXT	NO	NULL
