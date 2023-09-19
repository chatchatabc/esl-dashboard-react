import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthorizationRoute from "./routes/AuthorizationRoute";
import React from "react";

// Lazy load pages
const UserPage = React.lazy(() => import("./pages/UserPage"));
const TeacherPage = React.lazy(() => import("./pages/TeacherPage"));
const MessagePage = React.lazy(() => import("./pages/MessagePage"));
const MessageTemplatePage = React.lazy(
  () => import("./pages/MessageTemplatePage")
);
const BookingsPage = React.lazy(() => import("./pages/BookingsPage"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const UserProfilePage = React.lazy(() => import("./pages/UserProfilePage"));
const TeacherProfilePage = React.lazy(
  () => import("./pages/TeacherProfilePage")
);
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "bookings",
        element: <BookingsPage />,
      },
      {
        path: "users",
        element: <AuthorizationRoute allowedRoles={[1]} />,
        children: [
          {
            path: "",
            element: <UserPage />,
          },
          {
            path: ":username",
            element: <UserProfilePage />,
          },
        ],
      },
      {
        path: "teachers",
        element: <AuthorizationRoute allowedRoles={[1, 2]} />,
        children: [
          {
            path: "",
            element: <TeacherPage />,
          },
          {
            path: ":username",
            element: <TeacherProfilePage />,
          },
        ],
      },
      {
        path: "messages",
        element: (
          <AuthorizationRoute allowedRoles={[1]}>
            <MessagePage />
          </AuthorizationRoute>
        ),
      },
      {
        path: "message-templates",
        element: (
          <AuthorizationRoute allowedRoles={[1]}>
            <MessageTemplatePage />
          </AuthorizationRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function RouteManager() {
  return <RouterProvider router={router} />;
}

export default RouteManager;
