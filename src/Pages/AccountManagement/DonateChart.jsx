import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const DonateChart = ({ chartData }) => {
  const data = {
    labels: chartData?.map((item) => item.date), // ví dụ: '2025-04-01'
    datasets: [
      {
        label: "Tổng tiền ủng hộ (VNĐ)",
        data: chartData?.map((item) => item.money), // ví dụ: 500000
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Ủng hộ theo ngày",
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DonateChart;
