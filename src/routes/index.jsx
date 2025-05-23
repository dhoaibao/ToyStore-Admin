import Home from "../pages/Home";
import Login from "../pages/Login";
import Product from "../pages/Product";
import Category from "../pages/Category";
import Brand from "../pages/Brand";
import ProductInfo from "../pages/ProductInformation";
import Order from "../pages/Order";
import Promotion from "../pages/Promotion";
import Voucher from "../pages/Voucher";
import User from "../pages/User";
import Role from "../pages/Role";
import Permission from "../pages/Permission";
import Review from "../pages/Review";
import ChatPage from "../pages/ChatPage";
import News from "../pages/News"

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
  {
    id: "promotion",
    path: "/promotions",
    element: <Promotion />,
  },
  {
    id: "voucher",
    path: "/vouchers",
    element: <Voucher />,
  },
  {
    id: "user",
    path: "/users",
    element: <User />,
  },
  {
    id: "role",
    path: "/roles",
    element: <Role />,
  },
  {
    id: "permission",
    path: "/permissions",
    element: <Permission />,
  },
  {
    id: "review",
    path: "/reviews",
    element: <Review />,
  },
  {
    id: "chat",
    path: "/chats",
    element: <ChatPage />,
  },
  {
    id: "news",
    path: "/news",
    element: <News />,
  }
];

export default routes;
