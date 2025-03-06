import { IoLocation } from "react-icons/io5";
import EventCard from "../Components/EventCard";
import LineSpacing from "../Components/LineSpacing";
const ShowEvent = () => {
  return (
    <div className="">
      <div className="w-full relative">
        <img
          src="/materials/image 4.png"
          alt=""
          className="w-full lg:scale-110 mb-4 h-56 object-cover"
        />
        <div className="lg:w-[36rem] w-4/5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tên sự kiện..."
            className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
          />
          <div className="flex pr-2 items-center gap-4 ">
            <IoLocation className="text-2xl text-primary-color cursor-pointer hover:opacity-90 hover:scale-105 transition-all" />
            <div className="bg-primary-color text-white lg:px-4 text-nowrap px-8 py-2 lg:py-2 text-xs lg:text-sm rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all">
              Tìm kiếm
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-2">
        <div className="lg:col-span-2 col-span-7">
          <div className="inline-block mr-1 text-sm">Kết quả:</div>
          <div className="inline-block text-base font-medium text-primary-color">
            4 sự kiện
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
          <EventCard
            eventObject={{
              id: 1,
              title: "Mặt trời của em",
              organization: "Tổ chức abc",
              date: "May, 20",
              candidate: 100,
              location: "Ha Noi",
              url: "/materials/image 7.png",
            }}
            showOption={false}
          />
          <EventCard
            eventObject={{
              id: 2,
              title: "Đánh răng cho mòe",
              organization: "Tổ chức def",
              date: "May, 20",
              candidate: 50,
              location: "Ha Noi",
              url: "/materials/đánh răng.png",
            }}
            showOption={false}
          />
        </div>
      </div>
      <LineSpacing />
      <div className="items-center gap-1 justify-center text-2xl flex mb-8">
        <div>Sự kiện</div>
        <div className="text-primary-color">phù hợp</div>
      </div>
      <div className="container mx-auto px-4">
        <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
          <EventCard
            eventObject={{
              id: 1,

              title: "Mặt trời của em",
              organization: "Tổ chức abc",
              date: "May, 20",
              candidate: 100,
              location: "Ha Noi",
              url: "/materials/image 7.png",
            }}
            showOption={false}
          />
          <EventCard
            eventObject={{
              id: 2,

              title: "Đánh răng cho mòe",
              organization: "Tổ chức def",
              date: "May, 20",
              candidate: 50,
              location: "Ha Noi",
              url: "/materials/đánh răng.png",
            }}
            showOption={false}
          />
        </div>
      </div>
      <div className="w-full text-center mt-4">
        <div className="bg-primary-color my-2 inline-block py-3 px-16 text-white rounded-full hover:scale-105 transition-all cursor-pointer hover:opacity-95">
          Xem thêm
        </div>
      </div>
      <LineSpacing />
      {/* <div className="items-center gap-1 justify-center text-2xl flex mb-8">
        <div>Sự kiện</div>
        <div className="text-primary-color">đang diễn ra</div>
      </div> */}
      <div className="container mx-auto px-4">
        <div className="lg:col-span-6 flex items-center gap-1 py-2">
          <div className="text-primary-color font-medium">Lĩnh vực:</div>
          <div>
            <select className="outline-none" name="" id="">
              <option value="">Đẹp trai</option>
              <option value="">Đẹp zai</option>
              <option value="">Đẹpk jai</option>
            </select>
          </div>
        </div>
        <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
          <EventCard
            eventObject={{
              id: 2,
              title: "Mặt trời của em",
              organization: "Tổ chức abc",
              date: "May, 20",
              candidate: 100,
              location: "Ha Noi",
              url: "/materials/image 7.png",
            }}
            showOption={false}
          />
          <EventCard
            eventObject={{
              id: 2,
              title: "Đánh răng cho mòe",
              organization: "Tổ chức def",
              date: "May, 20",
              candidate: 50,
              location: "Ha Noi",
              url: "/materials/đánh răng.png",
            }}
            showOption={false}
          />
        </div>
      </div>
      <div className="w-full text-center mt-4">
        <div className="bg-primary-color my-2 inline-block py-3 px-16 text-white rounded-full hover:scale-105 transition-all cursor-pointer hover:opacity-95">
          Xem thêm
        </div>
      </div>
    </div>
  );
};

export default ShowEvent;
