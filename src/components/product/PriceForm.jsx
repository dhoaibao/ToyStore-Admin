import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Modal, Form, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

const PriceForm = ({
  open,
  setOpen,
  data,
  setNewPrice,
  setStartValidPrice,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form, open]);

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    setNewPrice(values.price);
    setStartValidPrice(values.startDate);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      closable={false}
      maskClosable={false}
      title={"Chỉnh sửa giá"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form
        form={form}
        className="flex space-x-2"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          className="w-1/2"
          label="Giá:"
          name="price"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá sản phẩm",
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập giá"
            addonAfter={"VNĐ"}
            min={1}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/,/g, "")}
          />
        </Form.Item>
        <Form.Item
          className="w-1/2"
          label="Ngày giá có hiệu lực:"
          name="startDate"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn thời gian giá có hiệu lực",
            },
          ]}
          getValueProps={(value) => ({
            value: value && dayjs(value),
          })}
          normalize={(value) => value && value.tz().format("YYYY-MM-DD")}
        >
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

PriceForm.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.object,
  setOpen: PropTypes.func.isRequired,
  setNewPrice: PropTypes.func.isRequired,
  setStartValidPrice: PropTypes.func.isRequired,
};

export default PriceForm;
