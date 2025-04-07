import PropTypes from "prop-types";

const AuthLayout = ({ children }) => {
  return (
    <div
      className="flex items-center container justify-center bg-gray-200 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/public/login_bg.png')" }}
    >
      {children}
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};

export default AuthLayout;
