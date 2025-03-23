import {
  Drawer,
  List,
  Avatar,
  Input,
  Button,
  Select,
  DatePicker,
  Form,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { generateAvatar } from "../../utils";
import { updateProfile } from "../../redux/thunks/userThunk";

const Profile = ({ open, setOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(user?.avatar?.url || "");
  const [file, setFile] = useState(null);

  const { color, initial } = generateAvatar(user?.email, user?.fullName);

  const onClose = () => {
    setIsEditing(false);
    setFile(null);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const updatedValues = {
        ...values,
        gender: values.gender === "true",
      };
      const formData = new FormData();
      if (file) {
        formData.append("avatar", file);
      }
      for (const key in updatedValues) {
        formData.append(key, updatedValues[key]);
      }
      await dispatch(updateProfile(user.userId, formData));
      setAvatar(avatar);
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error?.data);
      message.error(error?.data?.message || "Cập nhật thông tin thất bại!");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleAvatarChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    }
    if (info.file.status === "done") {
      setFile(info.file.originFileObj);
      setAvatar(URL.createObjectURL(info.file.originFileObj));
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      form.submit();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Drawer
      closable={false}
      title={<p className="text-xl font-semibold">Thông tin cá nhân</p>}
      onClose={() => {
        onClose();
        setOpen(false);
      }}
      maskClosable={!isEditing}
      open={open}
      footer={
        <div className="text-right">
          {isEditing && (
            <Button
              type="default"
              onClick={() => {
                setAvatar(user?.avatar?.url || "");
                onClose();
              }}
            >
              Hủy bỏ
            </Button>
          )}
          <Button
            type="primary"
            className={"ml-2"}
            onClick={toggleEdit}
            loading={loading}
          >
            {isEditing ? "Lưu" : "Chỉnh sửa"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <Avatar
          src={avatar}
          size={100}
          className="mb-4 shadow-lg"
          style={{
            backgroundColor: avatar ? "transparent" : color,
            fontSize: 36,
          }}
        >
          {!user?.avatar?.url && initial}
        </Avatar>
        {isEditing && (
          <Upload
            name="avatar"
            showUploadList={false}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            onChange={handleAvatarChange}
            className="mb-2"
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              Thay đổi ảnh đại diện
            </Button>
          </Upload>
        )}
        <p className="text-xl font-semibold">{user?.fullName}</p>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fullName: user?.fullName,
          email: user?.email,
          phone: user?.phone,
          birthday: user?.birthday ? dayjs(user?.birthday) : null,
          gender: user?.gender?.toString(),
        }}
        onFinish={handleUpdate}
      >
        <List itemLayout="vertical" className="mt-6">
          <List.Item className="mb-6">
            <Form.Item
              label="Họ tên:"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input disabled={!isEditing} placeholder="Nhập họ tên" />
            </Form.Item>

            <Form.Item
              label="Email:"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input disabled={!isEditing} placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại:"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input disabled={!isEditing} placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              label="Ngày sinh:"
              name="birthday"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              getValueProps={(value) => ({
                value: value && dayjs(value),
              })}
              normalize={(value) => value && value.tz().format("YYYY-MM-DD")}
            >
              <DatePicker
                format="DD/MM/YYYY"
                disabled={!isEditing}
                placeholder="Chọn ngày sinh"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Giới tính:"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select disabled={!isEditing} placeholder="Chọn giới tính">
                <Select.Option value="true">Nam</Select.Option>
                <Select.Option value="false">Nữ</Select.Option>
              </Select>
            </Form.Item>
          </List.Item>
        </List>
      </Form>
    </Drawer>
  );
};

Profile.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Profile;
