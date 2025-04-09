import React, { useCallback, useEffect, useState } from 'react';
import api from '../../apiService/useFetch';
import { Avatar, Pagination, Select, Table } from 'antd';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Loading from '../Components/Loading';
import { useDebounce } from '../../ultils/useDebounce';

const { Option } = Select;

const HistoryOrganization = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const page = searchParams.get('page');
  const [totalPage, setTotalPage] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(parseInt(page!) || 1);
  const [eventId, setEventId] = useState<number | null>(null);
  const [stateEvent, setStateEvent] = useState<{ id: number; name: string }[]>(
    []
  );
  const [searchTransaction, setTransaction] = React.useState<string>('');
  const searchDebounce = useDebounce<string>(searchTransaction, 500);

  const [stateTransaction, setStateTransaction] = useState<
    {
      accountVolunteerId: number;
      createdDate: Date | string;
      eventId: number;
      eventName: string;
      money: number;
      volunteerImageUrl: string;
      volunteerName: string;
    }[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/donate/organization-history`, {
        params: {
          EventId: eventId,
          TransactionId: null,
          PageNumber: pageNumber,
          PageSize: 5,
        },
      });
      setTotalPage(data.data.transactions.totalItems || 0);
      setStateEvent(data.data.events || []);
      setStateTransaction(
        Array.isArray(data.data.transactions.items)
          ? data.data.transactions.items
          : []
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  }, [pageNumber, eventId, searchDebounce]);

  useEffect(() => {
    fetchData();
  }, [pageNumber, eventId, searchDebounce]);

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'volunteerImageUrl',
      key: 'volunteerImageUrl',
      render: (volunteerImageUrl: string, record: any) => (
        <Avatar src={volunteerImageUrl} alt={record.volunteerName} />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'volunteerName',
      key: 'volunteerName',
    },
    {
      title: 'Sự kiện',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Tiền',
      dataIndex: 'money',
      key: 'money',
      render: (money: number) => money.toLocaleString('vi-VN') + ' VND',
    },
  ];

  // Chuyển trang
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleClickSearch = () => {
    fetchData();
    setPageNumber(1);
  };

  return (
    <div>
      <div className="text-primary-color text-xl font-medium">
        Lịch sử giao dịch
      </div>

      <div className="flex justify-center mb-6 items-center w-full">
        <div className="lg:w-[36rem] mb-8 w-full bg-white rounded-full border border-primary-color flex items-center justify-between mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã giao dịch..."
            className="flex-1 outline-none py-3 px-5 rounded-full relative text-base"
            onChange={(e) => setTransaction(e.target.value)}
          />
          <div className="flex pr-2 items-center gap-4 select-none">
            <div
              onClick={handleClickSearch}
              className="bg-primary-color text-white lg:px-4 text-nowrap px-8 py-2 lg:py-2 text-xs lg:text-sm rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
            >
              Tìm kiếm
            </div>
          </div>
        </div>
      </div>

      <div className="my-4">
        <Select
          placeholder="Chọn sự kiện"
          style={{ width: 250 }}
          onChange={(value) => setEventId(value)}
        >
          {stateEvent.map((event) => (
            <Option key={event.id} value={event.id}>
              {event.name}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <Table
          rowKey="createdDate"
          columns={columns}
          loading={isLoading}
          dataSource={stateTransaction}
          pagination={false}
        />
        <Pagination
          className="my-8"
          current={pageNumber}
          total={totalPage}
          pageSize={5}
          onChange={handlePageChange}
          responsive
        />
      </div>
    </div>
  );
};

export default HistoryOrganization;
