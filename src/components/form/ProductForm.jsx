import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";
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
    } catch (error) {
      if (error.response.data.message === "Brand already exists!") {
        message.error("Thương hiệu đã tồn tại!");
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
      console.error(error);
    }
    setLoading(false);
    onClose();
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
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên thương hiệu:"
          name="brandName"
          rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả:"
          name="brandDesc"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea />
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
