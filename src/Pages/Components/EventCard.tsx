import { IoLocation } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SlOptions } from "react-icons/sl";
import { Dropdown, MenuProps } from "antd";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import { useState } from "react";
import Loading from "./Loading";
import SmallLoading from "./SmallLoading";

const EventCard: React.FC<{
  eventObject: EventCardType;
  showOption: boolean;
}> = ({ eventObject, showOption }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const items: MenuProps["items"] = [
    {
      label: (
        <div onClick={(e) => handleClickMenuItem(e)}>Cập nhật sự kiện</div>
      ),
      key: "0",
    },
  ];

  const handleClickEventCard = (id: number) => {
    // navigate(`/detail-event/${id}`);
    window.open(`/detail-event/${id}`, "_blank");
  };

  const handleClickOption = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClickMenuItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/update-event/${eventObject.id}`);
  };

  return (
    <div
      onClick={() => handleClickEventCard(eventObject.id)}
      className="select-none"
    >
      <div className="cursor-pointer hover:scale-[1.02] transition-all relative">
        {showOption && (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            getPopupContainer={(trigger) =>
              trigger.parentElement || document.body
            }
          >
            <div
              onClick={handleClickOption}
              className="absolute right-2 top-2 z-10 bg-primary-color rounded-full p-1"
            >
              <SlOptions className="text-lg text-white hover:cursor-pointer cursor-pointer scale-105" />
            </div>
          </Dropdown>
        )}
        {/* <div
          className={`py-4 ${
            isLoading ? "opacity-50" : ""
          } bg-primary-color relative rounded-t-xl mt-4`}
        > */}
        <div
          className={`py-4 bg-primary-color relative rounded-t-xl mt-4 overflow-hidden`}
        >
          {isLoading && <SmallLoading size="large" />}
          <img
            src={eventObject.thumbnail}
            className={`w-full h-[11.25rem] object-cover`}
            alt=""
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={(e) =>
              (e.currentTarget.src = "/materials/placeholder-image.jpg")
            }
          />
        </div>
        <div className="border-2 border-primary-color bg-white rounded-b-xl py-2 px-4">
          <div className="my-2 text-base font-medium max-w-full truncate">
            {eventObject.name}
          </div>
          <div className="text-xs">
            <div className="my-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <HiUsers className="text-sm" />
                <div className="truncate max-w-32">
                  {eventObject.organizationName}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-sm" />
                <div className="truncate max-w-32">
                  {new Date(eventObject.startTime).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="my-2 flex items-center justify-between">
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
