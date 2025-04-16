import { IoLocation } from 'react-icons/io5';
import { HiUsers } from 'react-icons/hi2';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SlOptions } from 'react-icons/sl';
import { Dropdown, MenuProps, message } from 'antd';
import { EventCardType } from '../../model/ShowEventModel/EventCardType';
import { useState } from 'react';
import Loading from './Loading';
import SmallLoading from './SmallLoading';
import { RxEnter } from 'react-icons/rx';
import dayjs from 'dayjs';
import api from '../../apiService/useFetch';

const EventCard: React.FC<{
  eventObject: EventCardType;
  showOption: boolean;
}> = ({ eventObject, showOption }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const items: MenuProps['items'] = [
    {
      label: (
        <div onClick={(e) => handleClickMenuItem(e)}>Cập nhật sự kiện</div>
      ),
      key: '0',
    },
    {
      label: dayjs().isAfter(dayjs(eventObject.timePublish)) ? null : (
        <div onClick={(e) => handleRemoveEventCard(e)}>Xoá sự kiện</div>
      ),
      key: '1',
    },
  ];

  const handleRemoveEventCard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data } = await api.delete(
        `event/remove-an-event??EventId=${eventObject.id}`
      );
      setShowRemove(true);
    } catch (error: any) {
      if (error.status == 400)
        messageApi.error(`${error.response.data.Message}`);
    }
  };

  const handleClickEventCard = (id: number) => {
    // navigate(`/detail-event/${id}`);
    window.open(`/detail-event/${id}`, '_blank');
  };

  const handleClickOption = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClickMenuItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/update-event/${eventObject.id}`);
  };

  if (showRemove) {
    return null;
  }
  return (
    <div
      onClick={() => handleClickEventCard(eventObject.id)}
      className="select-none"
    >
      <div className="relative cursor-pointer group hover:scale-[1.02] transition-all">
        {showOption && (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
            getPopupContainer={(trigger) =>
              trigger.parentElement || document.body
            }
          >
            <div
              onClick={handleClickOption}
              className="absolute right-2 top-2 z-20 bg-primary-color rounded-full p-1"
            >
              <SlOptions className="text-lg text-white hover:cursor-pointer cursor-pointer scale-105" />
            </div>
          </Dropdown>
        )}

        {/* Image wrapper with overlay */}
        <div className="relative rounded-t-xl mt-4 overflow-hidden py-4 bg-primary-color">
          {isLoading && <SmallLoading size="large" />}
          {/* Ảnh */}
          <img
            src={eventObject.thumbnail}
            className="w-full h-[11.25rem] object-cover"
            alt=""
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={(e) =>
              (e.currentTarget.src = '/materials/placeholder-image.jpg')
            }
          />

          {/* Overlay mờ xuất hiện khi hover toàn thẻ */}
          <div className="absolute inset-0 flex items-center justify-center bg-primary-color opacity-0 group-hover:opacity-60 transition-all duration-300 z-10 pointer-events-none">
            <RxEnter className="text-[44px] text-white" />
          </div>
        </div>

        <div className="border-2 border-primary-color bg-white rounded-b-xl py-2 px-4">
          {/* phần nội dung bên dưới */}
          <div className="my-2 text-base font-medium max-w-full truncate">
            {eventObject.name}
          </div>
          <div className="text-xs">
            <div className="my-2 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-1">
                <HiUsers className="text-sm" />
                <div className="truncate max-w-28">
                  {eventObject.organizationName}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-sm" />
                <div className="truncate max-w-28">
                  {new Date(eventObject.startTime).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <div className="my-2 flex flex-wrap items-center justify-between">
              <div className="flex items-baseline gap-1 truncate max-w-32">
                <div className="text-xs font-medium">
                  {eventObject.numberVolunteer}
                </div>
                <div>thành viên</div>
              </div>
              <div className="flex items-center gap-1">
                <IoLocation className="text-sm" />
                <div className="truncate max-w-32">{eventObject.address}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
