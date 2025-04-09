import { useEffect, useRef, useState } from "react";
import api from "../../apiService/useFetch";
import { Table } from "antd";

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
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(
        `/donate/volunteer-history?TransactionId=${searchKey}&PageNumber=${currentPage}&PageSize=${pageSize}`
      );

      setTotal(data.data.transactions.totalItems);
      setStateTransaction(data.data.transactions.items);
    };
    fetchData();
  }, [currentPage, searchKey]);

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionId",
      key: "money",
      render: (value: number) => (
        <span className="text-stone-500">#{value}</span>
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
  ];

  const handleClickSearch = async () => {
    setSearchKey(refSearch?.current!.value);
    setCurrentPage(1);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClickSearch();
    }
  };
  return (
    <div>
      <div className="text-primary-color text-lg font-medium my-4">
        Lịch sử giao dịch
      </div>
      <div className="my-4">
        <div className="flex items-center justify-center gap-2">
          <div className="lg:w-[36rem] w-4/5 bg-white border-2 border-primary-color rounded-full flex items-center justify-between">
            <input
              ref={refSearch}
              type="text"
              placeholder="Tìm kiếm theo mã giao dịch..."
              className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
              onKeyDown={handleKeyDown}
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
