import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import TeacherActivityPage from "../pages/TeacherActivityPage";
import path from "path";
import UpcomingClassPage from "../pages/UpcomingClassPage";
import TeacherCalendarPage from "../pages/TeacherCalendarPage";

// Lazy load pages
const UserPage = React.lazy(() => import("../pages/UserPage"));
const TeacherPage = React.lazy(() => import("../pages/TeacherPage"));
const MessagePage = React.lazy(() => import("../pages/MessagePage"));
const MessageTemplatePage = React.lazy(
  () => import("../pages/MessageTemplatePage")
);
const BookingsPage = React.lazy(() => import("../pages/BookingsPage"));
const HomePage = React.lazy(() => import("../pages/HomePage"));
const UserProfilePage = React.lazy(() => import("../pages/UserProfilePage"));
const TeacherProfilePage = React.lazy(
  () => import("../pages/TeacherProfilePage")
);
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const NotFoundPage = React.lazy(() => import("../pages/NotFoundPage"));
const MainLayout = React.lazy(() => import("../layouts/MainLayout"));
const AuthorizationRoute = React.lazy(
  () => import("../routes/AuthorizationRoute")
);
const StudentPage = React.lazy(() => import("../pages/StudentPage"));
const StudentProfilePage = React.lazy(
  () => import("../pages/StudentProfilePage")
);
const EvaluationsPage = React.lazy(() => import("../pages/EvaluationsPage"));

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
        path: "students",
        element: <AuthorizationRoute allowedRoles={[1]} />,
        children: [
          {
            path: "",
            element: <StudentPage />,
          },
          {
            path: ":username",
            element: <StudentProfilePage />,
          },
        ],
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
        path: "evaluations",
        element: <EvaluationsPage />,
      },
      {
        path: "calendar",
        element: <TeacherCalendarPage />,
      },
      {
        path: "upcoming-classes",
        element: <UpcomingClassPage />,
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
            children: [
              {
                path: "",
                element: <TeacherProfilePage />,
              },
              {
                path: "activity",
                element: <TeacherActivityPage />,
              },
            ],
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
