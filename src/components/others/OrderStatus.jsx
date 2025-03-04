import PropTypes from "prop-types";
import { Modal, Steps, Button, message } from "antd";
import { generateStepItems, getStepStatus } from "../../utils";
import { useMemo, useState, useEffect } from "react";
import { orderService } from "../../services";

const OrderStatus = ({ open, setOpen, data, setFetchData }) => {
  const { stepItems, currentStep, stepStatus, lastTracking } = useMemo(() => {
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
      lastTracking,
    };
  }, [data?.orderTrackings]);

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  useEffect(() => {
    setCurrent(currentStep);
  }, [currentStep, open]);

  const handleChangeStep = (value) => {
    if (
      value - currentStep === 1 &&
      lastTracking?.orderStatus.orderStatusId !== 5
    ) {
      setCurrent(value);
    }
  };

  const handleUpdateOrderStatus = async () => {
    setLoading(true);
    try {
      await orderService.updateOrderStatus(data.orderId, {
        orderStatusId: current + 1,
      });
      message.success("Cập nhật trạng thái đơn hàng thành công!");
      setFetchData(true);
      setOpen(false);
    } catch (error) {
      message.error("Cập nhật trạng thái đơn hàng thất bại!");
      console.error("Failed to update order status: ", error.data);
    }
    setLoading(false);
  };

  const handleCancelOrder = async () => {
    setLoadingCancel(true);
    try {
      await orderService.cancelOrder(data.orderId);
      message.success("Hủy đơn hàng thành công!");
      setFetchData(true);
      setOpen(false);
    } catch (error) {
      message.error("Hủy đơn hàng thất bại!");
      console.error("Failed to cancel order: ", error.data);
    }
    setLoadingCancel(false);
  };

  const disabled =
    data?.orderTrackings[data?.orderTrackings.length - 1]?.orderStatus
      ?.orderStatusId === 5 ||
    data?.orderTrackings[data?.orderTrackings.length - 1]?.orderStatus
      ?.orderStatusId === 4;

  return (
    <Modal
      title={`Xử lý đơn hàng: #${data?.orderId}`}
      closable={false}
      maskClosable={false}
      footer={
        <div className="flex justify-between">
          <Button
            color="danger"
            variant="dashed"
            loading={loadingCancel}
            onClick={handleCancelOrder}
            disabled={disabled}
          >
            Hủy đơn hàng
          </Button>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button
              disabled={disabled}
              type="primary"
              loading={loading}
              onClick={handleUpdateOrderStatus}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      }
      open={open}
      centered
      width={700}
      className="max-h-[95vh] overflow-y-auto scrollbar-hide"
    >
      <Steps
        onChange={handleChangeStep}
        className="p-8"
        status={stepStatus}
        size="small"
        current={current}
        items={stepItems}
      ></Steps>
    </Modal>
  );
};

OrderStatus.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
  setFetchData: PropTypes.func,
};

export default OrderStatus;
