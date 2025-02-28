import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { voucherService } from "../services";
import moment from "moment";
import { Pencil } from "lucide-react";
import VoucherForm from "../components/form/VoucherForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { getSortOrder } from "../utils";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [fetchData, setFetchData] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    limit: 10,
    total: 0,
  });

  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await voucherService.getAllVouchers(
          searchParams.toString()
        );
        setVouchers(
          response.data.map((item) => ({ ...item, key: item.voucherId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch voucher list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchVouchers();
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Mã</span>
        </div>
      ),
      dataIndex: "voucherCode",
    },
    {
      title: (
        <div className="text-center">
          <span>Loại</span>
        </div>
      ),
      align: "center",
      dataIndex: "discountType",
      render: (discountType) => {
        if (discountType === "percentage")
          return <Tag color="blue">Phần trăm</Tag>;
        else if (discountType === "fixed_amount")
          return <Tag color="orange">Cố định</Tag>;
      },
      filters: [
        { text: "Phần trăm", value: "percentage" },
        { text: "Cố định", value: "fixed_amount" },
      ],
      filteredValue: [searchParams.get("discountType")],
      filterMultiple: false,
    },
    {
      title: (
        <div className="text-center">
          <span>Giảm</span>
        </div>
      ),
      align: "right",
      dataIndex: "discountValue",
      render: (discountValue, record) => {
        if (record.discountType === "percentage")
          return <p>{discountValue}%</p>;
        else if (record.discountType === "fixed_amount")
          return <p>{discountValue.toLocaleString("vi-VN")}đ</p>;
      },
    },
    {
      title: (
        <div className="text-center">
          <span>Đã thu thập</span>
        </div>
      ),
      align: "center",
      dataIndex: "collectedQuantity",
      render: (collectedQuantity, record) => (
        <p>
          {collectedQuantity}/{record.quantity}
        </p>
      ),
      sorter: true,
      sortOrder: getSortOrder(searchParams, "collectedQuantity")
    },
    {
      title: (
        <div className="text-center">
          <span>Đã sử dụng</span>
        </div>
      ),
      align: "center",
      dataIndex: "currentUsedQuantity",
      sorter: true,
      sortOrder: getSortOrder(searchParams, "currentUsedQuantity")
    },
    {
      title: (
        <div className="text-center">
          <span>Bắt đầu</span>
        </div>
      ),
      dataIndex: "startDate",
      align: "center",
      render: (startDate) => moment(startDate).format("DD/MM/YYYY"),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: true,
      sortOrder: getSortOrder(searchParams, "startDate")
    },
    {
      title: (
        <div className="text-center">
          <span>Kết thúc</span>
        </div>
      ),
      dataIndex: "endDate",
      align: "center",
      render: (endDate) => moment(endDate).format("DD/MM/YYYY"),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: true,
      sortOrder: getSortOrder(searchParams, "endDate")
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
              setSelectedVoucher(record);
              setOpen(true);
            }}
          >
            <Pencil strokeWidth={1} size={20} color="blue" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        title="Mã giảm giá"
        searchPlaceholder={"Nhập mã giảm giá để tìm kiếm..."}
        data={vouchers}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedVoucher}
        setFetchData={setFetchData}
        pagination={pagination}
        expandable={{
          expandedRowRender: (record) => (
            <p className="m-0">
              <span className="font-semibold">Điều kiện áp dụng: </span>
              {record.discountType === "percentage" &&
                `giảm tối đa ${record.maxPriceDiscount.toLocaleString(
                  "vi-VN"
                )}đ cho `}
              {`đơn hàng từ ${record.minOrderPrice.toLocaleString("vi-VN")}đ.`}
            </p>
          ),
          rowExpandable: (record) =>
            record.discountType !== "Không có mô tả về mã giảm giá này!",
        }}
      />
      <VoucherForm
        open={open}
        setOpen={setOpen}
        data={selectedVoucher}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Voucher;
