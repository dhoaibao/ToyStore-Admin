import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { permissionService } from "../services";
import { Pencil } from "lucide-react";
import PermissionForm from "../components/permission/PermissionForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { MODULES } from "../constants";
import { getSortOrder } from "../utils";

const Permission = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
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
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await permissionService.getAllPermissions(
          searchParams.toString()
        );
        setPermissions(
          response.data.map((item) => ({ ...item, key: item.permissionId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch permission list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchPermissions();
    setFetchData(false);
  }, [fetchData, searchParams]);

  const getColorByMethod = (method) => {
    switch (method) {
      case "POST":
        return "green";
      case "PUT":
        return "orange";
      case "GET":
        return "blue";
      case "DELETE":
        return "red";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Tên quyền hạn</span>
        </div>
      ),
      dataIndex: "permissionName",
    },
    {
      title: (
        <div className="text-center">
          <span>Module</span>
        </div>
      ),
      dataIndex: "module",
      align: "center",
      filters: MODULES.map((module) => ({
        text: module,
        value: module,
      })),
      filteredValue: [searchParams.get("module")],
      filterMultiple: false,
      width: "20%",
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: true,
      sortOrder: getSortOrder(searchParams, "module"),
    },
    {
      title: (
        <div className="text-center">
          <span>Phương thức HTTP</span>
        </div>
      ),
      dataIndex: "method",
      align: "center",
      render: (method) => {
        return <Tag color={getColorByMethod(method)}>{method}</Tag>;
      },
      width: "17%",
      filters: [
        { text: "GET", value: "GET" },
        { text: "POST", value: "POST" },
        { text: "PUT", value: "PUT" },
        { text: "DELETE", value: "DELETE" },
      ],
      filteredValue: [searchParams.get("method")],
      filterMultiple: false,
    },
    {
      title: (
        <div className="text-center">
          <span>Đường dẫn API</span>
        </div>
      ),
      dataIndex: "apiPath",
      align: "left",
    },
    {
      title: (
        <div className="text-center">
          <span>Hành động</span>
        </div>
      ),
      width: "10%",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Button
            type="text"
            onClick={() => {
              setSelectedPermission(record);
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
        title="Quyền hạn"
        searchPlaceholder={"Nhập tên quyền hạn để tìm kiếm..."}
        data={permissions}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedPermission}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <PermissionForm
        open={open}
        setOpen={setOpen}
        data={selectedPermission}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Permission;
