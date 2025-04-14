import { IoFilter, IoLocation } from "react-icons/io5";
import EventCard from "../Components/EventCard";
import LineSpacing from "../Components/LineSpacing";
import { useEffect, useRef, useState } from "react";
import {
  ConfigProvider,
  Empty,
  Modal,
  Pagination,
  Select,
  Switch,
  Tabs,
  Tooltip,
} from "antd";
import api from "../../apiService/useFetch";
import { Field } from "../../model/ShowEventModel/Field";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import { RiEmotionSadLine } from "react-icons/ri";
import Loading from "../Components/Loading";
import { decodedCookie, getCookie } from "../../ultils/cookie";
import MapBox from "../Components/MapBox";
import { MarkerPosition } from "../../model/MapBoxModel/MarkerPosition";
import useWebSocket from "../../Hook/useWebSocket";
import { WiStars } from "react-icons/wi";
import { TabsProps } from "antd/lib";
import { BsFilterLeft } from "react-icons/bs";
import { HiLightBulb } from "react-icons/hi2";
const pageSize: number = 8;
const ShowEvent = () => {
  const [listField, setListField] = useState<Field[]>();
  const [currentField, setCurrentField] = useState<string[]>([]);
  const [checkSearch, setCheckSearch] = useState<boolean>(false);

  const [listEventCard, setListEventCard] = useState<EventCardType[]>();
  const [listEventCardRelevant, setListEventCardRelevant] =
    useState<EventCardType[]>();
  const [listEventCardSearch, setListEventCardSearch] =
    useState<EventCardType[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(1);
  const [currentPageRelevant, setCurrentPageRelevant] = useState<number>(1);
  const [address, setAddress] = useState<string>("");

  const [total, setTotal] = useState<number>(0);
  const [marker, setMarker] = useState<MarkerPosition | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");

  const [totalSearch, setTotalSearch] = useState<number>(0);
  const [totalRelevant, setTotalRelevant] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRelevent, setShowRelevent] = useState(false);

  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [AISearch, setAISearch] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const refSearch = useRef<HTMLInputElement>(null);

  const user = decodedCookie(getCookie("accessToken"));
  const { messages, sendMessage, isConnected } = useWebSocket({
    url: "wss://dev.api.volunteer-link.site/ws/",
  });
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
    const fetchAddress = async () => {
      const data = await api.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${marker?.latitude}&lon=${marker?.longitude}&format=json`
      );
      setAddress(data.data.display_name);
    };

    if (marker?.latitude && marker?.longitude) {
      fetchAddress();
    }
  }, [marker]);

  useEffect(() => {
    const fetchCommonEvent = async () => {
      try {
        const str = currentField.join(",");
        const url = `/common/get-events?${
          currentField.length !== 0 ? `Fields=${str}` : ""
        }&PageNumber=${currentPage}&PageSize=${pageSize}&Status=${status}`;

        const { data } = await api.get(url);
        setListEventCard(data.data.items);
        setTotal(data.data.totalItems);
      } catch (e: any) {
      } finally {
      }
    };
    fetchCommonEvent();
  }, [currentField, currentPage, status]);

  useEffect(() => {
    if (user?.role === "Volunteer" && isPublish) {
      setShowRelevent(true);
    }
  }, [isPublish]);

  useEffect(() => {
    const fetchRelevant = async () => {
      try {
        const { data } = await api.get(
          `/ai/relevant-event?PageNumber=${currentPageRelevant}&PageSize=${pageSize}`
        );

        setListEventCardRelevant(data.data.items);
        setTotalRelevant(data.data.totalItems);
      } catch (e: any) {
        console.log(e);
      }
    };
    if (showRelevent) {
      fetchRelevant();
    }
  }, [currentPageRelevant, showRelevent]);

  useEffect(() => {
    const fetchCheckPublish = async () => {
      try {
        const { data } = await api.get("/profile/check-publish-profile");
        setIsPublish(data.data.success);
      } catch (e: any) {}
    };
    if (user && user?.role !== "Admin") {
      fetchCheckPublish();
    }
  }, [user]);

  // useEffect(() => {
  //   const checkSearchFunc = () => {
  //     setCheckSearch(true);
  //   };

  //   if (refSearch.current?.value !== "") {
  //     checkSearchFunc();
  //   }
  // }, [refSearch.current?.value]);

  const fetchSearch = async (page?: number) => {
    const pageNumber = page ?? 1;
    const location = `${marker?.latitude};${marker?.longitude}`;
    console.log(searchKey);

    try {
      if (!AISearch) {
        const url = `/common/get-events?PageNumber=${pageNumber}&PageSize=${pageSize}${
          searchKey ? `&SearchKey=${searchKey}` : ""
        }${marker ? `&Location=${location}` : ""}`;

        const { data } = await api.get(url);

        setTotalSearch(data.data.totalItems);
        setListEventCardSearch(data.data.items);
      }
      if (AISearch && searchKey) {
        const url = `/ai/advanced-search-event?PageNumber=${pageNumber}&PageSize=${pageSize}${
          searchKey ? `&SearchKey=${searchKey}` : ""
        }`;

        const { data } = await api.get(url);
        console.log(data);

        setTotalSearch(data.data.totalItems);
        setListEventCardSearch(data.data.items);
      }
    } catch (e: any) {
    } finally {
    }
  };

  const handleChangeField = (value: string[]) => {
    setCurrentField(value);
    setCurrentPage(1);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangePageSearch = (page: number) => {
    fetchSearch(page);
    // setSearchKey(refSearch.current!.value);
    setCurrentPageSearch(page);
  };
  const handleChangePageRelevant = (page: number) => {
    // fetchSearch(page);
    // setSearchKey(refSearch.current!.value);
    setCurrentPageRelevant(page);
  };

  const handleClickSearch = () => {
    setCheckSearch(true);
    setCurrentPage(1);
    setCurrentPageSearch(1);
    fetchSearch();
  };

  const handleChangeInput = () => {
    setSearchKey(refSearch.current!.value);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClickSearch();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onChangeSwitchAIMode = (checked: boolean) => {
    setAISearch(checked);
  };

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "Đang diễn ra",
    },
    {
      key: "-1",
      label: "Sắp diễn ra",
    },
  ];

  const onChange = (key: string) => {
    setStatus(parseInt(key));
    setCurrentPage(1);
  };

  return (
    <div className="">
      {/* {isLoading && <Loading />} */}
      <Modal
        maskClosable={true}
        footer={null}
        onCancel={handleClose}
        title="Chọn địa điểm"
        centered
        open={isModalOpen}
      >
        <MapBox marker={marker} setMarker={setMarker} />
      </Modal>

      <div className="w-full relative">
        <img
          src="https://img.freepik.com/free-photo/group-teenagers-bedroom-putting-their-hands-together-community-temwork-concept_53876-30659.jpg?t=st=1744620404~exp=1744624004~hmac=a0b09aa686038e1fec5ef07c4acbce0b6ff6eec89d55531872a8b88dc1f4472c&w=1380"
          alt=""
          className="w-full lg:scale-110 mb-8 h-80 object-cover"
        />
        {/* Search */}
        <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="w-full rounded-full flex items-center bg-white shadow-custom-green justify-between">
            <input
              ref={refSearch}
              type="text"
              placeholder="Tìm kiếm theo tên sự kiện..."
              className="w-2/3 outline-none py-4 px-8 rounded-full relative text-base"
              onKeyDown={handleEnterKey}
              onChange={handleChangeInput}
            />
            <div className="flex pr-2 items-center gap-8 select-none">
              {!AISearch && (
                <Tooltip open={!!address} title={address} color={"#3BA769"}>
                  <div className="flex gap-2 items-center">
                    <IoLocation
                      onClick={showModal}
                      className="text-3xl text-primary-color cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
                    />
                    <span className="font-medium text-primary-color">
                      Địa điểm
                    </span>
                  </div>
                </Tooltip>
              )}

              <div
                onClick={handleClickSearch}
                className="bg-primary-color text-white lg:px-10 text-nowrap px-8 py-2 lg:py-2 lg:text-base rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all font-medium"
              >
                Tìm kiếm
              </div>
            </div>
          </div>
          {user?.role === "Volunteer" && (
            <div className="bg-white rounded-full py-3 px-5 flex items-center gap-3 shadow-custom-green">
              {/* <img src="/materials/AI.png" className="w-6 h-6 mb-1" alt="" /> */}
              <span className="text-nowrap">
                <span className="font-medium">Tìm kiếm </span>
                <span className="font-medium text-primary-color text-xl">
                  {" "}
                  AI
                </span>
                <span>:</span>
              </span>
              <Switch defaultChecked={false} onChange={onChangeSwitchAIMode} />
            </div>
          )}
        </div>
        {/* Search */}
      </div>
      {user?.role === "Volunteer" && (
        <div>
          <div className="flex items-center gap-2 bg-green-200 px-2 py-1 rounded-full text-primary-color border-[1px] border-primary-color">
            <HiLightBulb />
            <div>
              <span className="font-medium">Gợi ý:</span> Bạn có thể tìm kiếm
              thông minh với chế độ "Tìm kiếm AI"
            </div>
          </div>
        </div>
      )}

      {checkSearch && (
        <>
          <div className="">
            <div className="lg:col-span-2 mt-2 col-span-7">
              <div className="inline-block mr-1 text-sm">Kết quả:</div>
              <div className="inline-block text-base font-medium text-primary-color">
                {totalSearch} sự kiện
              </div>
            </div>
          </div>
          {totalSearch === 0 && (
            <Empty description="Không có dữ liệu sự kiện" />
          )}
          {totalSearch !== 0 && (
            <>
              <div className="">
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
                  <div className=" mb-8">
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
      {showRelevent && (
        <>
          <div className="items-center gap-1 text-lg flex justify-center my-6 font-medium">
            <div>Sự kiện</div>
            <div className="text-primary-color">gợi ý</div>{" "}
            <span> cho bạn</span>
            <div className="w-[2px] bg-stone-400 h-8 mx-1"></div>
            <div>
              <img
                src="/materials/VTLAI_blackbrain_transparentbg.png"
                className="w-40 select-none"
                alt=""
              />
            </div>
          </div>
          <div className="">
            {listEventCardRelevant?.length === 0 && (
              <Empty
                className="mx-auto"
                description="Không có sự kiện được gợi ý"
              />
            )}
            <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
              {listEventCardRelevant?.map((item, index) => (
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
            {listEventCardRelevant?.length !== 0 && (
              <div className=" mb-8">
                <Pagination
                  defaultCurrent={1}
                  current={currentPageRelevant}
                  total={totalRelevant}
                  pageSize={pageSize}
                  className=""
                  onChange={handleChangePageRelevant}
                />
              </div>
            )}
          </ConfigProvider>
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
      <div className="">
        <div className="lg:col-span-6 flex items-center gap-1 py-2">
          <BsFilterLeft className="text-primary-color font-bold text-2xl" />
          <div className="text-primary-color font-medium">Lĩnh vực:</div>
          <div>
            <Select
              mode="tags"
              // defaultValue="Tất cả các lĩnh vực"
              placeholder="Tất cả lĩnh vực"
              style={{ minWidth: 200 }}
              onChange={handleChangeField}
              options={[
                // { value: 0, label: "Tất cả các lĩnh vực" },
                ...(listField || []).map(({ id, name }) => ({
                  value: id.toString(),
                  label: name,
                })),
              ]}
            />
          </div>
        </div>
        <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
        {listEventCard?.length === 0 && (
          <Empty description="Không có dữ liệu sự kiện" />
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
        <div className="w-full lg:col-span-6 col-span-1 gap-4 grid md:grid-cols-2 lg:grid-cols-4 mb-4">
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

export default ShowEvent;
