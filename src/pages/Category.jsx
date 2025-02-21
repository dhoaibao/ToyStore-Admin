import { Table, Button, Input } from "antd";
import { useState, useEffect, useMemo } from "react";
import { categoryService } from "../services";
import moment from "moment";
import { Pencil, Plus, RotateCcw } from "lucide-react";
import CategoryForm from "../components/form/CategoryForm";
import { useNavigate, useLocation } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fetchData, setFetchData] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const page = searchParams.get("page") || 1;

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
        setTotalPages(response.pagination.totalPages);
        setLimit(response.pagination.limit);
        setTotal(response.pagination.total);
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
            className="w-12 h-12 object-cover rounded-md"
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
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
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

  const handleRefresh = () => {
    if (searchParams.toString() === "") {
      setFetchData(true);
    } else {
      navigate({ search: "" });
    }
    setSearchText("");
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      searchParams.set("keyword", value);
    } else {
      searchParams.delete("keyword");
    }
    navigate({ search: searchParams.toString() });
  };

  const onChange = (pagination, _, sorter) => {
    console.log("params", pagination, sorter);

    if (sorter.order) {
      searchParams.set("sort", sorter.field);
      searchParams.set("order", sorter.order === "ascend" ? "asc" : "desc");
    } else {
      searchParams.delete("sort");
      searchParams.delete("order");
    }

    if (pagination.current !== 1) {
      searchParams.set("page", pagination.current);
    } else {
      searchParams.delete("page");
    }
    if (pagination.pageSize !== 10) {
      searchParams.set("limit", pagination.pageSize);
    } else {
      searchParams.delete("limit");
    }
    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold">Danh mục</p>
        <Button
          type="primary"
          onClick={() => {
            setSelectedCategory(null);
            setOpen(true);
          }}
        >
          <Plus strokeWidth={1} size={20} />
          Thêm mới
        </Button>
      </div>
      <div className="flex justify-between items-center space-x-4 mb-4">
        <Input.Search
          placeholder="Nhập tên danh mục để tìm kiếm..."
          enterButton
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          className="w-1/3"
        />
        <Button onClick={handleRefresh}>
          <RotateCcw strokeWidth={1} size={20} />
        </Button>
      </div>
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={categories}
        onChange={onChange}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-gray"
        }
        showSorterTooltip={{
          target: "sorter-icon",
        }}
        pagination={{
          total: totalPages * 10,
          current: page,
          pageSize: limit,
          showSizeChanger: true,
          showTotal: () => `Tổng ${total} mục`,
          position: ["bottomCenter"],
        }}
      />
      <CategoryForm
        open={open}
        setOpen={setOpen}
        data={selectedCategory}
        setFetchData={setFetchData}
      />
    </div>
  );
};

export default Category;
