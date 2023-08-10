import { Navigate, Outlet } from "react-router-dom";
import { authGetUserId } from "../../domain/services/authService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  if (!authGetUserId()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex-1 flex flex-col divide-y-2 divide-black">
      {/* Header */}
      <header className="container">
        <Navbar />
      </header>

      {/* Section */}
      <section className="divide-x-2 divide-black flex flex-1">
        {/* Sidebar */}
        <aside className="min-w-[200px]">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default MainLayout;
