import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, message, Switch } from "antd";
import { brandService } from "../../services";

const BrandForm = ({ open, setOpen, data, setFetchData }) => {
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
      if (data?.brandId) {
        await brandService.updateBrand(data.brandId, values);
        message.success("Cập nhật thương hiệu thành công!");
      } else {
        await brandService.createBrand(values);
        message.success("Thêm thương hiệu thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      switch (error.message) {
        case "Brand already exists!":
          message.error("Thương hiệu đã tồn tại!");
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
      maskClosable={false}
      title={data ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
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
          label="Tên thương hiệu:"
          name="brandName"
          rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
        >
          <Input placeholder="Nhập tên thương hiệu" />
        </Form.Item>
        <Form.Item
          label="Mô tả:"
          name="brandDesc"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả"
            autoSize={{ minRows: 5, maxRows: 5 }}
          />
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
      </Form>
    </Modal>
  );
};

BrandForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default BrandForm;
