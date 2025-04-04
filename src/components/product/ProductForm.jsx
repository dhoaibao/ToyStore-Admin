import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  message,
  InputNumber,
  Select,
  Switch,
  Button,
} from "antd";
import { History, FilePenLine } from "lucide-react";
import PriceHistory from "./PriceHistory";
import PriceForm from "./PriceForm";
import { UploadOutlined } from "@ant-design/icons";
import { fetchImage } from "../../utils";
import {
  productService,
  brandService,
  categoryService,
  productInformationService,
} from "../../services";
import DynamicComponent from "./DynamicComponent";

const ProductForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsInformation, setProductsInformation] = useState([]);
  const [openPriceHistory, setOpenPriceHistory] = useState(false);
  const [openPriceForm, setOpenPriceForm] = useState(false);
  const [newPrice, setNewPrice] = useState(null);
  const [startValidPrice, setStartValidPrice] = useState(null);

  useEffect(() => {
    form.setFieldsValue({ price: newPrice });
  }, [newPrice, form]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const brands = await brandService.getAllBrands("limit=-1");
      const categories = await categoryService.getAllCategories("limit=-1");
      const productsInformation =
        await productInformationService.getAllProductsInformation("limit=-1");

      setBrands(brands.data);
      setCategories(categories.data);
      setProductsInformation(productsInformation.data);

      if (data) {
        const initialValues = {
          ...data,
          ...data.productInfoValues.reduce((acc, item) => {
            acc[`productInfoValues_${item.productInfo.productInfoName}`] =
              item.value;
            return acc;
          }, {}),
        };
        form.setFieldsValue(initialValues);
        setNewPrice(data.price);
        const startDate = data.prices.find(
          (item) => item.price === data.price,
        )?.startDate;
        setStartValidPrice(startDate);

        if (data.productImages?.length > 0) {
          const files = await Promise.all(
            data.productImages.map(async (image, index) => {
              if (image.url) {
                const result = await fetchImage(
                  image.url,
                  `product-image-${index}`,
                );
                return { file: result, uploadImageId: image.uploadImageId };
              }
              return null;
            }),
          );

          const fileList = files
            .filter((file) => file)
            .map((item) => ({
              uid: item.file.name,
              name: item.file.name,
              status: "done",
              uploadImageId: item.uploadImageId,
              originFileObj: item.file,
            }));
          setFileList(fileList);
        } else {
          setFileList([]);
        }
      } else {
        form.resetFields();
        setFileList([]);
      }
      setLoadingData(false);
    };

    if (open) fetchData();
  }, [open, data, form]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid),
    );
  };

  const formattedOptions = (options) => {
    return options.map((option) => ({
      value: option,
      label: option,
    }));
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
    setNewPrice(null);
    setStartValidPrice(null);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    // Append other form values to formData
    for (const key in values) {
      if (!key.startsWith("productInfoValues_")) {
        formData.append(key, values[key]);
      }
    }

    formData.append("startValidPrice", startValidPrice);

    // Transform productInfoValues into the desired format
    const productInfos = productsInformation.map((productInformation) => ({
      productInfoId: productInformation.productInfoId,
      value:
        values[`productInfoValues_${productInformation.productInfoName}`] || "",
    }));

    // Append productInfos to formData
    formData.append("productInfos", JSON.stringify(productInfos));

    console.log("formData", JSON.stringify(productInfos));

    const existingFiles = fileList.filter((file) => file.uploadImageId);
    const newFiles = fileList.filter((file) => !file.uploadImageId);

    if (newFiles.length > 0) {
      newFiles.forEach((file) => {
        formData.append("newImages", file.originFileObj);
      });
    }

    if (existingFiles.length > 0) {
      existingFiles.forEach((file) => {
        formData.append("existingImages", file.uploadImageId);
      });
    }

    try {
      if (data?.productId) {
        await productService.updateProduct(data.productId, formData);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(formData);
        message.success("Thêm sản phẩm thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      switch (error.message) {
        case "Product already exists!":
          message.error("Sản phẩm đã tồn tại!");
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
      title={data ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      open={open}
      loading={loadingData}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      width={900}
      className="max-h-[95vh] overflow-y-auto scrollbar-hide"
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="flex flex-row space-x-4">
          <div className="w-1/2">
            <Form.Item
              label="Tên sản phẩm:"
              name="productName"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              label="Hình ảnh:"
              name="productThumbnail"
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
                maxCount={10}
                accept="image/*"
                beforeUpload={() => false}
                onChange={handleUploadChange}
                onRemove={handleRemove}
                multiple
              >
                {fileList.length < 10 && (
                  <div className="flex-col">
                    <UploadOutlined /> <p>Tải lên</p>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              label="Mô tả:"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả"
                autoSize={{ minRows: 10, maxRows: 10 }}
              />
            </Form.Item>
          </div>
          <div className="w-1/2">
            <div className="flex flex-row items-center space-x-2">
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
              {data && (
                <Form.Item
                  label="Lịch sử giá:"
                  className="w-1/2 items-center flex"
                >
                  {/* <Button type="text" onClick={() => setOpenPriceForm(true)}>
                    <FilePenLine strokeWidth={1} />
                  </Button> */}
                  <Button type="text" onClick={() => setOpenPriceHistory(true)}>
                    <History strokeWidth={1} />
                  </Button>
                </Form.Item>
              )}
            </div>
            <div className="flex flex-row space-x-2">
              <Form.Item
                className="w-1/2"
                label="Thương hiệu:"
                name="brandId"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select
                  placeholder="Chọn thương hiệu"
                  options={brands.map((brand) => ({
                    value: brand.brandId,
                    label: brand.brandName,
                  }))}
                ></Select>
              </Form.Item>
              <Form.Item
                className="w-1/2"
                label="Danh mục:"
                name="categoryId"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  options={categories.map((category) => ({
                    value: category.categoryId,
                    label: category.categoryName,
                  }))}
                ></Select>
              </Form.Item>
            </div>
            <div className="flex flex-row space-x-2">
              <Form.Item
                className="w-1/2"
                label="Số lượng:"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng sản phẩm",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Nhập số lượng"
                  className="w-full"
                  min={1}
                />
              </Form.Item>
              <Form.Item
                className="w-1/2"
                label="Trạng thái:"
                name="isActive"
                valuePropName="checked"
                initialValue={true}
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <Switch
                  checkedChildren="ACTIVE"
                  unCheckedChildren="INACTIVE"
                  defaultChecked
                />
              </Form.Item>
            </div>
            <div className="flex flex-wrap">
              {productsInformation.map((productInformation) => (
                <Form.Item
                  className="w-1/2 pr-2"
                  key={productInformation.productInfoId}
                  label={productInformation.productInfoName}
                  name={`productInfoValues_${productInformation.productInfoName}`}
                  rules={[
                    {
                      required: true,
                      message: `Vui lòng nhập ${productInformation.productInfoName.toLowerCase()}`,
                    },
                  ]}
                >
                  <DynamicComponent
                    className="w-full"
                    type={productInformation.type}
                    options={formattedOptions(productInformation.options)}
                    placeholder={`Nhập ${productInformation.productInfoName.toLowerCase()}`}
                  />
                </Form.Item>
              ))}
            </div>
          </div>
        </div>
      </Form>
      <PriceHistory
        open={openPriceHistory}
        setOpen={setOpenPriceHistory}
        data={data?.prices}
      />
      <PriceForm
        open={openPriceForm}
        data={{ price: newPrice, startDate: startValidPrice }}
        setOpen={setOpenPriceForm}
        setNewPrice={setNewPrice}
        setStartValidPrice={setStartValidPrice}
      />
    </Modal>
  );
};

ProductForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default ProductForm;
