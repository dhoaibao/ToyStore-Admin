import { UserOutlined, LogoutOutlined, LockOutlined } from "@ant-design/icons";
import { Dropdown, Space, Avatar } from "antd";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import generateAvatar from "../../utils/generateAvatar";

const ProfileDropdown = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);

  const location = useLocation();

  const user = useSelector((state) => state.user.user);
  const isLogin = useSelector((state) => state.user.isLogin);

  const { color, initial } = generateAvatar(user?.email, user?.fullName);

  useEffect(() => {
    setChangePassOpen(false);
    setProfileOpen(false);
  }, [location]);

  const items = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => setProfileOpen(true),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      icon: <LockOutlined />,
      onClick: () => setChangePassOpen(true),
    },

    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.clear();
        window.location.reload();
      },
    },
  ];
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        overlayClassName="custom-dropdown-menu"
      >
        <a onClick={(e) => e.preventDefault()}>
          <div className="flex items-center space-x-3">
            <p className="font-semibold">
              {isLogin ? user.fullName : "Đăng nhập"}
            </p>
            <Space>
              <Avatar
                src={user?.avatar?.url}
                style={{
                  backgroundColor: user?.avatar?.url ? "transparent" : color,
                  fontSize: 16,
                }}
              >
                {!user?.avatar?.url && initial}
              </Avatar>
            </Space>
          </div>
        </a>
      </Dropdown>
      <Profile open={profileOpen} setOpen={setProfileOpen} />
      <ChangePassword open={changePassOpen} setOpen={setChangePassOpen} />
    </>
  );
};
export default ProfileDropdown;
