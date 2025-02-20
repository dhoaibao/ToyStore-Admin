import { LogIn } from "lucide-react";
import { useEffect } from "react";
import ProfileDropdown from "../profile/ProfileDropdown";
import { getLoggedInUser } from "../../redux/thunks/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="flex items-center justify-end bg-white space-x-4 p-4">
      <Bell strokeWidth={1} />

      <button
        onClick={() => !isLogin && handleLogin}
        className="flex items-center justify-center"
      >
        {isLogin ? <ProfileDropdown /> : <LogIn strokeWidth={1} />}
      </button>
    </div>
  );
};

export default Header;
