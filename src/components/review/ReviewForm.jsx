import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  message,
  Rate,
  Image,
  Collapse,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { reviewService } from "../../services";
import moment from "moment";
import { useSelector } from "react-redux";

const ReviewForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const loadImage = async () => {
      if (data) {
        setLoadingImage(true);
        form.setFieldsValue(data);
        setFileList([]);
        setLoadingImage(false);
      } else {
        form.resetFields();
        setFileList([]);
      }
    };

    if (open) loadImage();
  }, [open, data, form]);

  const childrenReviews =
    data?.childrenReviews.sort((a, b) => a.createdAt < b.createdAt) || [];

  const items = childrenReviews.map((item, index) => ({
    key: index,
    label: (
      <div className="flex justify-between">
        <p className="font-medium">Người trả lời: {item?.user?.fullName}</p>
        <p className="text-gray-600 text-xs">
          {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
        </p>
      </div>
    ),
    children: (
      <div>
        <p>{item.comment}</p>
        {item?.uploadImages?.length > 0 && (
          <div className="flex mt-2 space-x-2">
            {item?.uploadImages?.map((image, index) => (
              <Image
                width="80px"
                height="80px"
                key={index}
                src={image.url}
                alt=""
              />
            ))}
          </div>
        )}
      </div>
    ),
  }));

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

    formData.append("comment", values.commentReply);
    formData.append("parentReviewId", data.reviewId);
    formData.append("userId", user.userId);

    if (fileList.length > 0) {
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });
    }

    try {
      await reviewService.createReview(formData);
      message.success("Trả lời thành công!");
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
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      maskClosable={false}
      title="Trả lời đánh giá"
      open={open}
      loading={loadingImage}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      width={800}
      okText="Trả lời"
      cancelText="Hủy"
      className="max-h-[95vh] overflow-y-auto scrollbar-hide"
    >
      <div className="flex flex-row space-x-4">
        <div className="mb-2 w-1/2 space-y-1 p-4 rounded-md">
          <p>
            <span className="font-medium">Người đánh giá: </span>
            {data?.user?.fullName}
          </p>
          <p>
            <span className="font-medium">Ngày đánh giá: </span>
            {moment(data?.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          <p className="font-medium">Đánh giá: </p>
          <p>
            <Rate disabled allowHalf value={data?.rating} />
          </p>
          <p>{data?.comment}</p>

          {data?.uploadImages?.length > 0 && (
            <div className="flex mt-2 space-x-2">
              {data?.uploadImages?.map((image, index) => (
                <Image
                  width="80px"
                  height="80px"
                  key={index}
                  src={image.url}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-1/2 p-4 rounded-md"
        >
          <Form.Item
            label="Trả lời:"
            name="commentReply"
            rules={[
              { required: true, message: "Vui lòng nhập trả lời đánh giá" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Hình ảnh:" name="images">
            <Upload
              fileList={fileList}
              listType="picture-card"
              maxCount={5}
              accept="image/*"
              beforeUpload={() => false}
              onChange={handleUploadChange}
              onRemove={handleRemove}
            >
              {fileList.length < 5 && (
                <div className="flex-col">
                  <UploadOutlined /> <p>Tải lên</p>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </div>
      {items.length > 0 && <Collapse items={items} defaultActiveKey={["0"]} />}
    </Modal>
  );
};

ReviewForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default ReviewForm;
