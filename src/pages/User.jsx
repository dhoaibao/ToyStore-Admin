import { Button, Tag, Avatar } from "antd";
import { useState, useEffect, useMemo } from "react";
import { userService } from "../services";
import { Pencil } from "lucide-react";
import UserForm from "../components/form/UserForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { generateAvatar, getSortOrder } from "../utils";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await userService.getAllUsers(searchParams.toString());
        setUsers(response.data.map((item) => ({ ...item, key: item.userId })));
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch user list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchUsers();
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>ID</span>
        </div>
      ),
      dataIndex: "userId",
      align: "center",
      width: "5%",
      sorter: true,
      sortOrder: getSortOrder(searchParams, "userId"),
    },
    {
      title: (
        <div className="text-center">
          <span>Ảnh</span>
        </div>
      ),
      dataIndex: "avatar",
      align: "center",
      render: (avatar, record) => {
        const { color, initial } = generateAvatar(
          record.email,
          record.fullName
        );
        return (
          <div className="flex justify-center">
            <Avatar
              src={avatar?.url}
              alt="U"
              className="w-8 h-8 object-cover rounded-md"
              style={{
                backgroundColor: avatar?.url ? "transparent" : color,
                fontSize: 16,
              }}
            >
              {!avatar?.url && initial}
            </Avatar>
          </div>
        );
      },
    },
    {
      title: (
        <div className="text-center">
          <span>Tên người dùng</span>
        </div>
      ),
      dataIndex: "fullName",
      width: "25%",
      sorter: true,
      sortOrder: getSortOrder(searchParams, "fullName"),
    },
    {
      title: (
        <div className="text-center">
          <span>Email</span>
        </div>
      ),
      dataIndex: "email",
      width: "30%",
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
              setSelectedUser(record);
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
        title="Người dùng"
        searchPlaceholder={"Nhập tên người dùng để tìm kiếm..."}
        data={users}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedUser}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <UserForm
        open={open}
        setOpen={setOpen}
        data={selectedUser}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default User;
