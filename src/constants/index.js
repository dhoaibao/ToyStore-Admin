import React from "react";
import {
  CircleEllipsis,
  CircleCheckBig,
  Truck,
  PackageCheck,
  CircleX,
} from "lucide-react";
import { InputNumber, Select, AutoComplete, Input } from "antd";

export const ORDER_STATUS = {
  pending: { key: "pending", id: 1, label: "Chờ xác nhận", color: "orange" },
  confirmed: { key: "confirmed", id: 2, label: "Đang xử lý", color: "purple" },
  shipping: { key: "shipping", id: 3, label: "Đang giao", color: "blue" },
  delivered: { key: "delivered", id: 4, label: "Đã giao", color: "green" },
  canceled: { key: "canceled", id: 5, label: "Đã hủy", color: "red" },
};

export const ICON_MAP = {
  pending: React.createElement(CircleEllipsis, {
    key: "circle-ellipsis",
    strokeWidth: 1,
  }),
  confirmed: React.createElement(CircleCheckBig, {
    key: "circle-check",
    strokeWidth: 1,
  }),
  shipping: React.createElement(Truck, { key: "truck", strokeWidth: 1 }),
  delivered: React.createElement(PackageCheck, {
    key: "package-check",
    strokeWidth: 1,
  }),
  canceled: React.createElement(CircleX, { key: "circle-x", strokeWidth: 1 }),
};

export const PAYMENT_METHOD = {
  cod: { id: 1, label: "Thanh toán khi nhận hàng", color: "green" },
  vnpay: { id: 2, label: "Thanh toán qua VNPay", color: "gray" },
};

export const COMPONENT_MAP = {
  INPUT_NUMBER: React.createElement(InputNumber),
  SELECT: React.createElement(Select),
  AUTOCOMPLETE: React.createElement(AutoComplete),
  INPUT: React.createElement(Input),
};

export const MODULES = [
  "PRODUCT",
  "CATEGORY",
  "BRAND",
  "PRODUCT_INFORMATION",
  "PROMOTION",
  "VOUCHER",
  "ORDER",
  "REVIEW",
  "USER",
  "ROLE",
  "PERMISSION",
  "SYSTEM_CONFIGURATION",
];

export const TIME_INTERVAL = {
  day: "theo ngày",
  month: "theo tháng",
  quarter: "theo quý",
  year: "theo năm",
};
