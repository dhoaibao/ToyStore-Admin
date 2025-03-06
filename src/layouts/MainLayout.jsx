import ScrollToTop from "../components/common/ScrollToTop";
import Header from "../components/common/Header";
import Sidebar from "../components/common/SideBar";
import PropTypes from "prop-types";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-row container w-full min-h-screen">
      <div className="w-1/5 h-screen">
        <Sidebar />
      </div>
      <div className="flex flex-col w-4/5 h-screen">
        <Header />
        <ScrollToTop />
        <div className="flex-grow overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
