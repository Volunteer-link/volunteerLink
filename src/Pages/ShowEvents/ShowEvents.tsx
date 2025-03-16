import { IoLocation } from "react-icons/io5";
import EventCard from "../Components/EventCard";
import LineSpacing from "../Components/LineSpacing";
import { useEffect, useRef, useState } from "react";
import { ConfigProvider, Pagination, Select } from "antd";
import api from "../../apiService/useFetch";
import { Field } from "../../model/ShowEventModel/Field";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import { RiEmotionSadLine } from "react-icons/ri";
import Loading from "../Components/Loading";
import { decodedCookie, getCookie } from "../../ultils/cookie";
const pageSize: number = 3;
const ShowEvent = () => {
  const [listField, setListField] = useState<Field[]>();
  const [currentField, setCurrentField] = useState<number>(0);
  const [checkSearch, setCheckSearch] = useState<boolean>(false);

  const [listEventCard, setListEventCard] = useState<EventCardType[]>();
  const [listEventCardSearch, setListEventCardSearch] =
    useState<EventCardType[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);

  const [total, setTotal] = useState<number>(0);

  const [totalSearch, setTotalSearch] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const refSearch = useRef<HTMLInputElement>(null);

  const user = decodedCookie(getCookie("accessToken"));

  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await api.get(`/common/get-fields`);
        setListField(data.data);
      } catch (e: any) {
      } finally {
      }
    };
    fetchField();
  }, []);

  useEffect(() => {
    const fetchCommonEvent = async () => {
      try {
        const { data } = await api.get(
          `/common/get-events?${
            currentField === 0 ? "" : `Fields=${currentField}&`
          }PageNumber=${currentPage}&PageSize=${pageSize}`
        );
        setListEventCard(data.data.items);
        setTotal(data.data.totalItems);
      } catch (e: any) {
      } finally {
      }
    };
    fetchCommonEvent();
  }, [currentField, currentPage]);

  useEffect(() => {
    const checkSearchFunc = () => {
      setCheckSearch(true);
    };

    if (refSearch.current?.value !== "") {
      checkSearchFunc();
    }
  }, [refSearch.current?.value]);
  const fetchSearch = async (value: string, page?: number) => {
    const pageNumber = page ?? 1;

    try {
      const { data } = await api.get(
        `/common/get-events?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchKey=${
          value ? value : ""
        }`
      );
      setTotalSearch(data.data.totalItems);
      setListEventCardSearch(data.data.items);
    } catch (e: any) {
    } finally {
    }
  };

  const handleChangeField = (value: string) => {
    setCurrentField(Number(value));
    setCurrentPage(1);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangePageSearch = (page: number) => {
    fetchSearch(refSearch.current!.value, page);
    setCurrentPageSearch(page);
  };

  const handleClickSearch = () => {
    if (refSearch.current!.value !== "") {
      fetchSearch(refSearch.current!.value);
      setCurrentPage(1);
      setCurrentPageSearch(1);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClickSearch();
    }
  };

  return (
    <div className="">
      {/* {isLoading && <Loading />} */}
      <div className="w-full relative">
        <img
          src="/materials/image 4.png"
          alt=""
          className="w-full lg:scale-110 mb-6 h-56 object-cover"
        />
        <div className="lg:w-[36rem] w-4/5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between">
          <input
            ref={refSearch}
            type="text"
            placeholder="Tên sự kiện..."
            className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
            onKeyDown={handleEnterKey}
          />
          <div className="flex pr-2 items-center gap-4 select-none">
            <IoLocation className="text-2xl text-primary-color cursor-pointer hover:opacity-90 hover:scale-105 transition-all" />
            <div
              onClick={handleClickSearch}
              className="bg-primary-color text-white lg:px-4 text-nowrap px-8 py-2 lg:py-2 text-xs lg:text-sm rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
            >
              Tìm kiếm
            </div>
          </div>
        </div>
      </div>
      {checkSearch && (
        <>
          <div className="container mx-auto px-12 py-2">
            <div className="lg:col-span-2 col-span-7">
              <div className="inline-block mr-1 text-sm">Kết quả:</div>
              <div className="inline-block text-base font-medium text-primary-color">
                {totalSearch} sự kiện
              </div>
            </div>
          </div>
          {totalSearch === 0 && (
            <div className="flex flex-col items-center text-primary-color select-none mb-8">
              <RiEmotionSadLine className="text-7xl opacity-70" />
              <div>Không có dữ liệu</div>
            </div>
          )}
          {totalSearch !== 0 && (
            <>
              <div className="container mx-auto px-12">
                <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
                  {listEventCardSearch?.map((item, index) => (
                    <EventCard
                      key={item.id}
                      eventObject={item}
                      showOption={false}
                    />
                  ))}
                </div>
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
                  <div className="container mx-auto px-12 mb-8">
                    <Pagination
                      defaultCurrent={1}
                      current={currentPageSearch}
                      total={totalSearch}
                      pageSize={pageSize}
                      className=""
                      onChange={handleChangePageSearch}
                    />
                  </div>
                )}
              </ConfigProvider>
              {/* <LineSpacing /> */}
            </>
          )}
          <LineSpacing />
        </>
      )}

      {/* <div className="items-center gap-1 justify-center text-2xl flex mb-8">
        <div>Sự kiện</div>
        <div className="text-primary-color">đang diễn ra</div>
      </div> */}
      {user && (
        <>
          <div className="items-center gap-1 justify-center text-2xl flex my-10">
            <div>Sự kiện</div>
            <div className="text-primary-color">phù hợp</div>
          </div>
          <div className="container mx-auto px-12">
            <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4"></div>
          </div>
          {/* <div className="w-full text-center mt-4">
            <div className="bg-primary-color my-2 inline-block py-3 px-16 text-white rounded-full hover:scale-105 transition-all cursor-pointer hover:opacity-95">
              Xem thêm
            </div>
          </div> */}
          <LineSpacing />
        </>
      )}
      {/* <div className="items-center gap-1 justify-center text-2xl flex my-10">
        <div>Sự kiện</div>
        <div className="text-primary-color">đang diễn ra</div>
      </div> */}
      <div className="container mx-auto px-12">
        <div className="lg:col-span-6 flex items-center gap-1 py-2">
          <div className="text-primary-color font-medium">Lĩnh vực:</div>
          <div>
            <Select
              defaultValue="Tất cả các lĩnh vực"
              style={{ width: 200 }}
              onChange={handleChangeField}
              options={[
                { value: 0, label: "Tất cả các lĩnh vực" },
                ...(listField || []).map(({ id, name }) => ({
                  value: id,
                  label: name,
                })),
              ]}
            />
          </div>
        </div>
        {listEventCard?.length === 0 && (
          <div className="flex flex-col items-center text-primary-color select-none mb-8">
            <RiEmotionSadLine className="text-7xl opacity-70" />
            <div>Không có dữ liệu</div>
          </div>
        )}
        {/* {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full lg:col-span-6 col-span-1 gap-10 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
            {listEventCard?.map((item, index) => (
              <EventCard key={index} eventObject={item} showOption={false} />
            ))}
          </div>
        )} */}
        <div className="w-full lg:col-span-6 col-span-1 gap-10 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
          {listEventCard?.map((item, index) => (
            <EventCard key={item.id} eventObject={item} showOption={false} />
          ))}
        </div>
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
          <div className="container mx-auto px-12 mb-8">
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

export default ShowEvent;
