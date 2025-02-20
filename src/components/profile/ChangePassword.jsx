import { Drawer, Input, Button, Form, message } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { userService } from "../../services";

const ChangePassword = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const { oldPassword, newPassword, confirmNewPassword } = values;

    if (newPassword !== confirmNewPassword) {
      return message.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    }

    try {
      setLoading(true);
      await userService.changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      message.success("Thay đổi mật khẩu thành công!");
      setOpen(false);
    } catch (error) {
      console.error("Change password error:", error);
      message.error(
        error.response?.data?.message || "Thay đổi mật khẩu thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      closable={false}
      title={<p className="text-xl font-semibold">Đổi mật khẩu</p>}
      onClose={onClose}
      maskClosable={false}
      open={open}
      footer={
        <div className="text-right">
          <Button type="default" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            form="changePasswordForm"
            htmlType="submit"
            loading={loading}
            className="ml-2"
          >
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <Form
        id="changePasswordForm"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="oldPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự." },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

ChangePassword.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default ChangePassword;
