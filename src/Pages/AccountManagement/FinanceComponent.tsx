import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import DonateChart from './DonateChart';
import TopDonorsBarChart from './TopDonorsBarChart';
import api from '../../apiService/useFetch'; // 👉 nhớ check path nha Đại Ca

const FinanceComponent = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [donorChartData, setDonorChartData] = useState([]);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const [monthRes, dayRes, donorRes] = await Promise.all([
          api.get('/statistic/donate-by-month'),
          api.get('/statistic/donate-by-day'),
          api.get('/statistic/top-donated-volunteer'),
        ]);

        // 📊 Donate theo tháng
        if (monthRes.data?.code === 200) {
          const mapped = monthRes.data.data.map((item: any) => ({
            month: `${item.month}/${item.year}`,
            money: item.totalMoney,
          }));
          setBarChartData(mapped);
        }

        // 📈 Donate theo ngày
        if (dayRes.data?.code === 200) {
          const mapped = dayRes.data.data.map((item: any) => ({
            date: `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`,
            money: item.totalMoney,
          }));
          setLineChartData(mapped);
        }

        // 🧑‍🤝‍🧑 Top người donate
        if (donorRes.data?.code === 200) {
          const mapped = donorRes.data.data.map((item: any) => ({
            accountName: item.name,
            money: item.totalMoney,
          }));
          setDonorChartData(mapped);
        }
      } catch (err) {
        console.error('🔥 Lỗi khi fetch dữ liệu tài chính:', err);
      }
    };

    fetchFinanceData();
  }, []);

  return (
    <div className="p-12 lg:flex-1 h-full">
      <div className="text-2xl mb-4">Quản lý tài chính</div>
  
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
  
        {/* Biểu đồ theo tháng */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <BarChart chartData={barChartData} />
        </div>
  
        {/* Biểu đồ theo ngày */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <DonateChart chartData={lineChartData} />
        </div>
  
        {/* Top người donate */}
        <div className="bg-white p-4 rounded-xl shadow-md md:col-span-2 xl:col-span-1">
          <TopDonorsBarChart chartData={donorChartData} />
        </div>
        
      </div>
    </div>
  );
  
};

export default FinanceComponent;
