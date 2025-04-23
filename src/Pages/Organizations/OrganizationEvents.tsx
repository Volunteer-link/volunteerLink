import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import api from "../../apiService/useFetch";
import { Button, Col, Empty, Pagination, Row, Spin, Tabs } from "antd";
import EventCard from "../Components/EventCard";
import { TabsProps } from "antd/lib";
import { useDebounce } from "../../ultils/useDebounce";
import { FaPlus } from "react-icons/fa";
import { decodedCookie, getCookie } from "../../ultils/cookie";

const OrganizationEvents = () => {
  const { id } = useParams();
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const [eventList, setEventList] = useState<EventCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number>(0);
  const [searchName, setSearchName] = useState<string>("");
  const searchDebounce = useDebounce<string>(searchName, 500);
  const [totalPage, setTotalPage] = React.useState<number>();
  const navigate = useNavigate();
  const onChange = (key: string) => {
    setStatus(parseInt(key));
    setPageNumber(1);
  };

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "Đang diễn ra",
    },
    {
      key: "-1",
      label: "Sắp diễn ra",
    },
    {
      key: "1",
      label: "Đã diễn ra",
    },
    {
      key: "2",
      label: "Chưa xuất bản",
    },
  ];

  const fetchField = useCallback(async () => {
    try {
      setLoading(true);

      const { data: acc } = await api.get(`/profile/organization`, {
        params: {
          Id: decodedCookie(getCookie("accessToken"))?.AccId,
        },
      });

      console.log(acc);

      const { data } = await api.get(`/common/get-events-of-organization`, {
        params: {
          SearchName: searchDebounce,
          OrganizationId: acc?.data.id,
          EventStatus: status,
          PageNumber: PageNumber,
          PageSize: 8,
        },
      });
      setTotalPage(data.data.totalItems);
      setEventList(data.data.items);
      setLoading(false);
    } catch (e: any) {
    } finally {
    }
  }, [PageNumber, status, searchDebounce]);

  useEffect(() => {
    fetchField();
  }, [PageNumber, status, searchDebounce]);
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleClickSearch = () => {
    setPageNumber(1);
    fetchField();
  };

  return (
    <div className="relative">
      <div className="text-primary-color font-medium text-xl my-6">
        Quản lý sự kiện
      </div>
      <div className="lg:w-[36rem] mb-8 w-full bg-white rounded-full border border-[#000000] flex items-center justify-between mx-auto">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sự kiện..."
          className="flex-1 outline-none py-3 px-5 rounded-full relative text-base"
          onChange={(e) => setSearchName(e.target.value)}
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
      <div className="flex justify-between items-start">
        <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
        <Button
          onClick={() => {
            navigate("/create-event");
          }}
          type="primary"
          size="large"
        >
          Tạo sự kiện mới
          <FaPlus />
        </Button>
      </div>

      {loading ? (
        <div className="flex absolute z-10 inset-0 justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {eventList.length === 0 ? (
            <Empty description="Không có dữ liệu sự kiện" />
          ) : (
            <div>
              <Row gutter={16} className={` ${loading ? "opacity-50" : ""}`}>
                {eventList?.map((item: EventCardType) => {
                  return (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                      <EventCard
                        eventObject={item}
                        showOption={status === 2 ? true : false}
                      />
                    </Col>
                  );
                })}
              </Row>
              <Pagination
                className="mt-8"
                align="center"
                current={PageNumber}
                total={totalPage}
                pageSize={8}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrganizationEvents;
