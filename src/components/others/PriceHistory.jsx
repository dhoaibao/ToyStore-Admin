import PropTypes from "prop-types";
import { Modal, Table } from "antd";
import moment from "moment";

const PriceHistory = ({ open, setOpen, data }) => {
  return (
    <Modal
      onCancel={() => setOpen(false)}
      title="Lịch sử giá"
      footer={null}
      open={open}
      width={600}
      className="max-h-svh overflow-y-auto"
    >
      <Table
        columns={[
          {
            title: (
              <div className="text-center">
                <span>Giá</span>
              </div>
            ),
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (price) => price.toLocaleString("vi-VN") + "đ",
          },
          {
            title: "Từ ngày",
            dataIndex: "startDate",
            key: "startDate",
            align: "center",
            render: (time) => moment(time).format("DD/MM/YYYY HH:mm"),
          },
          {
            title: "Đến ngày",
            dataIndex: "endDate",
            key: "endDate",
            align: "center",
            render: (time) =>
              time ? moment(time).format("DD/MM/YYYY HH:mm") : "Hiện tại",
          },
        ]}
        dataSource={data}
        pagination={false}
      />
    </Modal>
  );
};

PriceHistory.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default PriceHistory;
