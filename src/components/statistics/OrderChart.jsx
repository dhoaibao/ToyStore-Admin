import { Bar } from "react-chartjs-2";
import { TIME_INTERVAL } from "../../constants";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const OrderChart = ({ orderData, labels, type }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Đơn hàng",
        data: [],
        backgroundColor: "#223dba",
        borderColor: "#122da6",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = () => {
      try {
        const data = labels.map((label) => {
          const found = orderData.find((item) => item.date === label);
          return found ? found.value : 0;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: "Đơn hàng",
              data,
              backgroundColor: "#223dba",
              borderColor: "#122da6",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    if (orderData && labels && type) {
      fetchData();
    }
  }, [orderData, labels, type]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Thống kê đơn hàng (${TIME_INTERVAL[type]})`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Khoảng thời gian",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số đơn hàng",
        },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <Bar data={chartData} options={options} />
    </div>
  );
};

OrderChart.propTypes = {
  orderData: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default OrderChart;
