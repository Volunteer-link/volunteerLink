import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const BarChart = ({ chartData }) => {
  const data = {
    labels: chartData.map(item => item.month),
    datasets: [{
      label: 'Tổng tiền donate (VNĐ)',
      data: chartData.map(item => item.money),
      backgroundColor: '#36A2EB'
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Donate theo tháng (Bar Chart)'
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
