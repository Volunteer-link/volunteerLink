import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import api from "../../apiService/useFetch";
import { Col, Empty, Pagination, Row, Spin } from "antd";
import EventCard from "../Components/EventCard";

const ListEventsOrganization = ({
  organizationId,
}: {
  organizationId: number | undefined;
}) => {
  const { id } = useParams();
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const [eventList, setEventList] = useState<EventCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = React.useState<number>();
  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/common/get-events-of-organization`, {
          params: {
            OrganizationId: organizationId,
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
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };
  return (
    <div className="container relative mx-auto px-4 py-8">
      {loading && (
        <div className="flex absolute z-10 inset-0 justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      )}

      {eventList.length === 0 ? (
        <Empty />
      ) : (
        <div>
          <Row gutter={16} className={` ${loading ? "opacity-50" : ""}`}>
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

export default ListEventsOrganization;
