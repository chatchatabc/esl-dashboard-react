import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import MessagePage from "./pages/MessagePage";
import MessageTemplatePage from "./pages/MessageTemplatePage";
import UserPage, { userLoader } from "./pages/UserPage";
import UserProfilePage from "./pages/UserProfilePage";
import TeacherPage from "./pages/TeacherPage";
import TeacherProfilePage from "./pages/TeacherProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "home",
        element: <h1>Home</h1>,
      },
      {
        path: "users",
        children: [
          {
            path: "",
            loader: userLoader,
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
        element: <MessagePage />,
      },
      {
        path: "message-templates",
        element: <MessageTemplatePage />,
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
