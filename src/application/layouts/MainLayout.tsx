import { Navigate, Outlet } from "react-router-dom";
import { authGetToken } from "../../domain/services/authService";

function MainLayout() {
  if (!authGetToken()) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default MainLayout;
