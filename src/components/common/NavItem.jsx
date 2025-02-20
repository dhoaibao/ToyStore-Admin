import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const NavItem = ({ to, title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  const hasChildren = !!children;

  const handleClick = () => {
    if (hasChildren) setIsOpen((prev) => !prev);
    else navigate(to);
  };

  return (
    <div className="w-full">
      <div
        className={`group flex justify-between cursor-pointer items-center md:text-sm font-medium p-2 rounded-md hover:bg-white hover:text-primary transition-colors duration-200 ${
          isActive ? "bg-white text-primary font-semibold" : ""
        }`}
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

      {hasChildren && isOpen && <div className="pl-8 mt-2">{children}</div>}
    </div>
  );
};

NavItem.propTypes = {
  to: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
};

export default NavItem;
