import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import ErrorCards from "../Components/ErrorCards";
import { Breadcrumb, ConfigProvider, Empty, message, Pagination } from "antd";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import SmallLoading from "../Components/SmallLoading";
import api from "../../apiService/useFetch";

const ListSentRequest = () => {
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errCode, setErrCode] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);
  const [listInvitation, setListInvitation] = useState<
    {
      accountId: number;
      address: string;
      dateOfBirth: Date | string;
      eventName: string;
      inviteId: number;
      pictureProfile: string;
      time: Date | string;
      volunteerName: string;
    }[]
  >([]);
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.get(`/event/check-owner?eventId=${id}`);
        setStatus(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatus();
  });

  const fetchInvite = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/event/participated-invites?EventId=${id}&PageNumber=${currentPage}&PageSize=${pageSize}`
      );
      console.log(data);
      setListInvitation(data.data.items);
      setTotal(data.data.totalItems);
    } catch (e: any) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (status) {
      fetchInvite();
    }
  }, [currentPage]);
  console.log(listInvitation);

  const handleChangePageSearch = (page: number) => {
    setCurrentPage(page);
  };

  const handleClickInvitation = (id: number) => {
    window.open(`/volunteerProfile/${id}`, "_blank");
  };

  const handleCancelInvitation = async (inviteId: number) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/event/cancle-invite`, {
        inviteId: inviteId,
      });
      messageApi.success("Lời mời đã được xóa!");

      setTimeout(() => {
        fetchInvite();
        setIsLoading(false);
        setCurrentPage(1);
      }, 1000);
    } catch (e: any) {
      messageApi.error(e.response.data.Message);
      setTimeout(() => {
        fetchInvite();
        setIsLoading(false);
        setCurrentPage(1);
      }, 1000);
    } finally {
    }
  };
  return (
    <div className="px-32 py-8">
      {isLoading && <Loading color="green" />}
      {contextHolder}
      <ErrorCards errCode={errCode} />
      <Breadcrumb
        className=""
        items={[
          {
            title: <NavLink to={"/"}>Trang chủ</NavLink>,
          },
          {
            title: (
              <NavLink to={`/detail-event/${id}`}>
                {location.state?.nameEvent}
              </NavLink>
            ),
          },
          {
            title: (
              <div className="">
                <span>Danh sách lời mời đã gửi</span>
              </div>
            ),
          },
        ]}
      />
      <div className="lg:px-0 lg:w-3/4 mx-auto">
        <div className="">
          {listInvitation?.map((item, index) => (
            <div
              key={index + new Date().toString()}
              onClick={() => handleClickInvitation(item.accountId)}
              className="bg-white w-full border-2 border-primary-color rounded-lg my-4 py-3 px-4 hover:scale-105 transition-all cursor-pointer hover:shadow-2xl flex items-center justify-between"
            >
              <div className="lg:max-w-96 max-w-72">
                <div className="">
                  <span>
                    <span>
                      Bạn đã mời{" "}
                      <span className="text-primary-color font-medium">
                        {item.volunteerName}
                      </span>{" "}
                      tham gia sự kiện
                    </span>{" "}
                    <span className="text-primary-color font-medium">
                      {item.eventName}
                    </span>
                    <span className="text-primary-color font-medium"></span>
                  </span>
                </div>
                <div>
                  Thời gian: {new Date(item.time).toLocaleString("sv-SE")}
                </div>
                <div>
                  Trạng thái:{" "}
                  <span className="text-primary-color font-medium">
                    Đang chờ xác nhận
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative">
                  {isLoadingImage && <SmallLoading size={"small"} />}
                  <img
                    className="w-full h-full object-contain"
                    src={item.pictureProfile}
                    alt=""
                    onLoad={() => setIsLoadingImage(false)}
                    onError={(e) =>
                      (e.currentTarget.src = "/materials/placeholder-image.jpg")
                    }
                  />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelInvitation(item.inviteId);
                  }}
                  className="bg-primary-color text-white px-4 py-1 rounded-md hover:scale-110 hover:opacity-90 transition-all "
                >
                  Xóa lời mời
                </div>
              </div>
            </div>
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
        {listInvitation?.length === 0 && (
          <Empty description="Không có lời mời" />
        )}
        {listInvitation?.length !== 0 && (
          <div className="flex justify-center mx-auto mb-8">
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={total}
              pageSize={pageSize}
              className="mt-4"
              onChange={handleChangePageSearch}
              showSizeChanger={false}
            />
          </div>
        )}
      </ConfigProvider>
    </div>
  );
};

export default ListSentRequest;
