import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authGetUser } from "../../domain/services/authService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/header/Header";
import DynamicModalForm from "../components/forms/DynamicModalForm";
import React from "react";
import LoadingComp from "../components/loading/LoadingComp";

export function MainLayout() {
  const { pathname } = useLocation();

  if (!authGetUser()) {
    return <Navigate to="/login" />;
  }

  if (pathname === "/") {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex-1 flex flex-col divide-y-2 divide-black">
      {/* Header */}
      <header>
        <Navbar />
      </header>

      {/* Section */}
      <section className="divide-x-2 divide-black flex flex-1">
        {/* Sidebar */}
        <aside className="min-w-[15vw]">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="w-[85vw] flex flex-col">
          <React.Suspense fallback={<LoadingComp />}>
            <Outlet />
          </React.Suspense>
        </main>
      </section>

      <DynamicModalForm />
    </div>
  );
}

export default MainLayout;
