import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { productInformationService } from "../../services";

const ProductInfoForm = ({ open, setOpen, data, setFetchData }) => {
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
      if (data?.productInfoId) {
        await productInformationService.updateProductInformation(
          data.productInfoId,
          values
        );
        message.success("Cập nhật thông tin sản phẩm thành công!");
      } else {
        await productInformationService.createProductInformation(values);
        message.success("Thêm thông tin sản phẩm thành công!");
      }
      setFetchData(true);
    } catch (error) {
      if (error === "Product information already exists!") {
        message.error("Thông tin sản phẩm đã tồn tại!");
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
      title={
        data ? "Chỉnh sửa thông tin sản phẩm" : "Thêm thông tin sản phẩm mới"
      }
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
          label="Tên thông tin sản phẩm:"
          name="productInfoName"
          rules={[
            { required: true, message: "Vui lòng nhập tên thông tin sản phẩm" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ProductInfoForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default ProductInfoForm;
