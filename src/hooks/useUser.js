import { useSelector } from "react-redux";

export const useUser = () => {
  const user = useSelector((state) => state.me);
  const isSuperuser = user?.userRoles.some((role) => role.code === "Superuser");

  return {
    user,
    isSuperuser,
  };
};
