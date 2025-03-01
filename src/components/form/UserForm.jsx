import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  Select,
  Upload,
  Switch,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { userService } from "../../services";
import { fetchImage } from "../../utils";
import dayjs from "dayjs";

const UserForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (data) {
        setLoadingImage(true);
        form.setFieldsValue(data);

        if (data.avatar?.url) {
          const file = await fetchImage(data.avatar.url, "avatar");
          if (file) {
            setFileList([
              {
                uid: "-1",
                name: file.name,
                status: "done",
                url: data.avatar.url,
                thumbUrl: URL.createObjectURL(file),
                originFileObj: file,
              },
            ]);
          }
        } else {
          setFileList([]);
        }
        setLoadingImage(false);
      } else {
        form.resetFields();
        setFileList([]);
      }
    };

    if (open) loadImage();
  }, [open, data, form]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      if (data.avatar?.url) {
        if (fileList[0].url !== data.avatar?.url) {
          formData.append("avatar", fileList[0].originFileObj);
        }
      } else {
        formData.append("avatar", fileList[0].originFileObj);
      }
    }

    console.log("formData", data.avatar?.url, fileList[0].url);

    try {
      if (data?.userId) {
        await userService.updateProfile(data.userId, formData);
        message.success("Cập nhật người dùng thành công!");
      } else {
        await userService.createUser(formData);
        message.success("Thêm người dùng thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      if (error.message === "Email already exists!") {
        message.error("Email đã tồn tại!");
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      closable={false}
      maskClosable={false}
      loading={loadingImage}
      title={data ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="flex flex-row space-x-2">
          <Form.Item className="w-1/3" label="Ảnh đại diện:" name="image">
            <Upload
              fileList={fileList}
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
              onChange={handleUploadChange}
              onRemove={handleRemove}
            >
              {fileList.length < 1 && (
                <div className="flex-col">
                  <UploadOutlined /> <p>Tải lên</p>
                </div>
              )}
            </Upload>
          </Form.Item>
          <div className="w-2/3">
            <Form.Item
              label="Họ tên:"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng" },
              ]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
            <Form.Item
              label="Trạng thái:"
              name="isActive"
              valuePropName="checked"
              initialValue={true}
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Switch
                checkedChildren="ACTIVE"
                unCheckedChildren="INACTIVE"
                defaultChecked
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Form.Item
            className="w-1/2"
            label="Email:"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            label="Số điện thoại:"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>
        <div className="flex flex-row space-x-2">
          <Form.Item
            className="w-1/2"
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
              placeholder="Chọn ngày sinh"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            label="Giới tính:"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value={true}>Nam</Select.Option>
              <Select.Option value={false}>Nữ</Select.Option>
            </Select>
          </Form.Item>
        </div>
        {!data && (
          <div className="flex flex-row space-x-2">
            <Form.Item
              className="w-1/2"
              label="Mật khẩu:"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự." },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item
              className="w-1/2"
              label="Xác nhận mật khẩu:"
              name="confirmPassword"
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
};

UserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default UserForm;
