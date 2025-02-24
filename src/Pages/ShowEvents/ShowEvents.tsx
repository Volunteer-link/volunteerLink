import { IoLocation } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { FaCalendarAlt } from "react-icons/fa";
import EventCard from "../Components/EventCard";
const ShowEvent = () => {
  return (
    <div>
      <div className="w-full relative">
        <img
          src="/materials/image 4.png"
          alt=""
          className="w-full lg:scale-110 mb-4 h-56 object-cover"
        />
        <div className="lg:w-[36rem] w-full bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tên sự kiện..."
            className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
          />
          <div className="flex pr-2 items-center gap-4 ">
            <IoLocation className="text-2xl text-primary-color cursor-pointer hover:opacity-90 hover:scale-105 transition-all" />
            <div className="bg-primary-color text-white px-4 py-2 text-sm rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all">
              Tìm kiếm
            </div>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-8 px-4">
        <div className="hidden lg:block"></div>
        <div className="lg:col-span-2 col-span-7 my-2 ">
          <div className="inline-block mr-1 text-sm">Kết quả:</div>
          <div className="inline-block text-base font-medium text-primary-color">
            4 sự kiện
          </div>
        </div>
      </div>
      <div className="w-full grid lg:grid-cols-8 grid-cols-1 px-4">
        <div></div>
        <div className="w-full bg-red-400 lg:col-span-6 col-span-1 gap-4 grid lg:grid-cols-4 mb-4">
          <EventCard
            eventObject={{
              title: "Mặt trời của em",
              organization: "Tổ chức abc",
              date: "May, 20",
              candidate: 100,
              location: "Ha Noi",
              url: "/materials/image 7.png",
            }}
          />
          <EventCard
            eventObject={{
              title: "Đánh răng cho mòe",
              organization: "Tổ chức def",
              date: "May, 20",
              candidate: 50,
              location: "Ha Noi",
              url: "/materials/đánh răng.png",
            }}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ShowEvent;
