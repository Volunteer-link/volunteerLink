import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DonateChart = ({ chartData }) => {
  const data = {
    labels: chartData.map(item => item.date), // ví dụ: '2025-04-01'
    datasets: [
      {
        label: 'Tổng tiền donate (VNĐ)',
        data: chartData.map(item => item.money), // ví dụ: 500000
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Donate theo ngày',
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default DonateChart;
