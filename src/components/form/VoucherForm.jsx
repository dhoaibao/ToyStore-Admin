import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import { voucherService } from "../../services";
import dayjs from "dayjs";

const VoucherForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState("fixed_amount");

  useEffect(() => {
    const setData = async () => {
      if (data) {
        form.setFieldsValue(data);
        setDiscountType(data.discountType);
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
      if (data?.voucherId) {
        await voucherService.updateVoucher(data.voucherId, values);
        message.success("Cập nhật mã giảm giá thành công!");
      } else {
        await voucherService.createVoucher(values);
        message.success("Thêm mã giảm giá thành công!");
      }
      setFetchData(true);
    } catch (error) {
      if (error.response.data.message === "Voucher code already exists!") {
        message.error("Mã giảm giá đã tồn tại!");
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
      title={data ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="flex flex-row space-x-2">
          <Form.Item
            className="w-1/2"
            label="Mã giảm giá:"
            name="voucherCode"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm giá" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số lượng:"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </div>
        <div className="flex flex-row space-x-2">
          <Form.Item
            className="w-1/2"
            label="Loại khuyến mãi:"
            name="discountType"
            rules={[
              { required: true, message: "Vui lòng chọn loại khuyến mãi" },
            ]}
          >
            <Select
              onChange={(value) => setDiscountType(value)}
              options={[
                { value: "fixed_amount", label: "Giảm giá cố định" },
                { value: "percentage", label: "Giảm theo phần trăm" },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            className="w-1/2"
            label="Giá trị:"
            name="discountValue"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị khuyến mãi" },
            ]}
          >
            <InputNumber
              addonAfter={discountType === "percentage" ? "%" : "VNĐ"}
              min={1}
              max={discountType === "percentage" ? 100 : 1000000000}
              step={discountType === "percentage" ? 1 : 1000}
              formatter={(value) =>
                discountType === "fixed_amount"
                  ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : value
              }
              parser={(value) =>
                discountType === "fixed_amount"
                  ? value.replace(/,/g, "")
                  : value
              }
            />
          </Form.Item>
        </div>
        <div className="flex flex-row space-x-2">
          <Form.Item
            className="w-1/2"
            label="Đơn hàng tối thiểu:"
            name="minOrderPrice"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm giá" }]}
          >
            <InputNumber
              addonAfter="VNĐ"
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            label="Giá giảm tối đa:"
            name="maxPriceDiscount"
            rules={[
              {
                required: discountType === "percentage",
                message: "Vui lòng nhập số lượng",
              },
            ]}
          >
            <InputNumber
              addonAfter="VNĐ"
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>
        </div>
        <div className="flex flex-row space-x-2">
          <Form.Item
            className="w-1/2"
            label="Ngày bắt đầu:"
            name="startDate"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian bắt đầu" },
            ]}
            getValueProps={(value) => ({
              value: value && dayjs(value),
            })}
            normalize={(value) => value && value.tz().format("YYYY-MM-DD")}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày bắt đầu"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            label="Ngày kết thúc:"
            name="endDate"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian kết thúc" },
            ]}
            getValueProps={(value) => ({
              value: value && dayjs(value),
            })}
            normalize={(value) => value && value.tz().format("YYYY-MM-DD")}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày kết thúc"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

VoucherForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default VoucherForm;
