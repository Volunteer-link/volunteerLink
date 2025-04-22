import {
  Breadcrumb,
  ConfigProvider,
  Empty,
  message,
  Modal,
  Pagination,
  Rate,
} from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { decodedCookie, getCookie } from "../../ultils/cookie";
import { FiUsers } from "react-icons/fi";
import { FaCalendarAlt, FaHandshake, FaStar, FaUsers } from "react-icons/fa";
import { FaLocationDot, FaXmark } from "react-icons/fa6";
import { FaDotCircle } from "react-icons/fa";
import MySlider from "../../Common/MySlider";
import { FaCheck } from "react-icons/fa6";
import type { TextAreaRef } from "antd/es/input/TextArea";
import { useContext, useEffect, useRef, useState } from "react";
import api from "../../apiService/useFetch";
import { EventCardType } from "../../model/ShowEventModel/EventCardType";
import Loading from "../Components/Loading";
import { DetailEventType } from "../../model/ShowEventModel/DetailEventType";
import { TbTilde } from "react-icons/tb";
import WebsocketContext from "../../ultils/WebsocketContext";
import { IoIosSend, IoIosWarning } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CiStar } from "react-icons/ci";
import { RatingType } from "../../model/ShowEventModel/RatingType";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { HiLightBulb } from "react-icons/hi2";
// const { TextArea } = Input;
const DetailEvent = () => {
  const location = useLocation();
  const dataStateNoti = location.state;

  const navigate = useNavigate();
  const [stateModalJoin, setStateModalJoin] = useState<boolean>(false);
  const [stateModalDonation, setStateModalDonation] = useState<boolean>(false);
  const [stateModalRate, setStateModalRate] = useState<boolean>(false);
  const [valueRating, setValueRating] = useState<number>(0);
  const [idRequest, setIdRequest] = useState<number>(0);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusEvent, setStatusEvent] = useState<number>(-1);
  const [dataState, setDataState] = useState<DetailEventType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [OpenModalSummary, setOpenModalSummary] = useState<boolean>(false);
  const [isRated, setIsRated] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [fromTitle, setFromTitle] = useState<string>("");
  const [expireRequest, setExpireRequest] = useState<boolean>(false);

  const [listRating, setListRating] = useState<RatingType[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRating, setTotalRating] = useState<number>(0);
  const [resetKey, setResetKey] = useState<number>(0);
  const pageSize = 2;

  const textAreaRef = useRef<any>(null);

  const { id } = useParams();

  const token = getCookie("accessToken");
  const user = decodedCookie(token);
  const [summaryValue, setSummaryValue] = useState("");
  useEffect(() => {
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
        // console.log(data);

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
      setExpireRequest(data.data.isOverdue);
      setIdRequest(data.data.id);
      setStatusEvent(data.data.status);
    } catch (e: any) {}
  };

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
    setRatingValue(value);
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
      if (
        e.response.data.Message ===
        "Event has to start after 0.5 day to join this event or this event has not been published"
      ) {
        messageApi.error(
          "Không thể xử lý lời mời vì sự kiện còn chưa đầy 12 tiếng nữa sẽ diễn ra!"
        );
      }
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
      console.log(e);
      if (
        e.response.data.Message ===
        "Event will start after 1 day or this event has not been published. Can't leave event"
      ) {
        messageApi.error(
          "Không thể rời vì sự kiện còn chưa đầy 24 tiếng nữa sẽ diễn ra!"
        );
      }
      setIsLoading(false);
    } finally {
      setStateModalJoin(false);
      if (user?.role === "Volunteer") {
        fetchStatus();
      }
    }
  };

  const handleVolRateEvent = async () => {
    if (ratingValue === 0) {
      messageApi.error("Vui lòng đánh giá số sao trước khi gửi nhận xét!");
    } else {
      try {
        setIsLoading(true);
        const comment =
          textAreaRef.current?.resizableTextArea?.textArea.value || "";
        const { data } = await api.post(
          `/feedback/feedback-event-of-volunteer`,
          {
            eventId: id,
            star: ratingValue,
            feedback: comment,
          }
        );
        messageApi.success("Bạn đã đánh giá sự kiện thành công!");
        setIsLoading(false);
        setStateModalRate(false);
        setResetKey((prev) => ++prev);
      } catch (e: any) {
        if (e.response.data.Message === "Feedback time is over") {
          messageApi.error("Quá hạn đánh giá sự kiện!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSummaryOpen = () => {
    setSummaryValue(dataState?.summary?.content || "");
    setOpenModalSummary(true);
  };

  const handleSummaryCancel = (e: any) => {
    e.stopPropagation();
    setOpenModalSummary(false);
  };

  const handleCreateSummary = async () => {
    const value = summaryValue;
    if (!value || value.trim() === "") {
      messageApi.warning("Tổng kết sự kiện không được để trống!");
      return;
    }
    try {
      if (dataState?.summary) {
        await api.put("/report/get-reports-of-event", {
          reportId: dataState?.summary.id,
          content: value,
        });
        messageApi.success("Cập nhật tổng kết sự kiện thành công");
      } else {
        await api.post("/report/create-report-of-event", {
          eventId: id,
          content: value,
        });
        messageApi.success("Thêm tổng kết sự kiện thành công");
      }
      setOpenModalSummary(false);
    } catch (err: any) {
      if (err.status == 400) messageApi.error(`${err.response.data.Message}`);
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data } = await api.get(
          `/feedback/get-feedback-of-event?EventId=${id}&PageNumber=${currentPage}&PageSize=${pageSize}`
        );

        setTotalRating(data.data.totalItems);
        setListRating(data.data.items);
      } catch (error: any) {
      } finally {
      }
    };

    if (dataState?.endTime && new Date() > new Date(dataState?.endTime)) {
      fetchRating();
    }
  }, [dataState, resetKey]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleShowProfile = (accountId: number) => {
    window.open(`/volunteerProfile/${accountId}`);
  };

  useEffect(() => {
    const checkRated = async () => {
      try {
        const { data } = await api.get(
          `/feedback/check-rated-event?eventId=${id}`
        );
        // console.log(data);
        setIsRated(data.data.rated);
      } catch (error: any) {
      } finally {
      }
    };
    if (user?.role === "Volunteer") {
      checkRated();
    }
  }, [resetKey]);

  const handleClickAttendance = () => {
    window.open(`/event/attendance/${id}`, "_blank");
    // navigate(`/event/attendance/${id}`);
  };

  const [amount, setAmount] = useState<number>(10000);

  const handleChangeDonation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(value);
  };

  const handleOkDonation = async () => {
    if (amount >= 10000) {
      try {
        setIsLoading(true);
        const { data } = await api.post(`/donate/create-donate-url-vnpay`, {
          eventId: id,
          moneyToPay: amount,
        });
        console.log(data);
        window.location.href = data.data.url.toString();
      } catch (e: any) {
      } finally {
        setIsLoading(false);
      }
    } else {
      messageApi.error("Số tiền phải nằm trong khoảng 5.000 - 1.000.000 VNĐ");
    }
  };

  const handleChange = (value: string) => {
    setSummaryValue((value) => value); // cập nhật state, để ReactQuill nhận giá trị mới
  };

  return (
    <div>
      {contextHolder}
      {isLoading && <Loading color="white" />}
      <>
        {user?.role === "Volunteer" && (
          <div className="flex items-center gap-2 bg-green-200 px-2 py-1 rounded-full text-primary-color border-[1px] border-primary-color">
            <HiLightBulb />
            <div>
              <span className="font-medium">Ghi chú:</span> Bạn chỉ có thể gửi
              yêu cầu tham gia trước khi sự kiện bắt đầu 1 ngày
            </div>
          </div>
        )}
        {user?.role === "Organization" && (
          <div className="flex items-center gap-2 bg-green-200 px-2 py-1 rounded-full text-primary-color border-[1px] border-primary-color">
            <HiLightBulb />
            <div>
              <span className="font-medium">Ghi chú:</span> Bạn chỉ có thể mời
              tình nguyện viên tham gia trước khi sự kiện bắt đầu 1 ngày
            </div>
          </div>
        )}
        {user?.role === "Volunteer" && expireRequest && statusEvent === 3 && (
          <div className="mt-2 flex items-center gap-2 bg-yellow-200 px-2 py-1 rounded-full text-yellow-600 border-[1px] border-yellow-500">
            <IoIosWarning />
            <div>
              <span className="font-medium">Lời nhắc:</span> Yêu cầu tham gia sự
              kiện này của bạn không được xử lý
            </div>
          </div>
        )}
        <div className="grid grid-cols-8">
          {/* <div></div> */}
          <div className="col-span-8">
            <div className="lg:flex lg:items-center lg:justify-between lg:my-6 mt-20 mb-6">
              {/* {fromTitle && (
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
            )} */}
              {/* {!fromTitle && ( */}
              <div className="">
                <div className="inline-block font-medium">Sự kiện</div>
                <div className="text-primary-color text-lg font-medium w-96 ">
                  {dataState?.name || "Tên sự kiện"}
                </div>
              </div>
              {/* )} */}

              {/* Organization sight */}
              {user?.role === "Organization" &&
                new Date() > new Date(dataState?.timePublish || 0) &&
                new Date() < new Date(dataState?.startTime || 0) && //chưa bắt đầu
                Number(user?.AccId) === dataState?.orgAccountId && (
                  <div className="lg:flex lg:gap-2">
                    <div
                      onClick={handleViewSentRequest}
                      className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center gap-1 justify-center"
                    >
                      <IoIosSend />
                      Danh sách lời mời đã gửi
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
                      <FaUsers />
                      Danh sách tình nguyện viên
                    </div>
                  </div>
                )}
              {user?.role === "Organization" &&
                new Date() < new Date(dataState?.timePublish || 0) &&
                new Date() < new Date(dataState?.startTime || 0) && //chưa bắt đầu
                Number(user?.AccId) === dataState?.orgAccountId && (
                  <div className="lg:flex lg:gap-2">
                    Thời gian xuất bản:{" "}
                    <span className="text-primary-color">
                      {dataState?.timePublish
                        ? `${new Date(dataState.timePublish).getFullYear()}-${(
                            new Date(dataState.timePublish).getMonth() + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${new Date(dataState.timePublish)
                            .getDate()
                            .toString()
                            .padStart(2, "0")} ${new Date(dataState.timePublish)
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${new Date(dataState.timePublish)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}:${new Date(dataState.timePublish)
                            .getSeconds()
                            .toString()
                            .padStart(2, "0")}`
                        : ""}
                    </span>
                  </div>
                )}
              {user?.role === "Organization" &&
                new Date() > new Date(dataState?.endTime || 0) && //đã kết thúc
                Number(user?.AccId) === dataState?.orgAccountId && (
                  <div className="lg:flex lg:gap-2">
                    <div
                      className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center justify-center"
                      onClick={handleSummaryOpen}
                    >
                      {dataState.summary
                        ? "Cập nhật tổng kết sự kiện"
                        : "Viết tổng kết sự kiện"}
                      <Modal
                        title={
                          dataState.summary
                            ? "Cập nhật tổng kết sự kiện"
                            : "Tạo tổng kết sự kiện"
                        }
                        open={OpenModalSummary}
                        onOk={handleCreateSummary}
                        onCancel={handleSummaryCancel}
                      >
                        <ReactQuill
                          theme="snow"
                          value={summaryValue}
                          onChange={handleChange}
                          placeholder="Tổng kết sự kiện..."
                          style={{ height: 250 }}
                        />
                      </Modal>
                    </div>
                    <div
                      onClick={handleClickAttendance}
                      className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-white rounded-xl text-primary-color border-2 border-primary-color font-medium lg:w-auto w-full my-1 flex items-center justify-center"
                    >
                      Điểm danh tình nguyện viên
                    </div>
                  </div>
                )}

              {user?.role === "Volunteer" &&
                new Date(dataState?.endTime || 0) < new Date() && (
                  <div className="lg:flex lg:gap-2">
                    <div
                      className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center justify-center"
                      onClick={handleSummaryOpen}
                    >
                      Xem tổng kết sự kiện
                      <Modal
                        title="Tổng kết sự kiện"
                        open={OpenModalSummary}
                        onCancel={handleSummaryCancel}
                        footer={() => null}
                      >
                        <p
                          dangerouslySetInnerHTML={{ __html: summaryValue }}
                        ></p>
                      </Modal>
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
                user?.role !== "Organization" && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="text-primary-color inline-block py-2 px-12 rounded-full font-medium">
                      Sự kiện chưa diễn ra...
                    </div>
                  </div>
                )}
              {user?.role !== "Organization" &&
                dataState?.startTime &&
                dataState?.endTime &&
                new Date() >= new Date(dataState?.startTime) &&
                new Date() <= new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="text-primary-color inline-block py-2 px-12 rounded-full font-medium">
                      Sự kiện đang diễn ra
                    </div>
                  </div>
                )}
              {user?.role !== "Organization" &&
                dataState?.endTime &&
                new Date() > new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="text-primary-color inline-block py-2 px-12 rounded-full font-medium">
                      Sự kiện đã kết thúc
                    </div>
                  </div>
                )}
              {user?.role !== "Volunteer" &&
                dataState?.endTime &&
                new Date() > new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="text-primary-color inline-block py-2 px-12 rounded-full font-medium">
                      Sự kiện đã kết thúc
                    </div>
                  </div>
                )}
              {/* Organization sight */}
              {/* Volunteer event end */}
              {user?.role === "Volunteer" &&
                statusEvent === 1 && //có join
                dataState?.endTime && //hết sự kiện
                !isRated &&
                new Date() > new Date(dataState?.endTime) && (
                  <div className="lg:col-span-3 lg:flex lg:items-center lg:justify-end lg:mb-0 px-4">
                    <div className="flex items-center gap-1 font-medium lg:pb-0 pb-4">
                      <div
                        onClick={handleOpenRate}
                        className="text-xs lg:text-sm bg-primary-color px-6 py-2 rounded-full text-white hover:cursor-pointer hover:lg:scale-105 hover:lg:opacity-95 duration-300"
                      >
                        Đánh giá sự kiện
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className="w-full mb-10">
              <img
                src={dataState?.thumbnail}
                alt=""
                className="w-full lg:h-96 h-20 object-cover bg-primary-color"
                onLoad={() => setIsLoading(false)}
                onError={(e) =>
                  (e.currentTarget.src = "/materials/placeholder-image.jpg")
                }
              />
              <div className="w-full lg:grid lg:grid-cols-10 bg-primary-color">
                <div className=""></div>
                <div className="text-white lg:col-span-4 lg:py-8 py-4 lg:px-0 px-4">
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
                {/* {user?.role === "Volunteer" &&
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
                    className="lg:col-span-4 lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0"
                    onClick={handleJoinRequest}
                  >
                    <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium lg:hover:opacity-95 lg:hover:scale-105 duration-300 cursor-pointer">
                      Tham gia sự kiện
                    </div>
                  </div>
                )} */}
                {/* Volunteer sight */}

                {/* {statusEvent === 3 && (
                <div
                  onClick={handleCancelRequest}
                  className="lg:col-span-4 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0"
                >
                  <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium cursor-pointer">
                    Đã gửi yêu cầu...
                  </div>
                </div>
              )} */}

                {/* {dataState?.startTime &&
                new Date() < new Date(dataState?.startTime) &&
                user?.role === "Organization" &&
                user?.role === "Volunteer" && (
                  <div className="lg:col-span-3 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                    <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium opacity-65">
                      Sự kiện chưa diễn ra
                    </div>
                  </div>
                )} */}
                {dataState?.startTime &&
                  user?.role === "Organization" &&
                  new Date() < new Date(dataState?.startTime) &&
                  user?.role === "Organization" && (
                    <div className="lg:col-span-4 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                      <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium opacity-65">
                        Sự kiện chưa diễn ra
                      </div>
                    </div>
                  )}

                {dataState?.startTime &&
                  user?.role === "Organization" &&
                  dataState?.endTime &&
                  new Date() >= new Date(dataState?.startTime) &&
                  new Date() <= new Date(dataState?.endTime) && (
                    <div className="lg:col-span-4 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                      <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium opacity-65">
                        Sự kiện đang diễn ra
                      </div>
                    </div>
                  )}

                {dataState?.endTime &&
                  user?.role === "Organization" &&
                  new Date() >= new Date(dataState?.endTime) && (
                    <div className="lg:col-span-4 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0">
                      <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium opacity-65">
                        Sự kiện đã kết thúc
                      </div>
                    </div>
                  )}

                {/* Volunteer already sign */}
                <div className="lg:col-span-4 px-4 flex lg:items-center lg:justify-end mb-6 lg:mb-0 pb-6 lg:pb-0 gap-4">
                  {user?.role === "Volunteer" &&
                    statusEvent === 1 &&
                    dataState?.startTime &&
                    new Date() <= new Date(dataState?.startTime) && (
                      <div
                        onClick={handleOpenJoin}
                        className="text-xs lg:text-sm flex items-center gap-1 border-2 px-6 py-2 rounded-full text-white font-medium hover:cursor-pointer hover:lg:bg-white hover:lg:scale-105 hover:lg:text-primary-color duration-300"
                      >
                        <div>Đã tham gia</div>
                        <FaCheck />
                      </div>
                    )}
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
                        className="lg:col-span-4 lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0"
                        onClick={handleJoinRequest}
                      >
                        <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium lg:hover:opacity-95 lg:hover:scale-105 duration-300 cursor-pointer">
                          Yêu cầu tham gia sự kiện
                        </div>
                      </div>
                    )}
                  {statusEvent === 3 &&
                    new Date() <
                      new Date(
                        new Date(dataState?.startTime || "").getTime() -
                          12 * 60 * 60 * 1000
                      ) && (
                      <div
                        onClick={handleCancelRequest}
                        className="lg:col-span-4 select-none lg:pb-0 pb-6 flex lg:items-center justify-center lg:justify-end lg:mb-0"
                      >
                        <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium cursor-pointer">
                          Đã gửi yêu cầu...
                        </div>
                      </div>
                    )}
                  {dataState?.hasDonate &&
                    user?.role !== "Organization" &&
                    user?.role !== "Admin" &&
                    new Date() < new Date(dataState.startTime) && (
                      <div className="flex items-center gap-1 font-medium">
                        <div
                          onClick={handleOpenDonation}
                          className="text-xs lg:text-sm bg-white px-6 py-2 rounded-full text-primary-color hover:cursor-pointer hover:lg:scale-105 hover:lg:opacity-95 duration-300"
                        >
                          Ủng hộ
                        </div>
                      </div>
                    )}
                </div>

                {/* {dataState?.hasDonate && !user?.role && (
                <div className="lg:col-span-4 px-4 flex lg:items-center lg:justify-end mb-6 lg:mb-0 pb-6 lg:pb-0 gap-4">
                  <div className="flex items-center gap-1 font-medium">
                    <div
                      onClick={handleOpenDonation}
                      className="text-xs lg:text-sm bg-white px-6 py-2 rounded-full text-primary-color hover:cursor-pointer hover:lg:scale-105 hover:lg:opacity-95 duration-300"
                    >
                      Quyên góp
                    </div>
                  </div>
                </div>
              )} */}

                {/* Volunteer already sign */}

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
                        {dataState?.fields?.map((item, index) => (
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
                          <div className=" text-base font-medium">
                            Thời gian
                          </div>
                        </div>
                        <div>
                          <div>
                            {new Date(
                              dataState?.startTime || new Date()
                            ).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false, // 24h format, bỏ nếu mày thích AM/PM
                            })}
                            <TbTilde className="inline-block mx-2" />
                            {new Date(
                              dataState?.endTime || new Date()
                            ).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })}
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
          {/* <div></div> */}
        </div>
        {dataState?.endTime && //hết sự kiện
          new Date() > new Date(dataState?.endTime) && (
            <div className="grid grid-cols-8">
              <div></div>
              <div className="col-span-8">
                <div className="flex items-center gap-1 mb-4">
                  <span className="text-xl text-primary-color font-medium">
                    Đánh giá sự kiện
                  </span>
                  <FaStar className="text-2xl text-primary-color" />
                </div>
                {listRating.length !== 0 && (
                  <div className="rounded-md border-2 border-primary-color p-4 mb-4">
                    {listRating?.map((item, index) => (
                      <div
                        key={index}
                        className={`p-2 flex items-start gap-4 select-none ${
                          index !== listRating.length - 1 ? "mb-6" : ""
                        } `}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={item.pictureImage}
                            className="w-full h-full object-contain"
                            alt=""
                          />
                        </div>
                        <div className="flex-1">
                          <div
                            onClick={() => handleShowProfile(item.accountId)}
                            className="font-medium cursor-pointer hover:opacity-80"
                          >
                            {item.volunteerName}
                          </div>
                          <div>
                            <ConfigProvider
                              theme={{
                                components: {
                                  Rate: {
                                    starSize: 14,
                                  },
                                },
                              }}
                            >
                              <Rate disabled value={item.star} />
                            </ConfigProvider>
                          </div>
                          <div className="mb-2">{item.feedback}</div>
                          <div className="text-stone-500">
                            {new Date(item.time).toLocaleString("en-US", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {listRating.length === 0 && (
                  <div className="mb-8">
                    <Empty description="Sự kiện này chưa có đánh giá" />
                  </div>
                )}
              </div>
              <div></div>
            </div>
          )}
        {/* <ConfigProvider
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
              current={currentPageRelevant}
              total={totalRelevant}
              pageSize={pageSize}
              className=""
              onChange={handleChangePageRelevant}
            />
          </div>
        )}
      </ConfigProvider> */}
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
          <div className="grid grid-cols-8">
            <div></div>
            <div className="col-span-6">
              {listRating.length !== 0 && (
                <Pagination
                  current={currentPage}
                  total={totalRating}
                  pageSize={pageSize}
                  onChange={handleChangePage}
                  className="mb-4"
                />
              )}
            </div>
            <div></div>
          </div>
          <Modal
            title="Thông báo"
            open={stateModalJoin}
            onOk={handleOkLeave}
            onCancel={handleCloseJoin}
          >
            <p>Bạn có chắc muốn hủy tham gia sự kiện không?</p>
            <p>
              Nếu muốn tham gia sự kiện, bạn sẽ phải gửi lại yêu cầu tham gia
            </p>
          </Modal>

          <Modal
            title="Ủng hộ cho sự kiện"
            open={stateModalDonation}
            onCancel={handleCloseDonation}
            onOk={handleOkDonation}
          >
            <Input
              placeholder="Nhập số tiền ủng hộ..."
              type="number"
              value={amount}
              onChange={handleChangeDonation}
              min={10000}
            />
            <div>
              Tối thiểu: 10.000{" "}
              <span className="text-primary-color font-medium">VND</span>
            </div>
          </Modal>

          <Modal
            title="Đánh giá sự kiện"
            open={stateModalRate}
            onOk={handleVolRateEvent}
            onCancel={handleCloseRate}
            okText="Đánh giá sự kiện"
          >
            <div className="flex items-center gap-2 my-4">
              <span>Đánh giá: </span>
              <Rate onChange={handleRating} />
            </div>
            <div className="flex items-start gap-2 mb-8">
              <span>Nhận xét: </span>
              <TextArea
                className="w-96"
                size="small"
                maxLength={1000}
                placeholder="Bình luận tối đa 1000 kí tự"
                showCount
                ref={textAreaRef}
              />
            </div>
          </Modal>
        </ConfigProvider>
      </>
    </div>
  );
};
export default DetailEvent;
