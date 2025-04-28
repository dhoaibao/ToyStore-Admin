import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { promotionService } from "../services";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import PromotionForm from "../components/promotion/PromotionForm";
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

  console.log(promotions)

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
      width: "35%",
    },
    {
      title: (
        <div className="text-center">
          <span>Mô tả</span>
        </div>
      ),
      dataIndex: "description",
      width: "45%",
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
