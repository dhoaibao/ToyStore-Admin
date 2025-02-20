import Home from "../pages/Home";
import Login from "../pages/Login";
import Product from "../pages/Product";

const routes = [
  {
    id: "home",
    path: "/",
    element: <Home />,
  },
  {
    id: "login",
    path: "/auth/login",
    element: <Login />,
  },
  {
    id: "product",
    path: "/products",
    element: <Product />,
  },
];

export default routes;
