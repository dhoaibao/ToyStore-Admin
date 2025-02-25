import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { orderService } from "../services";
import moment from "moment";
import { Eye } from "lucide-react";
import OrderForm from "../components/form/OrderForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fetchData, setFetchData] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    limit: 10,
    total: 0,
  });

  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderService.getAllOrders(
          searchParams.toString()
        );
        setOrders(
          response.data.map((item) => ({ ...item, key: item.orderId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch order list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchOrders();
  }, [fetchData, searchParams]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "orange";
      case "Đang xử lý":
        return "yellow";
      case "Đang giao":
        return "blue";
      case "Đã giao":
        return "green";
      case "Đã hủy":
        return "red";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Mã ĐH</span>
        </div>
      ),
      align: "center",
      dataIndex: "orderId",
      sorter: (a, b) => a.orderId - b.orderId,
      width: "8%",
    },
    {
      title: (
        <div className="text-center">
          <span>Tên khách hàng</span>
        </div>
      ),
      align: "left",
      dataIndex: ["user", "fullName"],
      width: "25%",
    },
    {
      title: (
        <div className="text-center">
          <span>Giá</span>
        </div>
      ),
      align: "right",
      dataIndex: "finalPrice",
      render: (finalPrice) => `${finalPrice.toLocaleString("vi-VN")}đ`,
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: (a, b) => a.finalPrice - b.finalPrice,
    },
    {
      title: (
        <div className="text-center">
          <span>Ngày đặt</span>
        </div>
      ),
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY"),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: (
        <div className="text-center">
          <span>Trạng thái</span>
        </div>
      ),
      dataIndex: "orderStatus",
      align: "center",
      render: (status) => {
        return (
          <Tag color={getStatusColor(status.statusName)}>
            {status.statusName}
          </Tag>
        );
      },
      filters: [
        {
          text: "Chờ xác nhận",
          value: 1,
        },
        {
          text: "Đang xử lý",
          value: 2,
        },
        {
          text: "Đang giao",
          value: 3,
        },
        {
          text: "Đã giao",
          value: 4,
        },
        {
          text: "Đã hủy",
          value: 5,
        },
      ],
      filterMultiple: false,
    },
    {
      title: (
        <div className="text-center">
          <span>Thanh toán</span>
        </div>
      ),
      dataIndex: "paymentStatus",
      align: "center",
      render: (paymentStatus) => {
        return paymentStatus ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chờ thanh toán</Tag>
        );
      },
      filters: [
        {
          text: "Đã thanh toán",
          value: true,
        },
        {
          text: "Chờ thanh toán",
          value: false,
        },
      ],
      filterMultiple: false,
    },
    {
      title: (
        <div className="text-center">
          <span>Hành động</span>
        </div>
      ),
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Button
            type="text"
            onClick={() => {
              setSelectedOrder(record);
              setOpen(true);
            }}
          >
            <Eye strokeWidth={1} size={20} color="blue" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        title="Đơn hàng"
        searchPlaceholder={
          "Nhập mã đơn hàng hoặc tên khách hàng để tìm kiếm..."
        }
        data={orders}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedOrder}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <OrderForm
        open={open}
        setOpen={setOpen}
        data={selectedOrder}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Order;
