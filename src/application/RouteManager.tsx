import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthorizationRoute from "./routes/AuthorizationRoute";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "home",
        async lazy() {
          const { HomePage } = await import("./pages/HomePage");
          return { Component: HomePage };
        },
      },
      {
        path: "bookings",
        async lazy() {
          const { BookingsPage } = await import("./pages/BookingsPage");
          return { Component: BookingsPage };
        },
      },
      {
        path: "users",
        async lazy() {
          return {
            Component: () => {
              return AuthorizationRoute({ allowedRoles: [1] });
            },
          };
        },
        children: [
          {
            path: "",
            async lazy() {
              const { UserPage } = await import("./pages/UserPage");
              return { Component: UserPage };
            },
          },
          {
            path: ":username",
            async lazy() {
              const { UserProfilePage } = await import(
                "./pages/UserProfilePage"
              );
              return { Component: UserProfilePage };
            },
          },
        ],
      },
      {
        path: "teachers",
        async lazy() {
          return {
            Component: () => {
              return AuthorizationRoute({ allowedRoles: [1, 2] });
            },
          };
        },
        children: [
          {
            path: "",
            async lazy() {
              const { TeacherPage } = await import("./pages/TeacherPage");
              return { Component: TeacherPage };
            },
          },
          {
            path: ":username",
            async lazy() {
              const { TeacherProfilePage } = await import(
                "./pages/TeacherProfilePage"
              );
              return { Component: TeacherProfilePage };
            },
          },
        ],
      },
      {
        path: "messages",
        async lazy() {
          const { MessagePage } = await import("./pages/MessagePage");

          return {
            Component: () => {
              return AuthorizationRoute({
                allowedRoles: [1],
                children: MessagePage(),
              });
            },
          };
        },
      },
      {
        path: "message-templates",
        async lazy() {
          const { MessageTemplatePage } = await import(
            "./pages/MessageTemplatePage"
          );

          return {
            Component: () => {
              return AuthorizationRoute({
                allowedRoles: [1],
                children: MessageTemplatePage(),
              });
            },
          };
        },
      },
    ],
  },
  {
    path: "/login",
    async lazy() {
      const { LoginPage } = await import("./pages/LoginPage");
      return { Component: LoginPage };
    },
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
