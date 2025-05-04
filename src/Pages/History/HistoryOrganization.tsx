import React, { useCallback, useEffect, useState } from "react";
import api from "../../apiService/useFetch";
import {
  Avatar,
  Button,
  message,
  Pagination,
  Select,
  Table,
  App as AntdApp,
} from "antd";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Loading from "../Components/Loading";
import { useDebounce } from "../../ultils/useDebounce";

const { Option } = Select;

const HistoryOrganization = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const page = searchParams.get("page");
  const [totalPage, setTotalPage] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(parseInt(page!) || 1);
  const [eventId, setEventId] = useState<number | null>(null);
  const [stateEvent, setStateEvent] = useState<{ id: number; name: string }[]>(
    []
  );
  const [searchTransaction, setTransaction] = React.useState<string>("");
  const searchDebounce = useDebounce<string>(searchTransaction, 500);
  const { message: messageApi } = AntdApp.useApp();
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
  const [month, setMonth] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/donate/organization-history`, {
        params: {
          EventId: eventId,
          TransactionId: searchDebounce.replace("#", ""),
          PageNumber: pageNumber,
          PageSize: 5,
          ...(month && { month: month }),
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
  }, [pageNumber, eventId, searchDebounce, month]);

  useEffect(() => {
    fetchData();
  }, [pageNumber, eventId, searchDebounce, month]);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "volunteerImageUrl",
      key: "volunteerImageUrl",
      render: (volunteerImageUrl: string, record: any) => (
        <Avatar src={volunteerImageUrl} alt={record.volunteerName} />
      ),
    },
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

  // Chuyển trang
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleClickSearch = () => {
    fetchData();
    setPageNumber(1);
  };
  const handleExportToExcel = async () => {
    try {
      const { data } = await api.get("/donate/export-excel-organization", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Xoá URL sau khi dùng
      window.URL.revokeObjectURL(url);
      messageApi.success("Xuất file thành công");
    } catch (error) {
      messageApi.success("Xuất file thất bại");
    }
  };

  const handleChange = (value: number) => {
    setMonth(value);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-primary-color text-xl font-medium">
          Lịch sử giao dịch
        </div>
        {!!stateTransaction.length && (
          <Button onClick={handleExportToExcel} type="primary">
            Xuất thành file Excel
          </Button>
        )}
      </div>

      <div className="flex justify-center  my-6 items-center w-full">
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

      <div className="my-4 flex justify-start gap-2 flex-wrap items-center w-full">
        <Select
          placeholder="Chọn sự kiện"
          style={{ width: 250 }}
          onChange={(value) => {
            if (value === 0) {
              setEventId(null);
            } else {
              setEventId(value);
            }
          }}
        >
          <Option key={0} value={0}>
            Tất cả sự kiện
          </Option>
          {stateEvent?.map((event) => (
            <Option key={event.id} value={event.id}>
              {event.name}
            </Option>
          ))}
        </Select>
        <Select
          className="max-w-[200px] cursor-pointer"
          maxTagCount="responsive"
          size={"middle"}
          placeholder="Vui lòng thời gian"
          onChange={handleChange}
          style={{ width: "100%" }}
          options={[
            { label: "3 tháng gần nhất", value: 3 },
            { label: "6 tháng gần nhất", value: 6 },
            { label: "9 tháng gần nhất", value: 9 },
          ]}
        />
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
