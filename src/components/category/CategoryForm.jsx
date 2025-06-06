import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, message, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchImage } from "../../utils";
import { categoryService } from "../../services";

const CategoryForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (data) {
        setLoadingImage(true);
        form.setFieldsValue(data);

        if (data.categoryThumbnail?.url) {
          const file = await fetchImage(
            data.categoryThumbnail.url,
            `category-thumbnail-${data.categoryThumbnailId}`,
          );
          if (file) {
            setFileList([
              {
                uid: "-1",
                name: file.name,
                status: "done",
                url: data.categoryThumbnail.url,
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
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key]);
    }
    if (fileList.length > 0 && fileList[0].originFileObj) {
      if (data?.categoryThumbnail?.url) {
        if (fileList[0].url !== data.categoryThumbnail?.url) {
          formData.append("file", fileList[0].originFileObj);
        }
      } else {
        formData.append("file", fileList[0].originFileObj);
      }
    }

    try {
      if (data?.categoryId) {
        await categoryService.updateCategory(data.categoryId, formData);
        message.success("Cập nhật danh mục thành công!");
      } else {
        await categoryService.createCategory(formData);
        message.success("Thêm danh mục thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      switch (error.message) {
        case "Category already exists!":
          message.error("Danh mục đã tồn tại!");
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
      title={data ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      open={open}
      loading={loadingImage}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên danh mục:"
          name="categoryName"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Hình ảnh:"
          name="categoryThumbnail"
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

CategoryForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default CategoryForm;
