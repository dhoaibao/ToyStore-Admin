import NavItem from "./NavItem";
import {
  ChartArea,
  User,
  Package,
  ClipboardList,
  MessageCircle,
  Star,
  KeyRound,
  Bolt,
  Ticket,
  BadgePercent,
} from "lucide-react";
import { Divider } from "antd";

const Sidebar = () => {
  const menuItems = [
    {
      to: "/",
      title: "Tổng quan",
      icon: <ChartArea strokeWidth={1} />,
    },
    {
      title: "Quản lý sản phẩm",
      icon: <Package strokeWidth={1} />,
      children: (
        <div className="space-y-2">
          <NavItem to="/products" title="Sản phẩm" />
          <NavItem to="/categories" title="Danh mục" />
          <NavItem to="/brands" title="Thương hiệu" />
          <NavItem to="/products-information" title="Thông tin sản phẩm" />
        </div>
      ),
    },
    {
      to: "/promotions",
      title: "Khuyến mãi",
      icon: <BadgePercent strokeWidth={1} />,
    },
    {
      to: "/vouchers",
      title: "Mã giảm giá",
      icon: <Ticket strokeWidth={1} />,
    },
    {
      to: "/orders",
      title: "Đơn hàng",
      icon: <ClipboardList strokeWidth={1} />,
    },
    {
      to: "/chats",
      title: "Tin nhắn",
      icon: <MessageCircle strokeWidth={1} />,
    },
    {
      to: "/reviews",
      title: "Đánh giá",
      icon: <Star strokeWidth={1} />,
    },
    {
      to: "/users",
      title: "Người dùng",
      icon: <User strokeWidth={1} />,
    },
    {
      title: "Phân quyền",
      icon: <KeyRound strokeWidth={1} />,
      children: (
        <div className="space-y-2">
          <NavItem to="/roles" title="Vai trò" />
          <NavItem to="/permission" title="Quyền hạn" />
        </div>
      ),
    },
    {
      to: "/system-config",
      title: "Cấu hình hệ thống",
      icon: <Bolt strokeWidth={1} />,
    },
  ];
  return (
    <div className="bg-primary text-white h-screen p-4 flex flex-col">
      <div className="sticky top-0 pt-4 z-10 bg-primary">
        <div className="flex justify-center bg-white rounded-xl">
          <img src="/src/assets/Logo(150x50).png" alt="Logo" className="h-12" />
        </div>
        <Divider className="bg-white" />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4">
        {menuItems.map((item, index) => (
          <NavItem key={index} to={item.to} title={item.title} icon={item.icon}>
            {item.children}
          </NavItem>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
