import { Button } from "antd";
import { useState, useEffect, useMemo } from "react";
import { newsService } from "../services";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import NewsForm from "../components/news/NewsForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { getSortOrder } from "../utils";

const News = () => {
  const [news, setnews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
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
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await newsService.getAllNews(
          searchParams.toString()
        );
        setnews(
          response.data.map((item) => ({ ...item, key: item.newsId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch News list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchNews();
    setFetchData(false);
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Hình ảnh</span>
        </div>
      ),
      dataIndex: "thumbnail",
      align: "center",
      render: (thumbnail) => (
        <div className="flex justify-center">
          <img
            src={thumbnail.url}
            alt="News"
            className="w-8 h-8 object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      title: (
        <div className="text-center">
          <span>Tiêu đề</span>
        </div>
      ),
      dataIndex: "title",
      width: "45%",
    },
    {
      title: (
        <div className="text-center">
          <span>Ngày tạo</span>
        </div>
      ),
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY"),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: true,
      sortOrder: getSortOrder(searchParams, "createdAt"),
    },
    {
      title: (
        <div className="text-center">
          <span>Ngày cập nhật</span>
        </div>
      ),
      dataIndex: "updatedAt",
      align: "center",
      render: (updatedAt) => dayjs(updatedAt).format("DD/MM/YYYY"),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: true,
      sortOrder: getSortOrder(searchParams, "updatedAt"),
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
              setSelectedNews(record);
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
        title="Tin tức"
        searchPlaceholder="Nhập tiêu đề tin tức để tìm kiếm..."
        data={news}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedNews}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <NewsForm
        open={open}
        setOpen={setOpen}
        data={selectedNews}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default News;
