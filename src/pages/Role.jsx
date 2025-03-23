import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { roleService } from "../services";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import RoleForm from "../components/role/RoleForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { getSortOrder } from "../utils";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
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
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await roleService.getAllRoles(
          searchParams.toString()
        );
        setRoles(
          response.data.map((item) => ({ ...item, key: item.roleId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch role list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchRoles();
    setFetchData(false);
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Tên vai trò</span>
        </div>
      ),
      dataIndex: "roleName",
    },
    {
      title: (
        <div className="text-center">
          <span>Trạng thái</span>
        </div>
      ),
      dataIndex: "isActive",
      align: "center",
      render: (isActive) => {
        return isActive ? (
          <Tag color="blue">ACTIVE</Tag>
        ) : (
          <Tag color="gray">INACTIVE</Tag>
        );
      },
      filters: [
        {
          text: "ACTIVE",
          value: true,
        },
        {
          text: "INACTIVE",
          value: false,
        },
      ],
      filteredValue: [searchParams.get("isActive")],
      filterMultiple: false,
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
              setSelectedRole(record);
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
        title="Vai trò"
        searchPlaceholder={"Nhập tên vai trò để tìm kiếm..."}
        data={roles}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedRole}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <RoleForm
        open={open}
        setOpen={setOpen}
        data={selectedRole}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Role;
