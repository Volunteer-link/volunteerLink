import React, { useEffect, useState } from 'react';
import api from '../../apiService/useFetch';
import { Avatar, Pagination, Select, Table } from 'antd';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Loading from '../Components/Loading';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/donate/organization-history`, {
          params: {
            EventId: eventId,
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
    };

    fetchData();
  }, [pageNumber, eventId]);

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
      title: 'Tên sự kiện',
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
      render: (money: number) => money.toLocaleString('vi-VN') + ' đ',
    },
  ];

  // Chuyển trang
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  return (
    <div>
      <div className="text-primary-color text-xl font-medium">
        Lịch sử giao dịch
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
