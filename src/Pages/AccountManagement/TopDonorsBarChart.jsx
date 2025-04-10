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

const TopDonorsBarChart = ({ chartData }) => {
  const data = {
    labels: chartData.map(item => item.accountName),
    datasets: [
      {
        label: 'Tổng số tiền donate (VNĐ)',
        data: chartData.map(item => item.money),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderRadius: 10,
      }
    ]
  };

  const options = {
    indexAxis: 'y', // Biểu đồ thanh ngang
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top Người Donate Nhiều Nhất',
        font: {
          size: 18
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw.toLocaleString('vi-VN') + ' VNĐ';
            return `💸 ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default TopDonorsBarChart;
