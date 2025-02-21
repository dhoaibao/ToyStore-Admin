import { Table, Button, Input } from "antd";
import { useState, useEffect, useMemo } from "react";
import { brandService } from "../services";
import moment from "moment";
import { Pencil, Plus, RotateCcw } from "lucide-react";
import BrandForm from "../components/form/BrandForm";
import { useNavigate, useLocation } from "react-router-dom";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
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
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await brandService.getAllBrands(
          searchParams.toString()
        );
        setBrands(
          response.data.map((item) => ({ ...item, key: item.brandId }))
        );
        setTotalPages(response.pagination.totalPages);
        setLimit(response.pagination.limit);
        setTotal(response.pagination.total);
        setLoading(false);
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch brand list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchBrands();
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Tên thương hiệu</span>
        </div>
      ),
      dataIndex: "brandName",
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
              setSelectedBrand(record);
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
        <p className="text-2xl font-bold">Thương hiệu</p>
        <Button
          type="primary"
          onClick={() => {
            setSelectedBrand(null);
            setOpen(true);
          }}
        >
          <Plus strokeWidth={1} size={20} />
          Thêm mới
        </Button>
      </div>
      <div className="flex justify-between items-center space-x-4 mb-4">
        <Input.Search
          placeholder="Nhập tên thương hiệu để tìm kiếm..."
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
        dataSource={brands}
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
        expandable={{
          expandedRowRender: (record) => (
            <p className="m-0">
              <span className="font-semibold">Mô tả:</span> {record.brandDesc}
            </p>
          ),
          rowExpandable: (record) =>
            record.brandName !== "Không có mô tả về thương hiệu này!",
        }}
      />
      <BrandForm
        open={open}
        setOpen={setOpen}
        data={selectedBrand}
        setFetchData={setFetchData}
      />
    </div>
  );
};

export default Brand;
