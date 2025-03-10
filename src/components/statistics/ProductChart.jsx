import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Select } from "antd";
import { statisticService } from "../../services";

ChartJS.register(ArcElement, Tooltip, Legend);

const colorMap = {};
const generateRandomColor = (key) => {
  if (!colorMap[key]) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colorMap[key] = `rgba(${r}, ${g}, ${b}, 0.6)`;
  }
  return colorMap[key];
};

const ProductChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverOffset: 4,
      },
    ],
  });

  const [selectedOption, setSelectedOption] = useState("brand");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticService.getProducts(
          `option=${selectedOption}`,
        );
        
        const productData = response.data;

        const labels = productData.map((item) => item[selectedOption]);
        const data = productData.map((item) => item.count);

        const backgroundColors = labels.map((label) =>
          generateRandomColor(label),
        );

        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
              hoverOffset: 4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [selectedOption]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: "Phân bổ sản phẩm (toàn cửa hàng)",
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <Select
        className="w-36 mb-2"
        options={[
          { value: "brand", label: "Thương hiệu" },
          { value: "category", label: "Danh mục" },
        ]}
        value={selectedOption}
        onChange={(value) => setSelectedOption(value)}
      />
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ProductChart;
