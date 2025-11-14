import { useUser } from "./useUser";

const accessAbleRoleIDs = ["RgsiAXF6U8e"];

export const useAccessControl = () => {
  const { user, isSuperuser } = useUser();
  const userRolesIds = (user.userRoles || []).map((role) => role.id);

  // Check if user has any role that belongs to accessAbleRoleIDs or is superuser
  const isAccessAble = isSuperuser || userRolesIds.some((roleId) => accessAbleRoleIDs.includes(roleId));

  const userRoleNames = (user.userRoles || []).map((role) => role.name).join(", ");

  return {
    isAccessAble,
    userRoleNames: userRoleNames || "Unknown",
    userRolesIds,
    isSuperuser,
  };
};
