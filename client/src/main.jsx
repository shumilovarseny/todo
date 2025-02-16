import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Tasks } from "./pages/Tasks.jsx";
import { Projects } from "./pages/Projects.jsx";
import { ProjectInfo } from "./pages/ProjectInfo.jsx";
import { Account } from "./pages/Account.jsx";
import { Registration } from "./pages/Registration.jsx";
import { Login } from "./pages/Login.jsx";
import store from "./store.js";
import { Provider, useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute.JSX";
import { YourAccount } from "./components/YourAccount.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <>Такой страницы не существует</>,
    children: [
      {
        path: "/",
        element: <Tasks />,
      },
      {
        path: "/:filter",
        element: <Tasks />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/:projectId",
        element: <ProjectInfo />,
      },
      {
        path: "/projects/new",
        element: <ProjectInfo newProject={true} />,
      },
      {
        path: "/account/:userId",
        element: <Account />,
      },
      {
        path: "/account/you/",
        element: <YourAccount />,
      },
    ],
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
