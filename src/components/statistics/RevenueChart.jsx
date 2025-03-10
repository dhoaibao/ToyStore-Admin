import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { TIME_INTERVAL } from "../../constants";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const RevenueChart = ({ revenueData, labels, type }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [],
        borderColor: "#1c8a39",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchData = () => {
      try {
        const data = labels.map((label) => {
          const found = revenueData.find((item) => item.date === label);
          return found ? found.value : 0;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: "Doanh thu (VNĐ)",
              data,
              borderColor: "#1c8a39",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    if (revenueData && labels && type) {
      fetchData();
    }
  }, [revenueData, labels, type]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Thống kê doanh thu (${TIME_INTERVAL[type]})`,
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <Line data={chartData} options={options} />
    </div>
  );
};

RevenueChart.propTypes = {
  revenueData: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default RevenueChart;
