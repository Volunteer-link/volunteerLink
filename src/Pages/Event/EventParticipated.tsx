import { Breadcrumb, Empty, Input, Pagination, Spin } from 'antd';
import React, { useCallback, useEffect } from 'react';
import Volunteer from '../../Components/Volunteer';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../apiService/useFetch';
import { SearchProps } from 'antd/es/input';
import { useDebounce } from '../../ultils/useDebounce';

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
  const searchDebounce = useDebounce<string>(searchName, 500);
  const [PageNumber, setPageNumber] = React.useState<number>(initialPage);
  const [totalVolunteers, setTotalVolunteers] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/common/get-event-infomation`, {
          params: { eventId: id },
        });
        console.log(data);

        setEvent(data.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchEvent();
  }, [id]);

  const fetchVolunteer = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/event/participated-volunteers`, {
        params: {
          EventId: id,
          SearchName: searchDebounce,
          PageNumber: PageNumber,
          PageSize: 6,
        },
      });
      setListVolunteer(data.data.items);
      setTotalVolunteers(data.data.totalItems);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);

      console.log(e);
    }
  }, [PageNumber, searchDebounce]);

  useEffect(() => {
    fetchVolunteer();
  }, [PageNumber, searchDebounce]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    navigate(`/participate-event/${id}?page=${page}`, { replace: true });
  };

  const handleClickSearch = () => {
    fetchVolunteer();
  };

  return (
    <div className="container relative mx-auto px-4 py-8">
      {loading && (
        <div className="flex absolute z-10 inset-0 justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      )}
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
        <div className="lg:w-[36rem] mb-8 w-full bg-white rounded-full border border-[#000000] flex items-center justify-between mx-auto">
          <input
            type="text"
            placeholder="Tên tình nguyện viên..."
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
      </div>

      <div>
        {!listVolunteer || listVolunteer.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          listVolunteer.map((volunteer, index) => (
            <Volunteer
              key={volunteer.id || index}
              objectVolunteer={{
                ...volunteer,
                volunteerDisplayType: 'PARTICIPATED',
              }}
            />
          ))
        )}
      </div>

      <Pagination
        className="mt-4"
        current={PageNumber}
        total={totalVolunteers}
        pageSize={6}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default EventParticipated;
