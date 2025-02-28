import React from "react";
import {
  CircleEllipsis,
  CircleCheckBig,
  Truck,
  PackageCheck,
  CircleX,
} from "lucide-react";

export const ORDER_STATUS = {
  pending: { key: "pending", id: 1, label: "Chờ xác nhận", color: "orange" },
  confirmed: { key: "processing", id: 2, label: "Đang xử lý", color: "yellow" },
  shipping: { key: "shipping", id: 3, label: "Đang giao", color: "blue" },
  delivered: { key: "delivered", id: 4, label: "Đã giao", color: "green" },
  canceled: { key: "canceled", id: 5, label: "Đã hủy", color: "red" },
};

export const ICON_MAP = {
  pending: React.createElement(CircleEllipsis, { key: "circle-ellipsis", strokeWidth: 1 }),
  confirmed: React.createElement(CircleCheckBig, { key: "circle-check", strokeWidth: 1 }),
  shipping: React.createElement(Truck, { key: "truck", strokeWidth: 1 }),
  delivered: React.createElement(PackageCheck, { key: "package-check", strokeWidth: 1 }),
  canceled: React.createElement(CircleX, { key: "circle-x", strokeWidth: 1 }),
};

export const PAYMENT_METHOD = {
  cod: { id: 1, label: "Thanh toán khi nhận hàng", color: "green" },
  vnpay: { id: 2, label: "Thanh toán qua VNPay", color: "gray" },
};