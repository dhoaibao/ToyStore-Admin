import { Table, Button, Input } from "antd";
import { useState, useMemo } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const DataTable = ({
  title,
  searchPlaceholder,
  columns,
  loading,
  data,
  pagination,
  setFetchData,
  setOpenForm,
  setSelectedItem,
  expandable,
}) => {
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const page = searchParams.get("page") || 1;

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

  const onChange = (pagination, filters, sorter) => {
    console.log("params", filters);

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          searchParams.set(key, filters[key]);
        } else {
          searchParams.delete(key);
        }
      });
    }

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
      <div className="items-center mb-4">
        <p className="text-2xl font-bold">{title}</p>
      </div>
      <div className="flex justify-between items-center space-x-4 mb-4">
        <Input.Search
          placeholder={searchPlaceholder || "Tìm kiếm..."}
          enterButton
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          className="w-1/3"
        />
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh}>
            <RotateCcw strokeWidth={1} size={20} />
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSelectedItem(null);
              setOpenForm(true);
            }}
          >
            <Plus strokeWidth={1} size={20} />
            Thêm mới
          </Button>
        </div>
      </div>
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-gray"
        }
        showSorterTooltip={{
          target: "sorter-icon",
        }}
        pagination={{
          total: pagination.totalPages * 10,
          current: page,
          pageSize: pagination.limit,
          showSizeChanger: true,
          showTotal: () => `Tổng ${pagination.total} mục`,
          position: ["bottomCenter"],
        }}
        expandable={expandable}
        sticky
        scroll={{ y: "calc(100vh - 296px)" }}
        tableLayout="fixed"
        size="small"
      />
    </div>
  );
};

DataTable.propTypes = {
  title: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string,
  columns: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  setFetchData: PropTypes.func.isRequired,
  setOpenForm: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  expandable: PropTypes.object,
};

export default DataTable;
