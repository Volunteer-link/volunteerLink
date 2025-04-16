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

const TopDonatedEventsChart = ({ chartData }) => {
  const data = {
    labels: chartData.map((item) => item.eventName),
    datasets: [
      {
        label: 'Tổng tiền ủng hộ (VNĐ)',
        data: chartData.map((item) => item.money),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top Sự Kiện Được Ủng Hộ Nhiều Nhất',
        font: {
          size: 12,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw?.toLocaleString('vi-VN') + ' VNĐ';
            return `💸 ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString('vi-VN')} VNĐ`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default TopDonatedEventsChart;
