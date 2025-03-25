import { Breadcrumb, ConfigProvider, message, Modal, Rate } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { decodedCookie, getCookie } from "../../ultils/cookie";
import { FiUsers } from "react-icons/fi";
import { FaCalendarAlt, FaHandshake } from "react-icons/fa";
import { FaLocationDot, FaXmark } from "react-icons/fa6";
import { FaDotCircle } from "react-icons/fa";
import MySlider from "../../Common/MySlider";
import { FaCheck } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import api from "../../apiService/useFetch";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import Loading from "../Components/Loading";
import { DetailEventType } from "../../model/ShowEventModel/DetailEventType";
import { TbTilde } from "react-icons/tb";
import WebsocketContext from "../../ultils/WebsocketContext";
import { IoIosSend } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";

const DetailEvent = () => {
  const location = useLocation();
  const dataStateNoti = location.state;

  const navigate = useNavigate();
  const [stateModalJoin, setStateModalJoin] = useState<boolean>(false);
  const [stateModalDonation, setStateModalDonation] = useState<boolean>(false);
  const [stateModalRate, setStateModalRate] = useState<boolean>(false);
  const [valueRating, setValueRating] = useState<number>(0);
  const [idRequest, setIdRequest] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusEvent, setStatusEvent] = useState<number>(-1);
  const [dataState, setDataState] = useState<DetailEventType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [fromTitle, setFromTitle] = useState<string>("");

  const { id } = useParams();

  const token = getCookie("accessToken");
  const user = decodedCookie(token);

  const listItem = [
    "/materials/image 13d.png",
    "/materials/istockphodto-1426874794-612x612.jpg",
    "/materials/medium-shdot-volunteers-working-together_23-2149181985.jpg",
    "/materials/pixelcut-expdort.jpeg",
  ];
  useEffect(() => {
    // if (!dataStateNoti) {
    //   setFrom("/events");
    //   setFromTitle("Sự kiện");
    // }
    if (dataStateNoti?.from === "noti") {
      setFrom("/notification");
      setFromTitle("Thông báo");
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true);
        const { data } = await api.get(
          `/common/get-event-infomation?eventId=${id}`
        );

        setDataState(data.data);
      } catch (e: any) {
      } finally {
        // setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get(`/event/volunteer-status?eventId=${id}`);
      console.log(data);

      setIdRequest(data.data.id);
      setStatusEvent(data.data.status);
    } catch (e: any) {}
  };
  console.log(statusEvent);

  useEffect(() => {
    if (user?.role === "Volunteer") {
      fetchStatus();
    }
  }, []);

  const handleOpenJoin = () => {
    setStateModalJoin(true);
  };
  const handleCloseJoin = () => {
    setStateModalJoin(false);
  };
  const handleOpenDonation = () => {
    setStateModalDonation(true);
  };
  const handleCloseDonation = () => {
    setStateModalDonation(false);
  };
  const handleOpenRate = () => {
    setStateModalRate(true);
  };
  const handleCloseRate = () => {
    setStateModalRate(false);
  };
  const handleViewOrganization = (id: number) => {
    window.open(`/organizations/profile/${id}`, "_blank");
  };
  const handleRating = (value: number) => {
    console.log(value);
  };

  const socket = useContext(WebsocketContext);
  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", (event) => {
        const parsedData = JSON.parse(event.data);
        if (
          parsedData.Message === "New Notification" &&
          parsedData.message !== "Connected" &&
          socket.readyState === WebSocket.OPEN
        ) {
          if (user?.role === "Volunteer") {
            fetchStatus();
          }
        }
      });
    }
  }, [socket]);

  const handleJoinRequest = async () => {
    try {
      const { data } = await api.post(`/event/request-volunteer`, {
        eventId: id,
      });
    } catch (e: any) {
      // console.log(e);
    } finally {
      messageApi.success("Yêu cầu tham gia của bạn đã được gửi!");
      if (user?.role === "Volunteer") {
        fetchStatus();
      }
    }
  };

  const handleCancelRequest = async () => {
    try {
      const { data } = await api.post(`/event/cancle-request`, {
        requestId: idRequest,
      });
    } catch (e: any) {
      // console.log(e);
    } finally {
      messageApi.success("Bạn đã hủy yêu cầu tham gia sự kiện này!");
      if (user?.role === "Volunteer") {
        fetchStatus();
      }
    }
  };

  useEffect(() => {
    const fetchCheckPublish = async () => {
      try {
        const { data } = await api.get("/profile/check-publish-profile");
        setIsPublish(data.data.success);
      } catch (e: any) {}
    };
    if (user) {
      fetchCheckPublish();
    }
  }, [user]);

  const handleViewParticipationRequest = () => {
    navigate(`participation-request`, {
      state: { nameEvent: dataState?.name },
    });
  };

  const handleViewSuggestedVolunteers = () => {
    navigate(`volunteer-suggestion`);
  };

  const handleViewSentRequest = () => {
    navigate(`sent-invitation`, {
      state: { nameEvent: dataState?.name },
    });
  };

  const handleShowParticipated = () => {
    navigate(`/participate-event/${id}`);
  };

  const handleInvitation = async (value: string) => {
    try {
      const { data } = await api.post(`/event/handle-invite`, {
        inviteId: idRequest,
        accept: value === "yes" ? true : false,
      });
    } catch (e: any) {
    } finally {
      if (user?.role === "Volunteer") {
        fetchStatus();
      }
    }
  };

  const handleOkLeave = async () => {
    try {
      const { data } = await api.post(`/event/leave-event`, {
        idRecord: idRequest,
      });
      console.log(data);
    } catch (e: any) {
    } finally {
      setStateModalJoin(false);
      if (user?.role === "Volunteer") {
        fetchStatus();
      }
    }
  };

  return (
    <div>
      {contextHolder}
      {isLoading && <Loading color="white" />}
      <div className="grid grid-cols-8">
        <div></div>
        <div className="col-span-6 ">
          <div className="lg:flex lg:items-center lg:justify-between lg:my-6 mt-20 mb-6">
            {fromTitle && (
              <Breadcrumb
                className=""
                items={[
                  {
                    title: <NavLink to={from}>{fromTitle}</NavLink>,
                  },
                  {
                    title: (
                      <span className="text-primary-color font-medium">
                        {dataState?.name || "Tên sự kiện"}
                      </span>
                    ),
                  },
                ]}
              />
            )}
            {!fromTitle && (
              <div>
                Sự kiện:{" "}
                <span className="text-primary-color font-medium">
                  {dataState?.name || "Tên sự kiện"}
                </span>
              </div>
            )}

            {/* Organization sight */}
            {user?.role === "Organization" &&
              new Date() < new Date(dataState?.startTime || 0) && //chưa bắt đầu
              Number(user?.AccId) === dataState?.orgAccountId && (
                <div className="lg:flex lg:gap-2">
                  <div
                    onClick={handleViewSentRequest}
                    className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center gap-1 justify-center"
                  >
                    <IoIosSend />
                    Các lời mời đã gửi
                  </div>
                  <div
                    onClick={handleViewParticipationRequest}
                    className="flex cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 border-2 items-center justify-center gap-1 border-primary-color rounded-xl px-6 py-2 bg-white text-primary-color font-medium lg:w-auto w-full text-center my-1"
                  >
                    <FaHandshake />
                    Danh sách yêu cầu tham gia
                  </div>
                  <div
                    onClick={handleViewSuggestedVolunteers}
                    className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center gap-1 justify-center"
                  >
                    <AiFillLike />
                    Gợi ý tình nguyện viên
                  </div>
                </div>
              )}
            {user?.role === "Organization" &&
              new Date() > new Date(dataState?.endTime || 0) && //đã kết thúc
              Number(user?.AccId) === dataState?.orgAccountId && (
                <div className="lg:flex lg:gap-2">
                  <div className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center justify-center">
                    Viết tổng kết sự kiện
                  </div>
                </div>
              )}
            {user?.role === "Volunteer" &&
              statusEvent === 2 &&
              new Date() < new Date(dataState?.startTime || 0) && (
                <div className="lg:flex lg:gap-2">
                  <div
                    onClick={() => handleInvitation("yes")}
                    className="gap-2 cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center justify-center"
                  >
                    <span>Chấp nhận lời mời</span>
                    <FaCheck />
                  </div>
                  <div
                    onClick={() => handleInvitation("no")}
                    className="flex items-center justify-center gap-2 cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 border-2 border-primary-color rounded-xl px-6 py-2 bg-white text-primary-color font-medium lg:w-auto w-full text-center my-1"
                  >
                    <span>Từ chối lời mời</span>
                    <FaXmark />
                  </div>
                </div>
              )}
            {dataState?.startTime &&
              new Date() < new Date(dataState?.startTime) &&
              user?.role === "Volunteer" && (
                <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                  <div className="text-primary-color inline-block py-2 px-12 rounded-full font-medium">
                    Sự kiện chưa diễn ra...
                  </div>
                </div>
              )}
            {/* Organization sight */}
          </div>
          <div className="w-full mb-10">
            <img
              src={dataState?.thumbnail}
              alt=""
              className="w-full lg:h-60 h-20 object-cover bg-primary-color"
              onLoad={() => setIsLoading(false)}
              onError={(e) =>
                (e.currentTarget.src = "/materials/placeholder-image.jpg")
              }
            />
            <div className="w-full lg:grid lg:grid-cols-10 bg-primary-color">
              <div className=""></div>
              <div className="text-white lg:col-span-5 lg:py-8 py-4 lg:px-0 px-4">
                <div className="lg:flex items-center justify-between mb-4">
                  <div
                    onClick={() =>
                      handleViewOrganization(dataState?.orgAccountId || 0)
                    }
                    className="flex items-center gap-2 hover:lg:cursor-pointer hover:lg:scale-105 duration-300 hover:lg:opacity-95 mb-4 lg:mb-0"
                  >
                    <FiUsers />
                    <div className="lg:max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
                      {dataState?.organizationName}
                    </div>
                    <img
                      src={
                        !dataState?.organizationAvatar
                          ? "/materials/blank-profile-picture-973460_1280.png"
                          : dataState.organizationAvatar
                      }
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                  </div>
                </div>
                <div className="lg:flex items-center justify-between">
                  <div
                    onClick={handleShowParticipated}
                    className="lg:mb-0 mb-4 cursor-pointer hover:scale-105 transition-all"
                  >
                    {dataState?.numberVolunteer} người tham gia
                  </div>
                </div>
              </div>

              {/* {dataState?.startTime &&
                new Date() <
                  new Date(
                    new Date(dataState.startTime).getTime() -
                      24 * 60 * 60 * 1000
                  ) && <>chưa xảy ra</>}

              {dataState?.startTime &&
                dataState?.endTime &&
                new Date() >= new Date(dataState.startTime) &&
                new Date() <= new Date(dataState.endTime) && <>đang diễn ra</>}

              {dataState?.endTime &&
                new Date() > new Date(dataState.endTime) && <>đã xảy ra</>} */}

              {/* Volunteer sight */}
              {user?.role === "Volunteer" &&
                statusEvent === 0 &&
                dataState?.startTime &&
                new Date() <
                  new Date(
                    new Date(dataState.startTime).setDate(
                      new Date(dataState.startTime).getDate() - 1
                    ) //trước bắt đầu 1 ngày
                  ) &&
                isPublish && (
                  <div
                    className="lg:col-span-3 lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0"
                    onClick={handleJoinRequest}
                  >
                    <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium lg:hover:opacity-95 lg:hover:scale-105 duration-300 cursor-pointer">
                      Tham gia sự kiện
                    </div>
                  </div>
                )}
              {/* Volunteer sight */}

              {statusEvent === 3 && (
                <div
                  onClick={handleCancelRequest}
                  className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0"
                >
                  <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium cursor-pointer">
                    Đã gửi yêu cầu...
                  </div>
                </div>
              )}

              {dataState?.startTime &&
                new Date() < new Date(dataState?.startTime) &&
                user?.role === "Organization" && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium opacity-65">
                      Sự kiện chưa diễn ra
                    </div>
                  </div>
                )}

              {dataState?.startTime &&
                dataState?.endTime &&
                new Date() >= new Date(dataState?.startTime) &&
                new Date() <= new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium opacity-65">
                      Sự kiện đang diễn ra
                    </div>
                  </div>
                )}

              {dataState?.endTime &&
                new Date() >= new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium opacity-65">
                      Sự kiện đã kết thúc
                    </div>
                  </div>
                )}

              {/* Volunteer already sign */}
              {user?.role === "Volunteer" &&
                statusEvent === 1 &&
                dataState?.endTime &&
                new Date() <= new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 px-4 flex lg:items-center lg:justify-end mb-6 lg:mb-0 pb-6 lg:pb-0 gap-4">
                    <div
                      onClick={handleOpenJoin}
                      className="text-xs lg:text-sm flex items-center gap-1 border-2 px-6 py-2 rounded-full text-white font-medium hover:cursor-pointer hover:lg:bg-white hover:lg:scale-105 hover:lg:text-primary-color duration-300"
                    >
                      <div>Đã tham gia</div>
                      <FaCheck />
                    </div>

                    {dataState?.hasDonate && (
                      <div className="flex items-center gap-1 font-medium">
                        <div
                          onClick={handleOpenDonation}
                          className="text-xs lg:text-sm bg-white px-6 py-2 rounded-full text-primary-color hover:cursor-pointer hover:lg:scale-105 hover:lg:opacity-95 duration-300"
                        >
                          Quyên góp
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Volunteer already sign */}

              {/* Volunteer event end */}
              {user?.role === "Volunteer" &&
                dataState?.endTime &&
                new Date() > new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 lg:flex lg:items-center lg:justify-end lg:mb-0 px-4">
                    <div className="flex items-center gap-1 font-medium lg:pb-0 pb-4">
                      <div
                        onClick={handleOpenRate}
                        className="text-xs lg:text-sm bg-white px-6 py-2 rounded-full text-primary-color hover:cursor-pointer hover:lg:scale-105 hover:lg:opacity-95 duration-300"
                      >
                        Đánh giá sự kiện
                      </div>
                    </div>
                  </div>
                )}

              {/* Volunteer event end */}
              <div className=""></div>
            </div>
            <div className="bg-white border-x-2 border-b-2 border-primary-color rounded-b-md py-8 grid grid-cols-10">
              <div></div>
              <div className="col-span-8 ">
                <div className="lg:flex lg:justify-between">
                  <div className=" lg:flex-1 lg:pr-4 lg:relative lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-0 lg:after:w-[1.25px] lg:after:rounded-xl lg:after:h-full lg:after:bg-primary-color">
                    <div className="mb-10">
                      <div className="flex items-center gap-2 text-primary-color">
                        <FaDotCircle />
                        <div className=" text-base font-medium">Lĩnh vực</div>
                      </div>
                      {dataState?.fields.map((item, index) => (
                        <span
                          key={index}
                          className="italic text-primary-color mr-3"
                        >
                          #{item.name}
                        </span>
                      ))}
                    </div>
                    <div className="mb-10">
                      <div className="flex items-center gap-2 text-primary-color">
                        <FaDotCircle />
                        <div className=" text-base font-medium">
                          Mô tả sự kiện
                        </div>
                      </div>
                      <div>{dataState?.description}</div>
                    </div>
                  </div>
                  <div className="lg:flex-1 lg:pl-4">
                    <div className="mb-10">
                      <div className="flex items-center gap-2 text-primary-color">
                        <FaDotCircle />
                        <div className=" text-base font-medium">Thời gian</div>
                      </div>
                      <div>
                        <div>
                          {dataState?.startTime
                            ? `${new Date(
                                dataState.startTime
                              ).getFullYear()}-${(
                                new Date(dataState.startTime).getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}-${new Date(
                                dataState.startTime
                              )
                                .getDate()
                                .toString()
                                .padStart(2, "0")}`
                            : ""}
                          <TbTilde className="inline-block mx-2" />
                          {dataState?.endTime
                            ? `${new Date(dataState.endTime).getFullYear()}-${(
                                new Date(dataState.endTime).getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}-${new Date(dataState.endTime)
                                .getDate()
                                .toString()
                                .padStart(2, "0")}`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="mb-10">
                      <div className="flex items-center gap-2 text-primary-color">
                        <FaDotCircle />
                        <div className=" text-base font-medium">Địa điểm</div>
                      </div>
                      <div>
                        <div>{dataState?.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <div className="flex items-center gap-2 text-primary-color">
                    <FaDotCircle />
                    <div className=" text-base font-medium">
                      Một số hình ảnh
                    </div>
                  </div>
                </div>
                <MySlider
                  className="hidden lg:block"
                  // listItem={listItem}
                  listItem={dataState?.images}
                  size={"big"}
                />
                <MySlider
                  className="block lg:hidden"
                  listItem={dataState?.images}
                  size={"small"}
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <ConfigProvider>
        <Modal
          title="Thông báo"
          open={stateModalJoin}
          onOk={handleOkLeave}
          onCancel={handleCloseJoin}
        >
          <p>Bạn có chắc muốn hủy tham gia sự kiện không?</p>
          <p>Nếu muốn tham gia sự kiện, bạn sẽ phải gửi lại yêu cầu tham gia</p>
        </Modal>

        <Modal
          title="Quyên góp cho sự kiện"
          open={stateModalDonation}
          // onOk={handleOk}
          onCancel={handleCloseDonation}
        >
          <p>Bạn có chắc muốn hủy tham gia sự kiện không?</p>
        </Modal>

        <Modal
          title="Đánh giá sự kiện"
          open={stateModalRate}
          // onOk={handleOk}
          onCancel={handleCloseRate}
        >
          <Rate onChange={handleRating} />
        </Modal>
      </ConfigProvider>
    </div>
  );
};
export default DetailEvent;
