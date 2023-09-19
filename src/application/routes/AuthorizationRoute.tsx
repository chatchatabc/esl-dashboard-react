import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authGetProfile } from "../../domain/services/authService";
import NotFoundPage from "../pages/NotFoundPage";
import { Outlet } from "react-router-dom";

type Props = {
  allowedRoles: number[];
  children?: React.ReactNode;
};

export function AuthorizationRoute({ allowedRoles, children }: Props) {
  const userQuery = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const data = await authGetProfile();
      return data;
    },
  });

  if (userQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (allowedRoles.includes(userQuery.data?.roleId ?? 0)) {
    return <div>{children ?? <Outlet />}</div>;
  }

  return <NotFoundPage />;
}

export default AuthorizationRoute;
