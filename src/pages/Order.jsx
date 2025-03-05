import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { orderService } from "../services";
import moment from "moment";
import { Eye, Pencil } from "lucide-react";
import OrderForm from "../components/form/OrderForm";
import OrderDetail from "../components/others/OrderDetail";
import OrderStatus from "../components/others/OrderStatus";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { ORDER_STATUS } from "../constants";
import { getSortOrder } from "../utils";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openOrderStatus, setOpenOrderStatus] = useState(false);
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
      } catch (error) {
        console.error("Failed to fetch order list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchOrders();
    setFetchData(false);
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Mã ĐH</span>
        </div>
      ),
      align: "center",
      dataIndex: "orderId",
      width: "8%",
      sorter: true,
      sortOrder: getSortOrder(searchParams, "orderId"),
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
      sorter: true,
      sortOrder: getSortOrder(searchParams, "finalPrice"),
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
      sorter: true,
      sortOrder: getSortOrder(searchParams, "createdAt"),
    },
    {
      title: (
        <div className="text-center">
          <span>Trạng thái</span>
        </div>
      ),
      dataIndex: "orderStatus",
      align: "center",
      render: (_, record) => {
        const status =
          record.orderTrackings[record.orderTrackings.length - 1].orderStatus;
        return (
          <Tag color={ORDER_STATUS[status.statusName].color}>
            {ORDER_STATUS[status.statusName].label}
          </Tag>
        );
      },
      filters: Object.values(ORDER_STATUS).map(({ label, key }) => ({
        text: label,
        value: key,
      })),
      filteredValue: [searchParams.get("orderStatus")],
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
      filteredValue: [searchParams.get("paymentStatus")],
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
          <>
            <Button
              type="text"
              onClick={() => {
                setSelectedOrder(record);
                setOpenOrderStatus(true);
              }}
            >
              <Pencil strokeWidth={1} size={20} color="blue" />
            </Button>
            <Button
              type="text"
              onClick={() => {
                setSelectedOrder(record);
                setOpenDetail(true);
              }}
            >
              <Eye strokeWidth={1} size={20} color="blue" />
            </Button>
          </>
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
        addButton={false}
      />
      <OrderForm
        open={open}
        setOpen={setOpen}
        data={selectedOrder}
        setFetchData={setFetchData}
      />
      <OrderDetail
        open={openDetail}
        setOpen={setOpenDetail}
        data={selectedOrder}
      />
      <OrderStatus
        open={openOrderStatus}
        setOpen={setOpenOrderStatus}
        data={selectedOrder}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Order;
