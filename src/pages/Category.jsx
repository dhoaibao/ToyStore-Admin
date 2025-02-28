import { Button } from "antd";
import { useState, useEffect, useMemo } from "react";
import { categoryService } from "../services";
import moment from "moment";
import { Pencil } from "lucide-react";
import CategoryForm from "../components/form/CategoryForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { getSortOrder } from "../utils";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
        const response = await categoryService.getAllCategories(
          searchParams.toString()
        );
        setCategories(
          response.data.map((item) => ({ ...item, key: item.categoryId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch category list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchCategories();
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Hình ảnh</span>
        </div>
      ),
      dataIndex: "categoryThumbnail",
      align: "center",
      render: (categoryThumbnail) => (
        <div className="flex justify-center">
          <img
            src={categoryThumbnail.url}
            alt="category"
            className="w-8 h-8 object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      title: (
        <div className="text-center">
          <span>Tên danh mục</span>
        </div>
      ),
      dataIndex: "categoryName",
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
    },
    {
      title: (
        <div className="text-center">
          <span>Ngày cập nhật</span>
        </div>
      ),
      dataIndex: "updatedAt",
      align: "center",
      render: (updatedAt) => moment(updatedAt).format("DD/MM/YYYY"),
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
              setSelectedCategory(record);
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
        title="Danh mục"
        searchPlaceholder="Nhập tên danh mục để tìm kiếm..."
        data={categories}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedCategory}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <CategoryForm
        open={open}
        setOpen={setOpen}
        data={selectedCategory}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Category;
