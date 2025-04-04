import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  message,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchImage } from "../../utils";
import { promotionService } from "../../services";
import dayjs from "dayjs";
import SearchProduct from "./SearchProduct";
import PromotionPeriod from "./PromotionPeriod";
import { Button } from "antd/es/radio";

const PromotionForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [discountType, setDiscountType] = useState("fixed_amount");
  const [productIds, setProductIds] = useState([]);
  const [selectedPromotionPeriod, setSelectedPromotionPeriod] = useState(null);
  const [openPeriod, setOpenPeriod] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (data) {
        setLoadingImage(true);

        setSelectedPromotionPeriod(data?.promotionPeriods?.at(-1) || null);

        form.setFieldsValue(data);
        setDiscountType(data.discountType);

        if (data.promotionThumbnail?.url) {
          const file = await fetchImage(
            data.promotionThumbnail.url,
            `promotion-thumbnail-${data.promotionThumbnailId}`,
          );
          if (file) {
            setFileList([
              {
                uid: "-1",
                name: file.name,
                status: "done",
                url: data.promotionThumbnail.url,
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

  useEffect(() => {
    if (selectedPromotionPeriod) {
      form.setFieldsValue({
        discountType: selectedPromotionPeriod.discountType,
        discountValue: selectedPromotionPeriod.discountValue,
        startDate: selectedPromotionPeriod.startDate,
        endDate: selectedPromotionPeriod.endDate,
      });
      setDiscountType(selectedPromotionPeriod.discountType);
      setProductIds(
        selectedPromotionPeriod.products.map(({ productId }) => productId),
      );
    } else {
      form.setFieldsValue({
        discountType: "",
        discountValue: "",
        startDate: "",
        endDate: "",
      });
      setDiscountType("fixed_amount");
    }
  }, [selectedPromotionPeriod, form, open]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid),
    );
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
    setProductIds([]);
    setSelectedPromotionPeriod(null);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      if (data?.promotionThumbnail?.url) {
        if (fileList[0].url !== data.promotionThumbnail?.url) {
          formData.append("file", fileList[0].originFileObj);
        }
      } else {
        formData.append("file", fileList[0].originFileObj);
      }
    }

    productIds.forEach((id) => {
      formData.append("productIds", id);
    });

    if (selectedPromotionPeriod) {
      formData.append(
        "promotionPeriodId",
        selectedPromotionPeriod.promotionPeriodId,
      );
    }

    console.log(formData);

    try {
      if (data?.promotionId) {
        await promotionService.updatePromotion(data.promotionId, formData);
        message.success("Cập nhật khuyến mãi thành công!");
      } else {
        await promotionService.createPromotion(formData);
        message.success("Thêm khuyến mãi thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      switch (error.message) {
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
      title={data ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
      open={open}
      loading={loadingImage}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      okText="Lưu"
      cancelText="Hủy"
      width={1000}
      className="min-h-[90vh]"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="flex flex-row space-x-8"
      >
        <div className="w-1/2">
          <Form.Item
            label="Tên khuyến mãi:"
            name="promotionName"
            rules={[
              { required: true, message: "Vui lòng nhập tên khuyến mãi" },
            ]}
          >
            <Input placeholder="Nhập tên khuyến mãi" />
          </Form.Item>
          <div className="flex flex-row space-x-2">
            <Form.Item
              className="w-1/3"
              label="Hình ảnh:"
              name="promotionThumbnail"
              rules={[
                {
                  required: fileList.length === 0,
                  message: "Vui lòng chọn hình ảnh",
                },
              ]}
            >
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
            <Form.Item
              label="Mô tả:"
              className="w-2/3"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả khuyến mãi" },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả"
                autoSize={{ minRows: 5, maxRows: 5 }}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button onClick={() => setOpenPeriod(true)}>
              Chọn đợt giảm giá
            </Button>
          </Form.Item>
          <div className="flex flex-row space-x-2">
            <Form.Item
              label="Loại khuyến mãi:"
              className="w-1/2"
              name="discountType"
              rules={[
                { required: true, message: "Vui lòng chọn loại khuyến mãi" },
              ]}
            >
              <Select
                placeholder="Chọn loại khuyến mãi"
                onChange={(value) => setDiscountType(value)}
                options={[
                  { value: "fixed_amount", label: "Giảm giá cố định" },
                  { value: "percentage", label: "Giảm theo phần trăm" },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item
              label="Giá trị:"
              className="w-1/2"
              name="discountValue"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị khuyến mãi",
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập giá trị khuyến mãi"
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
              label="Ngày bắt đầu:"
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian bắt đầu",
                },
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
                {
                  required: true,
                  message: "Vui lòng chọn thời gian kết thúc",
                },
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
        </div>
        <Form.Item
          className="w-1/2"
          label="Chọn sản phẩm áp dụng khuyến mãi:"
          name="products"
        >
          <SearchProduct
            productIds={productIds}
            setProductIds={setProductIds}
            productData={selectedPromotionPeriod?.products}
          />
        </Form.Item>
      </Form>
      <PromotionPeriod
        open={openPeriod}
        setOpen={setOpenPeriod}
        selectedPromotionPeriod={selectedPromotionPeriod}
        setSelectedPromotionPeriod={setSelectedPromotionPeriod}
        promotionPeriods={data?.promotionPeriods}
      />
    </Modal>
  );
};

PromotionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default PromotionForm;
