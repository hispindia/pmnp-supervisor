import db from "../db";
import { get, groupBy } from "lodash";
import { metadataApi } from "@/api";
import { TABLE_NAME } from ".";
import * as meManager from "@/indexDB/MeManager/MeManager";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();
    const orgs = await metadataApi.get(`/api/organisationUnits`, {}, [
      "filter=level:in:[1,2,3,4]&paging=false&fields=id,code,path,displayName,level,parent,translations",
    ]);

    if (orgs.organisationUnits && orgs.organisationUnits.length > 0) {
      await addOrgs(orgs.organisationUnits);
    }

    const orgsByUser = await metadataApi.getUserOrgUnits();

    if (orgsByUser.organisationUnits && orgsByUser.organisationUnits.length > 0) {
      const addWithinUserHierarchy = orgsByUser.organisationUnits.map((org) => {
        org.withinUserHierarchy = 1;
        return org;
      });

      await addOrgs(addWithinUserHierarchy);
    }
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const addOrgsPath = async (orgs) => {
  try {
    await db.organisationsPath.bulkPut(orgs);
    // orgs.forEach(async (org) => {

    // });
  } catch (error) {
    console.error(`Failed to add org path`, error);
  }
};

export const getUserOrgs = async () => {
  try {
    const orgs = await db[TABLE_NAME].where("withinUserHierarchy").equals(1).toArray();

    // With children
    orgs.forEach(async (org) => {
      const childrenOrgs = await db[TABLE_NAME].where("path")
        .startsWith(org.path + "/")
        .toArray();

      org.children = childrenOrgs;
    });

    return { organisationUnits: orgs };
  } catch (error) {
    console.error(`Failed to get user org`, error);
  }
};

export const getOrgUnitSelectorData = async ({ orgUnits, filter }) => {
  // const orgUnits = await getUserOrgs();
  const me = await meManager.getMe();

  let data = {};
  data.tree = orgUnits.reduce((accumulator, currentOu) => {
    currentOu.children = currentOu.children.sort(function (a, b) {
      var nameA = a.displayName.toUpperCase();
      var nameB = b.displayName.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    accumulator[`organisationUnits/${currentOu.id}`] = currentOu;
    return accumulator;
  }, {});

  data.roots = me.organisationUnits.map((ou) => ou.id);

  return data;
};

export const addOrgs = async (orgUnits) => {
  try {
    const byLevel = groupBy(orgUnits, (o) => o.level);
    const levels = Object.keys(byLevel).sort();
    const persisted = {};

    for (const level of levels) {
      const objects = byLevel[level];

      // Add parent to each orgs ??? do we need this?
      // objects.forEach((o) => {
      //     if (o.parent) {
      //         o.parent = persisted[o.parent.id];
      //     }
      // });

      await db[TABLE_NAME].bulkPut(objects);

      objects.forEach((o) => {
        persisted[o.id] = o;
      });
    }
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const getAllOrganisationUnits = async () => {
  try {
    const orgs = await db[TABLE_NAME].toArray();

    return { organisationUnits: orgs };
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};

export const getOrgById = async (id) => {
  try {
    const orgs = await db[TABLE_NAME].get({ id });

    return orgs;
  } catch (error) {
    console.error(`Failed to get org`, error);
  }
};

export const getOrgWithChildren = async (id) => {
  try {
    const org = await getOrgById(id);

    if (!org) {
      return null;
    }

    const childrenOrgs = await db[TABLE_NAME].where("path")
      .startsWith(org.path + "/")
      .toArray();

    org.children = childrenOrgs;

    return org;
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};
