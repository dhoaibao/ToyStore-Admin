import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchImage } from "../../utils";
import { newsService } from "../../services";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewsForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      if (data) {
        setLoadingImage(true);
        form.setFieldsValue(data);

        setContent(data.content || "");

        if (data.thumbnail?.url) {
          const file = await fetchImage(
            data.thumbnail.url,
            `news-thumbnail-${data.thumbnailId}`
          );
          if (file) {
            setFileList([
              {
                uid: "-1",
                name: file.name,
                status: "done",
                url: data.thumbnail.url,
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
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
    setContent("");
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key]);
    }
   
    formData.append(
      "content",
      Array.isArray(content) ? content.join("") : content
    );
    if (fileList.length > 0 && fileList[0].originFileObj) {
      if (data?.thumbnail?.url) {
        if (fileList[0].url !== data.thumbnail?.url) {
          formData.append("file", fileList[0].originFileObj);
        }
      } else {
        formData.append("file", fileList[0].originFileObj);
      }
    }

    try {
      if (data?.newsId) {
        await newsService.updateNews(data.newsId, formData);
        message.success("Cập nhật tin tức thành công!");
      } else {
        await newsService.createNews(formData);
        message.success("Thêm tin tức thành công!");
      }
      setFetchData(true);
      onClose();
    } catch (error) {
      switch (error.message) {
        case "News already exists!":
          message.error("Tin tức đã tồn tại!");
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
      title={data ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
      open={open}
      loading={loadingImage}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      okText="Lưu"
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên tin tức" }]}
        >
          <Input placeholder="Nhập tên tin tức" />
        </Form.Item>

        <Form.Item
          label="Hình ảnh:"
          name="thumbnail"
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
          label="Nội dung:"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

NewsForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default NewsForm;
