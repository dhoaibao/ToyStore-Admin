import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, Form, Input, message, Switch, Select, Button } from "antd";
import { productInformationService } from "../../services";
import { Trash2, CirclePlus } from "lucide-react";

const ProductInfoForm = ({ open, setOpen, data, setFetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const setData = async () => {
      if (data) {
        form.setFieldsValue(data);
        setSelectedType(data.type);
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

    console.log("values", values);

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
      onClose();
    } catch (error) {
      if (error.message === "Product information already exists!") {
        message.error("Thông tin sản phẩm đã tồn tại!");
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
      console.error(error);
    }
    setLoading(false);
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
          <Input placeholder="Nhập thông tên tin sản phẩm" />
        </Form.Item>
        <Form.Item
          label="Loại:"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại" }]}
        >
          <Select
            placeholder="Chọn loại"
            onChange={(value) => {
              setSelectedType(value);
              form.resetFields(["options"]);
            }}
            allowClear
          >
            <Select.Option value="INPUT">INPUT</Select.Option>
            <Select.Option value="INPUT_NUMBER">INPUT_NUMBER</Select.Option>
            <Select.Option value="SELECT">SELECT</Select.Option>
            <Select.Option value="AUTOCOMPLETE">AUTOCOMPLETE</Select.Option>
          </Select>
        </Form.Item>
        {(selectedType === "SELECT" || selectedType === "AUTOCOMPLETE") && (
          <Form.Item label="Options:" name="options">
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          { required: true, message: "Vui lòng nhập option" },
                        ]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input
                          placeholder="Nhập gía trị"
                          onChange={() =>
                            form.setFieldsValue({
                              options: form.getFieldValue("options"),
                            })
                          }
                        />
                      </Form.Item>
                      <Button
                        type="text"
                        onClick={() => remove(name)}
                        className="ml-2"
                      >
                        <Trash2 strokeWidth={1} color="red" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="text"
                    className="text-primary p-0"
                    onClick={() => add()}
                  >
                    <CirclePlus size={18} strokeWidth={1} />
                    Thêm option
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
        )}
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

ProductInfoForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default ProductInfoForm;
