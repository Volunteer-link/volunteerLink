import { Col, Empty, Pagination, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { EventCardType } from '../../model/ShowEventModel/EventCardType';
import EventCard from '../Components/EventCard';
import api from '../../apiService/useFetch';

const VolunteerEvents = ({id} : { id: number | undefined}) => {
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const [eventList, setEventList] = useState<EventCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = React.useState<number>();
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };
  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/profile/volunteer-joined-event`, {
          params: {
            id: id,
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
    };
    fetchField();
  }, [PageNumber]);
  return (
    <div>
      {loading && (
        <div className="flex absolute z-10 inset-0 justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      )}

      {eventList.length === 0 ? (
        <Empty />
      ) : (
        <div>
          <Row gutter={16} className={` ${loading ? 'opacity-50' : ''}`}>
            {eventList.map((item: EventCardType) => {
              return (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <EventCard eventObject={item} showOption={false} />
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
            responsive
          />
        </div>
      )}
    </div>
  );
};

export default VolunteerEvents;
