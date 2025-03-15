import { Button, Rate, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { reviewService } from "../services";
import moment from "moment";
import { MessageSquareReply } from "lucide-react";
import ReviewForm from "../components/review/ReviewForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { getSortOrder } from "../utils";

const Review = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
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
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await reviewService.getAllReviews(
          searchParams.toString()
        );
        setCategories(
          response.data.map((item, index) => ({ ...item, key: index + 1 }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch review list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchCategories();
    setFetchData(false);
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>STT</span>
        </div>
      ),
      align: "center",
      dataIndex: "key",
      width: "5%",
    },
    {
      title: (
        <div className="text-center">
          <span>Đánh giá</span>
        </div>
      ),
      dataIndex: "comment",
    },
    {
      title: (
        <div className="text-center">
          <span>Số sao</span>
        </div>
      ),
      dataIndex: "rating",
      align: "center",
      render: (rating) => <Rate disabled allowHalf value={rating} />,
      width: "15%",
    },
    {
      title: (
        <div className="text-center">
          <span>Sản phẩm</span>
        </div>
      ),
      dataIndex: "product",
      render: (product) => (
        <div className="flex items-center space-x-2">
          <img
            src={product.productImages[0].url}
            alt="review"
            className="w-8 h-8 object-cover rounded-md"
          />
          <p className="line-clamp-2">{product.productName}</p>
        </div>
      ),
      width: "30%",
    },
    {
      title: (
        <div className="text-center">
          <span>Trạng thái</span>
        </div>
      ),
      align: "center",
      dataIndex: "childrenReviews",
      render: (childrenReviews) => {
        if (childrenReviews.length > 0) {
          return <Tag color="blue">Đã trả lời</Tag>;
        }
        return <Tag color="orange">Chưa trả lời</Tag>;
      },
      width: "10%",
    },
    {
      title: (
        <div className="text-center">
          <span>Ngày tạo</span>
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
      width: "12%",
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
              setSelectedReview(record);
              setOpen(true);
            }}
          >
            <MessageSquareReply strokeWidth={1} size={20} color="blue" />
          </Button>
        );
      },
      width: "10%",
    },
  ];

  return (
    <>
      <DataTable
        title="Đánh giá"
        searchPlaceholder="Nhập tên đánh giá để tìm kiếm..."
        data={categories}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedReview}
        setFetchData={setFetchData}
        pagination={pagination}
        addButton={false}
      />
      <ReviewForm
        open={open}
        setOpen={setOpen}
        data={selectedReview}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Review;
