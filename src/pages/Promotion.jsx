import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { promotionService } from "../services";
import moment from "moment";
import { Pencil } from "lucide-react";
import PromotionForm from "../components/form/PromotionForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { getSortOrder } from "../utils";

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
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
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const response = await promotionService.getAllPromotions(
          searchParams.toString()
        );
        setPromotions(
          response.data.map((item) => ({ ...item, key: item.promotionId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch promotion list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchPromotions();
    setFetchData(false);
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Hình ảnh</span>
        </div>
      ),
      dataIndex: "promotionThumbnail",
      align: "center",
      render: (promotionThumbnail) => (
        <div className="flex justify-center">
          <img
            src={promotionThumbnail.url}
            alt="category"
            className="w-8 h-8 object-cover rounded-md"
          />
        </div>
      ),
      width: "8%",
    },
    {
      title: (
        <div className="text-center">
          <span>Tên khuyến mãi</span>
        </div>
      ),
      dataIndex: "promotionName",
      width: "30%",
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
      sortOrder: getSortOrder(searchParams, "startDate"),
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
      sortOrder: getSortOrder(searchParams, "endDate"),
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
              setSelectedPromotion(record);
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
        title="Khuyến mãi"
        searchPlaceholder={"Nhập tên khuyến mãi để tìm kiếm..."}
        data={promotions}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedPromotion}
        setFetchData={setFetchData}
        pagination={pagination}
        expandable={{
          expandedRowRender: (record) => (
            <p className="m-0">
              <span className="font-semibold">Mô tả:</span> {record.description}
            </p>
          ),
          rowExpandable: (record) =>
            record.promotionName !== "Không có mô tả về khuyến mãi này!",
        }}
      />
      <PromotionForm
        open={open}
        setOpen={setOpen}
        data={selectedPromotion}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Promotion;
