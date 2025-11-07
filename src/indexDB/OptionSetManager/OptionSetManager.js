import db from "../db";
import { metadataApi } from "@/api";
import { TABLE_NAME } from ".";

export const pull = async () => {
  try {
    // clear the table
    await db[TABLE_NAME].clear();

    const result = await metadataApi.getOptionSets();

    if (result.optionSets && result.optionSets.length > 0) {
      await addOptionSets(result.optionSets);
    }
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const addOptionSets = async (me) => {
  try {
    await db[TABLE_NAME].bulkPut(me);
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const getAlloptionSets = async () => {
  try {
    const optionSets = await db[TABLE_NAME].toArray();
    return { optionSets };
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};

// USE FOR CREATE options TABLE
// export const TABLE_FIELDS =
//     'id, code, name, description, version, valueType, translations, attributes, sharing, parentId, mpath';

/**
 * id	INTEGER	NO	NULL	
code	varchar(255)	YES	NULL	
name	TEXT	NO	NULL	
description	TEXT	YES	NULL	
version	INTEGER	NO	0	
valueType	TEXT	YES	NULL	
translations	TEXT	NO	NULL	
attributes	TEXT	NO	NULL	
sharing	TEXT	YES	NULL	
parentId	INTEGER	YES	NULL	option(id)
mpath	varchar	YES	"''"	
 */
