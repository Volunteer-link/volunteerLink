import { useEffect, useRef, useState } from 'react';
import api from '../../apiService/useFetch';
import { Button, message, Table, App as AntdApp, Select } from 'antd';

const HistoryVolunteer = () => {
  const refSearch = useRef<HTMLInputElement>(null);

  const [stateTransaction, setStateTransaction] = useState<
    {
      accountVolunteerId: number;
      createdDate: Date | string;
      eventId: number;
      eventName: string;
      money: number;
      volunteerImageUrl: string;
      volunteerName: string;
      transactionId: number;
    }[]
  >([]);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>('');
  const [month, setMonth] = useState<number | null>(null);
  const { message: messageApi } = AntdApp.useApp();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(
          `/donate/volunteer-history?PageNumber=${currentPage}&PageSize=${pageSize}${month ? `&Month=${month}` : ''}`
        );
        
        setTotal(data.data.transactions.totalItems);
        setStateTransaction(data.data.transactions.items);
      } catch (error: any) {
        console.log(error);
        if (error.response.data.Message === 'Input validation error') {
          messageApi.error('Mã giao dịch phải là số!');
        }
      }
    };
    fetchData();
  }, [currentPage, searchKey, month]);

  const columns = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionId',
      key: 'money',
      render: (value: number) => (
        <span className="text-stone-500">#{value}</span>
      ),
    },
    {
      title: 'Số tiền quyên góp',
      dataIndex: 'money',
      key: 'money',
      render: (value: number) =>
        `${new Intl.NumberFormat('vi-VN').format(value)} VND`,
    },
    {
      title: 'Ngày quyên góp',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value: string) =>
        new Date(value).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: 'Sự kiện',
      dataIndex: 'eventName',
      key: 'eventName',
      render: (text: string, record: any) => (
        <a
          href={`/detail-event/${record.eventId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {text}
        </a>
      ),
    },
  ];

  const handleClickSearch = async () => {
    if (Number(refSearch?.current!.value)) {
      setSearchKey(refSearch?.current!.value);
      setCurrentPage(1);
    } else {
      messageApi.error('Mã giao dịch phải là số!');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClickSearch();
    }
  };

  const handleExportToExcel = async () => {
    try {
      const { data } = await api.get('donate/export-excel-volunteer', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Xoá URL sau khi dùng
      window.URL.revokeObjectURL(url);
      messageApi.success('Xuất file thành công');
    } catch (error) {
      messageApi.success('Xuất file thất bại');
    }
  };

  const handleChange = (value: number) => {
    setMonth(value);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-primary-color text-lg font-medium my-4">
          Lịch sử giao dịch
        </div>
        {!!stateTransaction.length && (
          <Button onClick={handleExportToExcel} type="primary">
            Xuất thành file Excel
          </Button>
        )}
      </div>

      <Select
        className="max-w-[200px] mb-4 cursor-pointer"
        maxTagCount="responsive"
        size={'middle'}
        placeholder="Vui lòng thời gian"
        onChange={handleChange}
        style={{ width: '100%' }}
        options={[
          { label: '3 tháng gần nhất', value: 3 },
          { label: '6 tháng gần nhất', value: 6 },
          { label: '9 tháng gần nhất', value: 9 },
        ]}
      />

      <div>
        <Table
          rowKey={(record) =>
            `${record.accountVolunteerId}-${record.createdDate}`
          }
          dataSource={stateTransaction}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
    </div>
  );
};

export default HistoryVolunteer;
