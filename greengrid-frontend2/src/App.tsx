import { useRoutes } from "react-router-dom";
import LandingPage from "./pages/landing";
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import MainLayout from "./layouts/main-layout";
import ContactPage from "./features/auth/contact";

export default function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <LandingPage /> },
        { path:"contact", element:<ContactPage/> }
      ],  
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return routes;
}