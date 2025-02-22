import Home from "../pages/Home";
import Login from "../pages/Login";
import Product from "../pages/Product";
import Category from "../pages/Category";
import Brand from "../pages/Brand";
import ProductInfo from "../pages/ProductInfo";
import Order from "../pages/Order";

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
  {
    id: "category",
    path: "/categories",
    element: <Category />,
  },
  {
    id: "brand",
    path: "/brands",
    element: <Brand />,
  },
  {
    id: "products-information",
    path: "/products-information",
    element: <ProductInfo />,
  },
  {
    id: "order",
    path: "/orders",
    element: <Order />,
  },
];

export default routes;
