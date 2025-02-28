import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Avatar } from "antd";
import moment from "moment";
import { generateAvatar } from "../../utils";

const UserDetail = ({ open, setOpen, data }) => {
  const { color, initial } = generateAvatar(data?.email, data?.fullName);

  const items = [
    {
      key: "1",
      label: "Ảnh đại diện:",
      span: "filled",
      children: (
        <Avatar
          src={data?.avatar?.url}
          alt="U"
          className="w-16 h-16 object-cover rounded-full border border-gray-300"
          style={{
            backgroundColor: data?.avatar?.url ? "transparent" : color,
            fontSize: 28,
          }}
        >
          {!data?.avatar?.url && initial}
        </Avatar>
      ),
    },
    {
      key: "2",
      label: "Họ tên:",
      span: "filled",
      children: data?.fullName,
    },
    {
      key: "3",
      label: "Email:",
      span: "filled",
      children: data?.email,
    },
    {
      key: "4",
      span: "filled",
      label: "Số điện thoại:",
      children: data?.phone,
    },
    {
      key: "5",
      span: "filled",
      label: "Trạng thái:",
      children: data?.isActive ? (
        <Tag color="blue">ACTIVE</Tag>
      ) : (
        <Tag color="gray">INACTIVE</Tag>
      ),
    },
    {
      key: "6",
      label: "Giới tính",
      span: "filled",
      children: data?.gender ? "Nam" : "Nữ",
    },
    {
      key: "7",
      label: "Ngày sinh",
      span: "filled",
      children: moment(data?.birthday).format("DD/MM/YYYY"),
    },
  ];

  return (
    <Modal
      onCancel={() => setOpen(false)}
      footer={null}
      open={open}
      centered
      width={600}
    >
      <Descriptions bordered title="Thông tin người dùng" items={items} />
    </Modal>
  );
};

UserDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default UserDetail;
