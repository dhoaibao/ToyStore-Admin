import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavItem = ({ to, title, icon, childrenItem = [], modules }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;
  const hasChildren = childrenItem.length > 0;

  const isAnyChildActive = hasChildren
    ? childrenItem.some(
        (child) => child.to && location.pathname.startsWith(child.to)
      )
    : false;

  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true);
    }
  }, [isAnyChildActive]);

  const handleClick = () => {
    if (hasChildren) setIsOpen((prev) => !prev);
    else navigate(to);
  };

  return (
    <div className="w-full">
      <div
        className={`group flex justify-between cursor-pointer items-center md:text-sm font-bold p-2 rounded-lg hover:bg-white hover:text-primary transition-colors duration-200
          ${isActive ? "bg-white text-primary" : ""}
          ${isOpen ? "bg-blue-800" : ""}`}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-2">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
        {hasChildren && (
          <span>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="pl-8 mt-2 space-y-2">
          {childrenItem.map(
            (child, index) =>
              modules.includes(child.module) && (
                <div
                  key={index}
                  className={`group flex justify-between cursor-pointer items-center md:text-sm font-bold p-2 rounded-lg hover:bg-white hover:text-primary transition-colors duration-200
          ${location.pathname === child.to ? "bg-white text-primary" : ""}`}
                  onClick={() => navigate(child.to)}
                >
                  <div className="flex items-center space-x-2">
                    {child.icon && <span>{child.icon}</span>}
                    <span>{child.title}</span>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

NavItem.propTypes = {
  to: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  childrenItem: PropTypes.array,
  modules: PropTypes.array.isRequired,
};

export default NavItem;
