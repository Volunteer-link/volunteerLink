import { useEffect, useRef, useState } from "react";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import api from "../../apiService/useFetch";
import { data } from "react-router-dom";
import EventCard from "../Components/EventCard";
import { ConfigProvider, Empty, Pagination } from "antd";
import Loading from "../Components/Loading";
import LineSpacing from "../Components/LineSpacing";

const DonativeEvents = () => {
  const pageSize = 8;
  const [listEventCard, setListEventCard] = useState<EventCardType[]>();
  const [total, setTotal] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const refSearch = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCommonEvent = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/common/get-event-donate?SearchName=${searchValue}&PageNumber=${currentPage}&PageSize=${pageSize}`
        );
        console.log(data);

        setListEventCard(data.data.items);
        setTotal(data.data.totalItems);
      } catch (e: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommonEvent();
  }, [currentPage, searchValue]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleClickSearch = () => {
    setSearchValue(refSearch?.current!.value);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClickSearch();
    }
  };

  return (
    <div>
      {isLoading && <Loading color="green" />}
      <div>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fclose-up-people-volunteer-teamwork-join-hands-togetherstack-handsunity-teamwork-volunteering-conceptual_640221-318.jpg?alt=media&token=ebf4583e-7abc-46c0-83bd-1558a3d67c64"
          className="w-full h-72 object-cover mb-8"
          alt=""
        />
      </div>
      <LineSpacing />
      <div className="items-center gap-1 justify-center text-2xl flex mb-8 font-medium">
        <div>Sự kiện có thể</div>
        <div className="text-primary-color">ủng hộ</div>
      </div>
      <div className="my-4">
        <div className="flex items-center justify-center gap-2">
          <div className="lg:w-[36rem] w-4/5 bg-white border-2 border-primary-color rounded-full flex items-center justify-between">
            <input
              ref={refSearch}
              type="text"
              placeholder="Tìm kiếm theo tên sự kiện..."
              className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
              onKeyDown={handleKeyDown}
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
      </div>
      <div>
        <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
          {listEventCard?.map((item, index) => (
            <EventCard key={item.id} eventObject={item} showOption={false} />
          ))}
        </div>
        {listEventCard?.length === 0 && (
          <Empty description="Không có dữ liệu sự kiện" />
        )}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: "#3BA769",
              colorPrimary: "white",
              colorPrimaryHover: "white",
              colorPrimaryBorder: "white",
            },
          },
        }}
      >
        {listEventCard?.length !== 0 && (
          <div className=" mb-8">
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={total}
              pageSize={pageSize}
              className=""
              onChange={handleChangePage}
            />
          </div>
        )}
      </ConfigProvider>
    </div>
  );
};

export default DonativeEvents;
