import { useContext, useEffect, useState } from "react";
import { NotiType } from "../../model/Noti/NotiType";
import api, { setupInterceptors } from "../../apiService/useFetch";
import { ConfigProvider, Empty, Pagination } from "antd";
import { RiEmotionSadLine } from "react-icons/ri";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";
import ErrorCards from "../Components/ErrorCards";
import WebsocketContext from "../../ultils/WebsocketContext";
import SmallLoading from "../Components/SmallLoading";

const pageSize = 10;
const NotificationPage = () => {
  const [notiList, setNotiList] = useState<NotiType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [errCode, setErrCode] = useState<number>(0);
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);

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
          const dataArr = JSON.parse(event.data).LatestNotifications;

          const newArr = dataArr.map((item: any) => ({
            accountId: item.AccountId,
            content: item.Content,
            id: item.Id,
            time: item.Time,
            type: item.Type,
            urlId: item.UrlId,
            urlImage: item.UrlImage,
          }));

          setNotiList(newArr);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    setupInterceptors(setErrCode);
  }, []);
  useEffect(() => {
    const fetchNoti = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/common/get-notifications?PageNumber=${currentPage}&PageSize=${pageSize}`
        );

        setNotiList(data.data.items);
        setTotal(data.data.totalItems);
      } catch (e: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchNoti();
  }, [currentPage]);
  const handleChangePageSearch = (page: number) => {
    setCurrentPage(page);
  };

  const handleClickNoti = (item: NotiType) => {
    if (
      item.type === 0 ||
      item.type === 11 ||
      item.type === 12 ||
      item.type === 14
    ) {
      item.urlId = item.urlId.split(",")[0];
    }
    if (
      item.type === 0 ||
      item.type === 5 ||
      item.type === 1 ||
      item.type === 4 ||
      item.type === 7 ||
      item.type === 9 ||
      item.type === 11 ||
      item.type === 12 ||
      item.type === 14
    ) {
      navigate(`/detail-event/${item.urlId}`, { state: { from: "noti" } });
    }
    if (
      item.type === 2 ||
      item.type === 6 ||
      item.type === 3 ||
      item.type === 8
    ) {
      navigate(`/volunteerProfile/${item.urlId}`);
    }
    if (item.type === 10 || item.type === 13 || item.type === 15) {
      //show ra trang org chấm mình, mình là volunteer
    }
  };
  console.log(notiList);

  return (
    <div className="container mx-auto px-4 lg:px-0 lg:w-3/5">
      <ErrorCards errCode={errCode} />
      {isLoading && <Loading color="green" />}
      {/* {notiList.map((item, index) => (
        <div
          key={item.id}
          className="bg-white w-full border-2 border-primary-color rounded-lg my-4 py-2 px-4 hover:scale-105 transition-all cursor-pointer hover:shadow-2xl"
        >
          <div>{item.content}</div>
          <div>Thời gian: {new Date(item.time).toLocaleString("sv-SE")}</div>
        </div>
      ))} */}
      {notiList.map((item, index) => (
        <div
          key={item.id + new Date().toString()}
          onClick={() => handleClickNoti(item)}
          className="bg-white w-full border-2 border-primary-color rounded-lg my-4 py-2 px-4 hover:scale-105 transition-all cursor-pointer hover:shadow-2xl flex items-center justify-between"
        >
          <div className="lg:max-w-96 max-w-52">
            <div className="">{item.content}</div>
            <div>Thời gian: {new Date(item.time).toLocaleString("sv-SE")}</div>
          </div>
          {(item.type === 0 ||
            item.type === 8 ||
            item.type === 2 ||
            item.type === 6 ||
            item.type === 3 ||
            item.type === 11 ||
            item.type === 12 ||
            item.type === 14) && (
            <div className="bg-primary-color w-16 h-16 rounded-full overflow-hidden relative">
              {isLoadingImage && <SmallLoading size={"small"} />}

              <img
                src={item.urlImage}
                alt=""
                onLoad={() => setIsLoadingImage(false)}
                onError={(e) =>
                  (e.currentTarget.src =
                    "/materials/blank-profile-picture-973460_1280.png")
                }
              />
            </div>
          )}
          {(item.type === 4 ||
            item.type === 5 ||
            item.type === 1 ||
            item.type === 7 ||
            item.type === 9 ||
            item.type === 10 ||
            item.type === 13 ||
            item.type === 15) && (
            <div className="bg-primary-color w-32 h-16 relative">
              {isLoadingImage && <SmallLoading size={"small"} />}
              <img
                className="w-full h-full object-contain"
                src={item.urlImage}
                alt=""
                onLoad={() => setIsLoadingImage(false)}
                onError={(e) =>
                  (e.currentTarget.src = "/materials/placeholder-image.jpg")
                }
              />
            </div>
          )}
        </div>
      ))}

      {notiList.length === 0 && (
        <Empty className="mt-10" description="Không có dữ liệu" />
      )}
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
        {notiList?.length !== 0 && (
          <div className="container flex justify-center mx-auto px-12 mb-8">
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

export default NotificationPage;
