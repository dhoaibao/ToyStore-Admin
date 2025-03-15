import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, message, Select } from "antd";
import { permissionService } from "../../services";
import { MODULES } from "../../constants";

const PermissionForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setData = async () => {
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    };

    if (open) setData();
  }, [open, data, form]);

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      if (data?.permissionId) {
        await permissionService.updatePermission(data.permissionId, values);
        message.success("Cập nhật quyền hạn thành công!");
      } else {
        await permissionService.createPermission(values);
        message.success("Thêm quyền hạn thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      switch (error.message) {
        case "Permission already exists!":
          message.error("Quyền hạn đã tồn tại!");
          break;
        case "Authorization: Permission denied!":
          message.error("Bạn không có quyền sử dụng tính năng này!");
          break;
        default:
          message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
          break;
      }
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      closable={false}
      maskClosable={false}
      title={data ? "Chỉnh sửa quyền hạn" : "Thêm quyền hạn mới"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên quyền hạn:"
          name="permissionName"
          rules={[{ required: true, message: "Vui lòng nhập tên quyền hạn" }]}
        >
          <Input />
        </Form.Item>
        <div className="flex flex-row space-x-2">
          <Form.Item
            className="w-1/2"
            label="Module:"
            name="module"
            rules={[{ required: true, message: "Vui lòng nhập module" }]}
          >
            <Select
              options={MODULES.map((module) => ({
                label: module,
                value: module,
              }))}
            />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            label="Phương thức HTTP:"
            name="method"
            rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
          >
            <Select>
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          label="Đường dẫn API:"
          name="apiPath"
          rules={[{ required: true, message: "Vui lòng nhập đường dẫn API" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

PermissionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default PermissionForm;
