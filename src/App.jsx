import "./App.css";
import Loading from "./components/common/Loading";
import NotFoundPage from "./pages/NotFound";
import routes from "./routes";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import viVN from "antd/locale/vi_VN";
import ProtectedRoute from "./routes/ProtectedRoute";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));

dayjs.locale("vi");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          colorPrimary: "#122da6",
        },
        components: {
          Breadcrumb: {
            itemColor: "white",
            linkColor: "white",
            lastItemColor: "white",
            linkHoverColor: "white",
            separatorColor: "white",
          },
          Table: {
            headerBg: "#122da6",
            headerColor: "white",
            headerSortActiveBg: "#122da6",
            headerSortActiveColor: "white",
            headerSortHoverBg: "#122da6",
            headerSortHoverColor: "white",
            headerFilterActiveBg: "#122da6",
            headerFilterActiveColor: "white",
            headerFilterHoverBg: "#122da6",
            headerFilterHoverColor: "white",
            headerFilterIconColor: "white",
            cellPaddingBlock: "8px",
            rowHoverBg: "#DBEAFE",
          },
        },
      }}
    >
      <Suspense
        fallback={
          <div className="w-screen h-screen">
            <Loading />
          </div>
        }
      >
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {routes.map(({ id, path, element }) => (
              <Route
                key={id}
                path={path}
                element={
                  path.startsWith("/auth") ? (
                    <AuthLayout>{element}</AuthLayout>
                  ) : (
                    <ProtectedRoute>
                      <MainLayout>{element}</MainLayout>
                    </ProtectedRoute>
                  )
                }
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
