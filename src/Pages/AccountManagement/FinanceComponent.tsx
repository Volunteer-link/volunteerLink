import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import DonateChart from './DonateChart';
import TopDonorsBarChart from './TopDonorsBarChart';
import api from '../../apiService/useFetch';

const FinanceComponent = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [donorChartData, setDonorChartData] = useState([]);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        // Gọi 3 API song song luôn cho lẹ
        const [monthRes, dayRes, donorRes] = await Promise.all([
          api.get('/statistic/donate-by-month'),
          api.get('/statistic/donate-by-day'),
          api.get('/statistic/top-donated-volunteer'),
        ]);

        // ✅ Xử lý dữ liệu donate theo tháng
        if (monthRes.data?.code === 200) {
          const mapped = monthRes.data.data.map(
            (item: { month: number; year: number; totalMoney: number }) => ({
              month: `${item.month}/${item.year}`,
              money: item.totalMoney,
            })
          );
          setBarChartData(mapped);
        }

        // ✅ Xử lý dữ liệu donate theo ngày
        if (dayRes.data?.code === 200) {
          const mapped = dayRes.data.data.map(
            (item: { day: number; month: number; year: number; totalMoney: number }) => ({
              date: `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`,
              money: item.totalMoney,
            })
          );
          setLineChartData(mapped);
        }

        // ✅ Xử lý dữ liệu top người donate
        if (donorRes.data?.code === 200) {
          const mapped = donorRes.data.data.map(
            (item: { name: string; totalMoney: number }) => ({
              accountName: item.name,
              money: item.totalMoney,
            })
          );
          setDonorChartData(mapped);
        }
      } catch (err) {
        console.error('🔥 Lỗi khi fetch dữ liệu tài chính:', err);
      }
    };

    fetchFinanceData();
  }, []);

  return (
    <div className="p-8 lg:p-12 lg:flex-1 h-full bg-gray-50">
  <div className="text-3xl font-bold text-gray-800 mb-6">📊 Quản lý tài chính</div>

  <div className="space-y-8">

    {/* Biểu đồ donate theo tháng */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="text-lg font-semibold text-gray-700 mb-4">Tổng tiền donate theo tháng</div>
      <BarChart chartData={barChartData} />
    </div>

    {/* Biểu đồ donate theo ngày */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="text-lg font-semibold text-gray-700 mb-4">Tổng tiền donate theo ngày</div>
      <DonateChart chartData={lineChartData} />
    </div>

    {/* Biểu đồ top người donate */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="text-lg font-semibold text-gray-700 mb-4">Top người donate nhiều nhất</div>
      <TopDonorsBarChart chartData={donorChartData} />
    </div>

  </div>
</div>

  );
};

export default FinanceComponent;
