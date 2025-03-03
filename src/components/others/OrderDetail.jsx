import PropTypes from "prop-types";
import { Modal, Avatar, Steps } from "antd";
import moment from "moment";
import { PAYMENT_METHOD } from "../../constants";
import { generateStepItems, getStepStatus } from "../../utils";
import { useMemo } from "react";

const OrderDetail = ({ open, setOpen, data }) => {
  const { stepItems, currentStep, stepStatus } = useMemo(() => {
    const trackings = data?.orderTrackings || [];
    const lastTracking = trackings[trackings.length - 1];
    return {
      stepItems: generateStepItems(trackings).map((item) => ({
        ...item,
        description: item.description ? (
          <span className="text-xs">{item.description}</span>
        ) : null,
      })),
      currentStep: trackings.length - 1,
      stepStatus: getStepStatus(lastTracking?.orderStatus.statusName),
    };
  }, [data?.orderTrackings]);

  return (
    <Modal
      onCancel={() => setOpen(false)}
      title={`Đơn hàng: #${data?.orderId}`}
      footer={null}
      open={open}
      centered
      width={900}
      className="max-h-[95vh] overflow-y-auto scrollbar-hide"
    >
      <Steps
        className="p-4 pb-6"
        status={stepStatus}
        size="small"
        current={currentStep}
        items={stepItems}
      ></Steps>
      <div className="flex justify-between space-x-2">
        <div className="bg-gray-100 p-4 mb-2 rounded-md w-1/2">
          <p className="font-semibold text-base text-primary mb-2">
            Địa chỉ nhận hàng:{" "}
          </p>
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

        <div className="bg-gray-100 p-4 mb-2 rounded-md w-1/2">
          <p className="font-semibold text-base text-primary mb-2">
            Thông tin thanh toán:{" "}
          </p>
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
        </div>
      </div>
      <div className="bg-gray-100 p-4 mb-2 rounded-md">
        <p className="font-semibold text-base text-primary mb-2">
          Sản phẩm đã đặt:{" "}
        </p>
        <div>
          {data?.orderDetails.map((item, index) => (
            <div key={index} className="py-1">
              <div className="flex space-x-2">
                <Avatar
                  src={item.product.productImages[0].url}
                  shape="square"
                  size={64}
                  className="border border-gray-300"
                />
                <div>
                  <p className="font-semibold line-clamp-1">
                    {item.product.productName}
                  </p>
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
      </div>
    </Modal>
  );
};

OrderDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default OrderDetail;
