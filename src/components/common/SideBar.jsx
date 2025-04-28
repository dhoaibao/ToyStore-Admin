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
  Newspaper
} from "lucide-react";
import { Divider } from "antd";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Sidebar = () => {
  const permissions = useSelector((state) => state.user.permissions);

  const modules = useMemo(
    () => [...new Set(permissions.map((p) => p.module))],
    [permissions]
  );

  const menuItems = useMemo(
    () => [
      {
        to: "/",
        title: "Tổng quan",
        icon: <ChartArea strokeWidth={1} />,
        module: "STATISTICS",
      },
      {
        title: "Quản lý sản phẩm",
        icon: <Package strokeWidth={1} />,
        module: null,
        children: [
          { to: "/products", title: "Sản phẩm", module: "PRODUCT" },
          { to: "/categories", title: "Danh mục", module: "CATEGORY" },
          { to: "/brands", title: "Thương hiệu", module: "BRAND" },
          {
            to: "/products-information",
            title: "Thông tin sản phẩm",
            module: "PRODUCT_INFORMATION",
          },
        ],
      },
      {
        to: "/promotions",
        title: "Khuyến mãi",
        module: "PROMOTION",
        icon: <BadgePercent strokeWidth={1} />,
      },
      {
        to: "/vouchers",
        title: "Mã giảm giá",
        module: "VOUCHER",
        icon: <Ticket strokeWidth={1} />,
      },
      {
        to: "/orders",
        title: "Đơn hàng",
        module: "ORDER",
        icon: <ClipboardList strokeWidth={1} />,
      },
      {
        to: "/chats",
        title: "Tin nhắn",
        module: null,
        icon: <MessageCircle strokeWidth={1} />,
      },
      {
        to: "/reviews",
        title: "Đánh giá",
        module: "REVIEW",
        icon: <Star strokeWidth={1} />,
      },
      {
        to: "/news",
        title: "Tin tức",
        module: "NEWS",
        icon: <Newspaper strokeWidth={1} />,
      },
      {
        to: "/users",
        title: "Người dùng",
        module: "USER",
        icon: <User strokeWidth={1} />,
      },
      {
        title: "Phân quyền",
        icon: <KeyRound strokeWidth={1} />,
        module: "PERMISSION",
        children: [
          { to: "/roles", title: "Vai trò", module: "ROLE" },
          { to: "/permissions", title: "Quyền hạn", module: "PERMISSION" },
        ],
      },
      {
        to: "/system-config",
        title: "Cấu hình hệ thống",
        module: "SYSTEM_CONFIGURATION",
        icon: <Bolt strokeWidth={1} />,
      },
    ],
    []
  );

  return (
    <div className="bg-primary text-white h-full p-4 flex flex-col">
      <div className="sticky top-0 pt-4 z-10 bg-primary">
        <div className="flex justify-center bg-white rounded-xl">
          <img src="/logo(150x50).png" alt="Logo" className="h-12" />
        </div>
        <Divider className="bg-white" />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4">
        {menuItems.map(
          (item, index) =>
            (modules.includes(item.module) || item.module === null) && (
              <NavItem
                key={index}
                to={item.to}
                title={item.title}
                icon={item.icon}
                childrenItem={item.children}
                modules={modules}
              />
            )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
