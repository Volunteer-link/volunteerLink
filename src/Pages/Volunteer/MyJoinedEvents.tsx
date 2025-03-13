import { useState } from "react";
import EventCard from "../Components/EventCard";
import { ConfigProvider, Pagination, Tooltip } from "antd";
import { RiInformation2Fill } from "react-icons/ri";

const MyJoinedEvents = () => {
  const [currentType, setCurrentType] = useState<string>("ongoing");

  const handleChangeType = (value: string) => {
    setCurrentType(value);
  };
  console.log(currentType);

  return (
    <div className="container mx-auto lg:mt-8 mt-16 px-12 lg:ml-auto">
      <div className="flex items-center gap-2">
        <div className="inline-block my-2 font-medium text-lg text-primary-color before:w-full before:h-[0.125rem] before:absolute relative before:-bottom-2 before:bg-primary-color">
          Sự kiện bạn đã tham gia
        </div>
        <Tooltip title="*Lưu ý: Bạn chỉ có thể rời sự kiện trước ngày diễn ra 1 ngày">
          <span>
            <RiInformation2Fill className="text-primary-color text-lg " />
          </span>
        </Tooltip>
      </div>
      <div className="lg:w-[36rem] my-10 w-4/5 mx-auto bg-white rounded-full border-2 border-stone-400 flex items-center justify-between">
        <input
          type="text"
          placeholder="Tên sự kiện..."
          className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
        />
        <div className="flex pr-2 items-center gap-4 ">
          <div className="bg-primary-color text-white lg:px-4 text-nowrap px-8 py-2 lg:py-2 text-xs lg:text-sm rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all">
            Tìm kiếm
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div
            onClick={() => handleChangeType("ongoing")}
            className={`text-center font-medium text-sm lg:text-lg py-4 cursor-pointer ${
              currentType === "ongoing"
                ? ` bg-primary-color text-white rounded-t-2xl`
                : `border-b-2 border-primary-color text-primary-color rounded-t-2xl hover:bg-stone-100 hover:text-xl transition-all`
            }`}
          >
            Đang diễn ra
          </div>
          <div
            onClick={() => handleChangeType("upgoing")}
            className={`text-center font-medium text-sm lg:text-lg py-4 cursor-pointer ${
              currentType === "upgoing"
                ? ` bg-primary-color text-white rounded-t-2xl`
                : `border-b-2 border-primary-color text-primary-color rounded-t-2xl hover:bg-stone-100 hover:text-xl transition-all`
            }`}
          >
            Sắp diễn ra
          </div>
          <div
            onClick={() => handleChangeType("past")}
            className={`text-center font-medium text-sm lg:text-lg py-4 cursor-pointer ${
              currentType === "past"
                ? ` bg-primary-color text-white rounded-t-2xl`
                : `border-b-2 border-primary-color text-primary-color rounded-t-2xl hover:bg-stone-100 hover:text-xl transition-all`
            }`}
          >
            Đã diễn ra
          </div>
        </div>
        <div className="lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
          {/* <EventCard
            eventObject={{
              id: 1,
              title: "Mặt trời của em",
              organization: "Tổ chức abc",
              date: "May, 20",
              candidate: 100,
              location: "Ha Noi",
              url: "/materials/image 7.png",
            }}
            showOption={true}
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
            showOption={true}
          /> */}
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#3BA769",
              headerColor: "white",
            },
            Pagination: {
              itemActiveBg: "#3BA769",
              colorPrimary: "white",
              colorPrimaryHover: "white",
              colorPrimaryBorder: "white",
            },
          },
        }}
      >
        <Pagination
          defaultCurrent={1}
          // current={pageNumber}
          total={10}
          pageSize={5}
          // onChange={handlePaging}
          className="my-8"
        />
      </ConfigProvider>
    </div>
  );
};

export default MyJoinedEvents;
