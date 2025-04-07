import { useEffect, useState } from "react";
import api from "../../apiService/useFetch";
import { Table } from "antd";

const HistoryVolunteer = () => {
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
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(
        `/donate/volunteer-history?PageNumber=${currentPage}&PageSize=${pageSize}`
      );
      console.log(data);

      setTotal(data.data.transactions.totalItems);
      setStateTransaction(data.data.transactions.items);
    };
    fetchData();
  }, [currentPage]);

  const columns = [
    {
      title: "Sự kiện",
      dataIndex: "eventName",
      key: "eventName",
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
    {
      title: "Số tiền quyên góp",
      dataIndex: "money",
      key: "money",
      render: (value: number) =>
        `${new Intl.NumberFormat("vi-VN").format(value)} VND`,
    },
    {
      title: "Ngày quyên góp",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (value: string) =>
        new Date(value).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];
  console.log(stateTransaction);
  return (
    <div>
      <div className="text-primary-color text-lg font-medium my-4">
        Lịch sử giao dịch
      </div>
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
