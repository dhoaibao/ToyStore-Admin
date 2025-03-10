import { Row, Col } from "antd";
import { DollarOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import StatCard from "../components/statistics/StatCard";
import RevenueChart from "../components/statistics/RevenueChart";
import OrderChart from "../components/statistics/OrderChart";

const Statistics = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Tổng quan</h1>

      {/* Thẻ thống kê */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Tổng doanh thu"
            value="$85,000"
            icon={<DollarOutlined className="text-xl text-white" />}
            color="bg-green-500"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Tổng đơn hàng"
            value="1,245"
            icon={<ShoppingCartOutlined className="text-xl text-white" />}
            color="bg-blue-500"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Tổng người dùng"
            value="3,500"
            icon={<UserOutlined className="text-xl text-white" />}
            color="bg-purple-500"
          />
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <RevenueChart />
        </Col>
        <Col xs={24} lg={12}>
          <OrderChart />
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;