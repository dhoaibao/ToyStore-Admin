const ORDER_STATUS = {
    pending: { key: "pending", id: 1, label: "Chờ xác nhận", color: "orange" },
    confirmed: { key: "processing", id: 2, label: "Đang xử lý", color: "yellow" },
    shipping: { key: "shipping", id: 3, label: "Đang giao", color: "blue" },
    delivered: { key: "delivered", id: 4, label: "Đã giao", color: "green" },
    canceled: { key: "canceled", id: 5, label: "Đã hủy", color: "red" },
  };  
export default ORDER_STATUS;