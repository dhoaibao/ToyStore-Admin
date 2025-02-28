import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Avatar } from "antd";
import moment from "moment";
import { PAYMENT_METHOD, ORDER_STATUS } from "../../constants";

const OrderDetail = ({ open, setOpen, data }) => {
  console.log(PAYMENT_METHOD);
  const items = [
    {
      key: "1",
      label: <p className="font-semibold text-primary">Địa chỉ nhận hàng:</p>,
      span: "filled",
      children: (
        <div>
          {[
            { label: "Người nhận", value: data?.orderAddress.contactName },
            { label: "Số điện thoại", value: data?.orderAddress.contactPhone },
            { label: "Địa chỉ", value: data?.orderAddress.address },
          ].map((item, index) => (
            <div key={index} className="flex space-x-1">
              <p className="font-semibold">{item.label}:</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <p className="font-semibold text-primary">Thông tin thanh toán:</p>
      ),
      span: "filled",
      children: (
        <div>
          {[
            {
              label: "Thời gian đặt hàng",
              value: moment(data?.createdAt).format("DD/MM/YYYY HH:mm"),
            },
            {
              label: "Phương thức thanh toán",
              value:
                PAYMENT_METHOD[data?.paymentMethod.paymentMethodName]?.label,
            },
            {
              label: "Trạng thái thanh toán",
              value: `${
                data?.paymentStatus ? "Đã thanh toán" : "Chờ thanh toán"
              }`,
            },
            {
              label: "Tiền hàng",
              value: `${data?.totalPrice.toLocaleString("vi-VN")}đ`,
            },
            {
              label: "Giảm",
              value: `-${data?.totalDiscount.toLocaleString("vi-VN")}đ`,
            },
            {
              label: "Phí vận chuyển",
              value: `${data?.shippingFee.toLocaleString("vi-VN")}đ`,
            },
            {
              label: "Tổng",
              value: `${data?.finalPrice.toLocaleString("vi-VN")}đ`,
              className: "text-red-600 font-semibold",
            },
          ].map((item, index) => (
            <div key={index} className="flex space-x-1">
              <p className="font-semibold">{item.label}:</p>
              <p className={item.className || ""}>{item.value}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: <p className="font-semibold text-primary">Sản phẩm đã đặt:</p>,
      span: "filled",
      children: (
        <div>
          {data?.orderDetails.map((item, index) => (
            <div key={index} className="py-2">
              <div className="flex space-x-2">
                <Avatar
                  src={item.product.productImages[0].url}
                  shape="square"
                  size={64}
                  className="border border-gray-300"
                />
                <div>
                  <p className="font-semibold">{item.product.productName}</p>
                  <p>{`Số lượng: ${item.quantity}`}</p>
                  <p>{`Giá: ${
                    item.discountedPrice !== 0
                      ? item.discountedPrice.toLocaleString("vi-VN")
                      : item.price.toLocaleString("vi-VN")
                  }đ`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Modal
      onCancel={() => setOpen(false)}
      footer={null}
      open={open}
      centered
      width={800}
    >
      <Descriptions
        bordered
        title={`Đơn hàng: #${data?.orderId}`}
        items={items}
      />
    </Modal>
  );
};

OrderDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default OrderDetail;
