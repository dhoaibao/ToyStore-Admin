import PropTypes from "prop-types";
import { Modal, List, Button } from "antd";
import dayjs from "dayjs";

const PromotionPeriod = ({
  open,
  setOpen,
  selectedPromotionPeriod,
  setSelectedPromotionPeriod,
  promotionPeriods,
}) => {
  return (
    <Modal
      onCancel={() => setOpen(false)}
      title="Đợt giảm giá"
      footer={null}
      open={open}
      width={600}
      className="max-h-svh overflow-y-auto"
    >
      <List
        dataSource={promotionPeriods}
        renderItem={(item) => {
          const isSelected =
            selectedPromotionPeriod?.promotionPeriodId ===
            item.promotionPeriodId;

          return (
            <List.Item
              className={`cursor-pointer rounded-md ${isSelected ? "bg-blue-100" : ""}`}
              onClick={() => {
                setSelectedPromotionPeriod(item);
                setOpen(false);
              }}
            >
              <div className="flex justify-between w-full p-2">
                <div>
                  <span className="font-semibold">Từ ngày:</span>{" "}
                  {dayjs(item.startDate).format("DD/MM/YYYY HH:mm")}
                </div>
                <div>
                  <span className="font-semibold">Đến ngày:</span>{" "}
                  {item.endDate
                    ? dayjs(item.endDate).format("DD/MM/YYYY HH:mm")
                    : "Hiện tại"}
                </div>
              </div>
            </List.Item>
          );
        }}
      />
      <Button
        className="mt-4"
        onClick={() => {
          setSelectedPromotionPeriod(null);
          setOpen(false);
        }}
      >
        Thêm
      </Button>
    </Modal>
  );
};

PromotionPeriod.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedPromotionPeriod: PropTypes.array,
  setSelectedPromotionPeriod: PropTypes.func.isRequired,
  promotionPeriods: PropTypes.array,
};

export default PromotionPeriod;
