import { Breadcrumb, Empty, Input, Pagination } from 'antd';
import React, { useEffect } from 'react';
import Volunteer from '../../Components/Volunteer';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../apiService/useFetch';
import { SearchProps } from 'antd/es/input';

const { Search } = Input;

const EventParticipated = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageFromUrl = searchParams.get('page');
  const initialPage = pageFromUrl ? parseInt(pageFromUrl) : 1;

  const [event, setEvent] = React.useState<any>();
  const [listVolunteer, setListVolunteer] = React.useState<any[]>();
  const [searchName, setSearchName] = React.useState<string>('');
  const [PageNumber, setPageNumber] = React.useState<number>(initialPage);
  const [totalVolunteers, setTotalVolunteers] = React.useState<number>(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/common/get-event-infomation`, {
          params: { eventId: id },
        });
        setEvent(data.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const { data } = await api.get(`/event/participated-volunteers`, {
          params: { EventId: id, PageNumber: PageNumber, PageSize: 6 },
        });
        setListVolunteer(data.data.items || data.data);
        setTotalVolunteers(data.data.totalItems || data.data.length || 0);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchVolunteer();
  }, [PageNumber]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    navigate(`/participate-event/${id}?page=${page}`, { replace: true });
  };

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <div className="container mx-auto px-4 py-8">
      {!listVolunteer || listVolunteer.length === 0 ? (
        <Empty description="Không có dữ liệu" />
      ) : (
        <>
          <Breadcrumb
            items={[
              {
                title: 'Trang chủ',
              },
              {
                title: `${event?.name || 'Sự kiện'}`,
              },
              {
                title: 'Tình nguyện viên tham gia',
              },
            ]}
          />

          <div className="my-6 text-[#3BA769]">
            <h2 className="text-[30px] font-semibold">{event?.name}</h2>
            <p className="mt-3">{totalVolunteers} tình nguyện viên tham gia</p>
          </div>
          <div className="flex mb-6 justify-center items-center">
            <Search
              placeholder="Tên tình nguyện viên....."
              className="w-1/2"
              allowClear
              enterButton="Tìm kiếm"
              size="large"
              onSearch={onSearch}
            />
          </div>

          <div>
            {listVolunteer &&
              listVolunteer.map((volunteer, index) => (
                <Volunteer
                  key={volunteer.id || index}
                  volunteerDisplayType="REQUEST"
                />
              ))}
          </div>
          <Pagination
            className="mt-4"
            current={PageNumber}
            total={12}
            pageSize={6}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default EventParticipated;
