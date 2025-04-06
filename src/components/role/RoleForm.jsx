import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, message, Switch } from "antd";
import { roleService, permissionService } from "../../services";
import PermissionCollapse from "./PermissionCollapse";

const RoleForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    const setData = async () => {
      setLoadingForm(true);
      const response = await permissionService.getAllPermissions('limit=-1');
      setPermissions(response.data);

      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
      setLoadingForm(false);
    };

    if (open) setData();
  }, [open, data, form]);

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);

    values.rolePermissions = selectedPermissions;

    try {
      if (data?.roleId) {
        await roleService.updateRole(data.roleId, values);
        message.success("Cập nhật vai trò thành công!");
      } else {
        await roleService.createRole(values);
        message.success("Thêm vai trò thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      switch (error.message) {
        case "Role already exists!":
          message.error("Vai trò đã tồn tại!");
          break;
        case "Authorization: Permission denied!":
          message.error("Bạn không có quyền sử dụng tính năng này!");
          break;
        default:
          message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
          break;
      }
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      closable={false}
      loading={loadingForm}
      maskClosable={false}
      title={data ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      okText="Lưu"
      cancelText="Hủy"
      width={900}
      className="max-h-[95vh] overflow-y-auto scrollbar-hide"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="flex flex-row space-x-2">
          <div className="w-2/5">
            <Form.Item
              label="Tên vai trò:"
              name="roleName"
              rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
            >
              <Input placeholder="Nhập tên vai trò" />
            </Form.Item>
            <Form.Item
              label="Mô tả:"
              name="roleDesc"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea placeholder="Nhập mô tả" autoSize={{ minRows: 5, maxRows: 5 }} />
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
          <Form.Item
            className="w-3/5"
            label="Quyền hạn:"
            name="permissions"
          >
            <PermissionCollapse
              permissions={permissions}
              permissionOfRole={data?.permissions}
              setSelectedPermissions={setSelectedPermissions}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

RoleForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default RoleForm;
