import { Row, Col, Select, DatePicker } from "antd";
import StatCard from "../components/statistics/StatCard";
import RevenueChart from "../components/statistics/RevenueChart";
import OrderChart from "../components/statistics/OrderChart";
import ProductChart from "../components/statistics/ProductChart";
import { CircleDollarSign, ShoppingCart, User, Blocks } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { statisticService } from "../services";
import { generateLabels } from "../utils";

const { RangePicker } = DatePicker;

const Statistics = () => {
  const [type, setType] = useState("day");
  const [value, setValue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [labels, setLabels] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  console.log({ revenueData });

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const fetch = async (query) => {
    if (!query) {
      query = `start=${dayjs().startOf('month').format('YYYY-MM-DD')}&end=${dayjs().format('YYYY-MM-DD')}&type=${type}`;
    };
    const response = await statisticService.getStatistics(query);
    setTotalUsers(response.data.totalUsers);
    setTotalRevenue(response.data.totalRevenue);
    setTotalOrders(response.data.totalOrders);
    setTotalProducts(response.data.totalProducts);
    setRevenueData(response.data.revenues);
    setOrderData(response.data.orders);
  };

  useEffect(() => {
    const now = dayjs();
    const startOfMonth = now.clone().startOf("month");
    const endOfMonth = now;
    setValue([startOfMonth, endOfMonth]);
  }, []);

  useEffect(() => {
    fetch(searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    if (value[0] && value[1] && type) {
      const labels = generateLabels(value[0], value[1], type);
      setLabels(labels);
    }
  }, [value, type]);

  const formatDate = (date, type) => {
    switch (type) {
      case "day":
        return date.format("YYYY-MM-DD");
      case "month":
        return date.format("YYYY-MM");
      case "quarter":
        return date.format("YYYY-[Q]Q");
      case "year":
        return date.format("YYYY");
      default:
        return date.format("YYYY-MM-DD");
    }
  };

  const handleDeleteParams = () => {
    searchParams.delete("start");
    searchParams.delete("end");
    searchParams.delete("type");
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const handleOnChange = (dates) => {
    if (!dates || !dates[0] || !dates[1]) {
      handleDeleteParams();
      return;
    }

    try {
      setValue(dates);

      searchParams.set("start", formatDate(dates[0], type));
      searchParams.set("end", formatDate(dates[1], type));
      searchParams.set("type", type);

      navigate({ search: searchParams.toString() }, { replace: true });
    } catch (error) {
      console.error("Error formatting dates:", error);
    }
  };

  const handleTypeChange = (value) => {
    handleDeleteParams();
    setValue([]);
    setType(value);
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Tổng quan</h1>
        <div className="space-x-2">
          <Select
            className="w-32"
            options={[
              { value: "day", label: "Ngày" },
              { value: "month", label: "Tháng" },
              { value: "quarter", label: "Quý" },
              { value: "year", label: "Năm" },
            ]}
            defaultValue="month"
            value={type}
            onChange={handleTypeChange}
          />
          <RangePicker value={value} picker={type} onChange={handleOnChange} />
        </div>
      </div>

      {/* Thẻ thống kê */}
      <Row gutter={[6, 6]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng doanh thu"
            value={`${totalRevenue.toLocaleString()} đ`}
            icon={<CircleDollarSign color="black" strokeWidth={1.25} />}
            color="bg-white"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng đơn hàng"
            value={totalOrders.toLocaleString()}
            icon={<ShoppingCart color="black" strokeWidth={1.25} />}
            color="bg-white"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng sản phẩm"
            value={totalProducts.toLocaleString()}
            icon={<Blocks color="black" strokeWidth={1.25} />}
            color="bg-white"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng người dùng"
            value={totalUsers.toLocaleString()}
            icon={<User color="black" strokeWidth={1.25} />}
            color="bg-white"
          />
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16} className="space-y-4">
          <RevenueChart revenueData={revenueData} labels={labels} type={type} />
          <OrderChart orderData={orderData} labels={labels} type={type} />
        </Col>
        <Col xs={24} lg={8}>
          <ProductChart />
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
