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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import fetchImage from "../../utils/fetchImage";
import {
  productService,
  brandService,
  categoryService,
  productInformationService,
} from "../../services";

const ProductForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsInformation, setProductsInformation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const brands = await brandService.getAllBrands();
      const categories = await categoryService.getAllCategories();
      const productsInformation =
        await productInformationService.getAllProductsInformation();

      setBrands(brands.data);
      setCategories(categories.data);
      setProductsInformation(productsInformation.data);

      if (data) {
        setLoadingImage(true);
        const initialValues = {
          ...data,
          ...data.productInfoValues.reduce((acc, item) => {
            acc[`productInfoValues_${item.productInfo.productInfoName}`] =
              item.value;
            return acc;
          }, {}),
        };
        form.setFieldsValue(initialValues);

        if (data.productImages?.length > 0) {
          const files = await Promise.all(
            data.productImages.map(async (image, index) => {
              if (image.uploadImage.url) {
                return await fetchImage(
                  image.uploadImage.url,
                  `product-image-${index}`
                );
              }
              return null;
            })
          );
          const fileList = files
            .filter((file) => file)
            .map((file) => ({
              uid: file.name,
              name: file.name,
              status: "done",
              url: URL.createObjectURL(file),
              originFileObj: file,
            }));
          setFileList(fileList);
        } else {
          setFileList([]);
        }
        setLoadingImage(false);
      } else {
        form.resetFields();
        setFileList([]);
      }
    };

    if (open) fetchData();
  }, [open, data, form]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
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

    // Transform productInfoValues into the desired format
    const productInfos = productsInformation.map((productInformation) => ({
      productInfoId: productInformation.productInfoId,
      value:
        values[`productInfoValues_${productInformation.productInfoName}`] || "",
    }));

    // Append productInfos to formData
    formData.append("productInfos", JSON.stringify(productInfos));

    if (fileList.length > 0) {
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });
    }

    console.log("formData", formData);

    try {
      if (data?.productId) {
        await productService.updateProduct(data.productId, formData);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(formData);
        message.success("Thêm sản phẩm thành công!");
      }
      setFetchData(true);
    } catch (error) {
      if (error.response.data.message === "Product already exists!") {
        message.error("Sản phẩm đã tồn tại!");
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
      title={data ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      open={open}
      // loading={loadingImage}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      width={1000}
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
              <Input />
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
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 12 }} />
            </Form.Item>
          </div>
          <div className="w-1/2">
            <div className="flex flex-row space-x-2">
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
                label="Số lượng:"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng sản phẩm",
                  },
                ]}
              >
                <InputNumber className="w-full" min={1} />
              </Form.Item>
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
                  options={categories.map((category) => ({
                    value: category.categoryId,
                    label: category.categoryName,
                  }))}
                ></Select>
              </Form.Item>
            </div>
            <Form.Item
              label="Trạng thái:"
              name="visible"
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

            {productsInformation.map((productInformation) => (
              <Form.Item
                className="mb-1"
                key={productInformation.productInfoId}
                label={productInformation.productInfoName}
                name={`productInfoValues_${productInformation.productInfoName}`}
              >
                <Input />
              </Form.Item>
            ))}
          </div>
        </div>
      </Form>
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
