import React, { useCallback, useEffect, useState } from 'react';
import EventCard from '../Components/EventCard';
import {
  Col,
  ConfigProvider,
  Empty,
  Pagination,
  Row,
  Spin,
  Tabs,
  Tooltip,
} from 'antd';
import { RiInformation2Fill } from 'react-icons/ri';
import api from '../../apiService/useFetch';
import { TabsProps } from 'antd/lib';
import { useNavigate } from 'react-router-dom';
import { EventCardType } from '../../model/ShowEventModel/EventCardType';

const MyJoinedEvents = () => {
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const [eventList, setEventList] = useState<EventCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number>(0);
  const [totalPage, setTotalPage] = React.useState<number>();
  const navigate = useNavigate();
  const onChange = (key: string) => {
    setStatus(parseInt(key));
  };

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: 'Đang diễn ra',
    },
    {
      key: '1',
      label: 'Đã diễn ra',
    },
    {
      key: '-1',
      label: 'Chưa bắt đầu',
    },
    {
      key: '2',
      label: 'Chưa xuất bản',
    },
  ];

  const fetchField = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/profile/volunteer-joined-event`, {
        params: {
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
  }, [PageNumber, status]);

  useEffect(() => {
    fetchField();
  }, [PageNumber, status]);
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  return (
    <div className="container mx-auto lg:mt-8 mt-16 px-12 lg:ml-auto">
      <div className="flex items-center gap-2 mb-10">
        <div className="inline-block my-2 font-medium text-lg text-primary-color before:w-full before:h-[0.125rem] before:absolute relative before:-bottom-2 before:bg-primary-color">
          Sự kiện bạn đã tham gia
        </div>
        <Tooltip title="*Lưu ý: Bạn chỉ có thể rời sự kiện trước ngày diễn ra 1 ngày">
          <span>
            <RiInformation2Fill className="text-primary-color text-lg " />
          </span>
        </Tooltip>
      </div>
      <div className="flex justify-between items-start">
        <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
      </div>
      <>
        {loading ? (
          <div className="flex absolute z-10 inset-0 justify-center items-center min-h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {eventList.length === 0 ? (
              <Empty />
            ) : (
              <div>
                <Row gutter={16} className={` ${loading ? 'opacity-50' : ''}`}>
                  {eventList.map((item: EventCardType) => {
                    return (
                      <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                        <EventCard eventObject={item} showOption={true} />
                      </Col>
                    );
                  })}
                </Row>
                <Pagination
                  className="mt-8"
                  align="center"
                  current={PageNumber}
                  total={totalPage}
                  pageSize={9}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default MyJoinedEvents;
