import ScrollToTop from "../components/common/ScrollToTop";
import Header from "../components/common/Header";
import Sidebar from "../components/common/SideBar";
import PropTypes from "prop-types";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex flex-col w-5/6">
        <Header />
        <ScrollToTop />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
