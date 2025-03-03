import { IoLocation } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EventCard: React.FC<{
  eventObject: {
    id: number;
    title: string;
    organization: string;
    date: string;
    candidate: number;
    location: string;
    url: string;
  };
}> = ({ eventObject }) => {
  const navigate = useNavigate();

  const handleClickEventCart = () => {
    navigate("/detail-event/6969");
  };
  return (
    <div onClick={handleClickEventCart}>
      <div className="cursor-pointer hover:scale-[1.02] transition-all">
        <div className="py-4 bg-primary-color rounded-t-xl">
          <img
            src={eventObject.url}
            className="w-full h-[11.25rem] object-cover"
            alt=""
          />
        </div>
        <div className="border-2 border-primary-color bg-white rounded-b-xl py-2 px-4">
          <div className="my-2 text-base font-medium">{eventObject.title}</div>
          <div className="text-xs">
            <div className="my-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <HiUsers className="text-sm" />
                <div>{eventObject.organization}</div>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-sm" />
                <div>{eventObject.date}</div>
              </div>
            </div>
            <div className="my-2 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <div className="text-sm">{eventObject.candidate}</div>
                <div>thành viên</div>
              </div>
              <div className="flex items-center gap-1">
                <IoLocation className="text-sm" />
                <div>{eventObject.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
