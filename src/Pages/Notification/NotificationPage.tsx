import { useContext, useEffect, useState } from "react";
import { NotiType } from "../../model/Noti/NotiType";
import api, { setupInterceptors } from "../../apiService/useFetch";
import { ConfigProvider, Pagination } from "antd";
import { RiEmotionSadLine } from "react-icons/ri";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";
import ErrorCards from "../Components/ErrorCards";
import WebsocketContext from "../../ultils/WebsocketContext";

const pageSize = 10;
const NotificationPage = () => {
  const [notiList, setNotiList] = useState<NotiType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
          const object = JSON.parse(event.data);
          console.log(object);

          const newNoti = {
            accountId: object.LatestNotification.AccountId,
            content: object.LatestNotification.Content,
            id: object.LatestNotification.Id,
            time: object.LatestNotification.Time,
            type: object.LatestNotification.Type,
            urlId: object.LatestNotification.UrlId,
            urlImage: object.UrlImage,
          };
          console.log(newNoti);
          const newArr = [newNoti, ...notiList];
          setNotiList(newArr);
        }
        // console.log(JSON.parse(event.data));
      });
    }
  }, [socket]);

  console.log(notiList);

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
        console.log(data);

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
    if (item.type === 0) {
      item.urlId = item.urlId.split(",")[0];
    }
    if (item.type === 0 || item.type === 5) {
      navigate(`/detail-event/${item.urlId}`, { state: { from: "noti" } });
    }
  };
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
      {[...notiList]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleClickNoti(item)}
            className="bg-white w-full border-2 border-primary-color rounded-lg my-4 py-2 px-4 hover:scale-105 transition-all cursor-pointer hover:shadow-2xl flex items-center justify-between"
          >
            <div className="lg:max-w-96 max-w-52">
              <div className="">{item.content}</div>
              <div>
                Thời gian: {new Date(item.time).toLocaleString("sv-SE")}
              </div>
            </div>
            {(item.type === 0 || item.type === 8) && (
              <div className="bg-primary-color w-16 h-16 rounded-full overflow-hidden">
                <img src={item.urlImage} alt="" />
              </div>
            )}
            {(item.type === 4 || item.type === 5) && (
              <div className="bg-primary-color w-32 h-16">
                <img
                  className="w-full h-full object-contain"
                  src={item.urlImage}
                  alt=""
                  onError={(e) =>
                    (e.currentTarget.src = "/materials/placeholder-image.jpg")
                  }
                />
              </div>
            )}
          </div>
        ))}

      {notiList.length === 0 && (
        <div className="text-primary-color flex items-center justify-center gap-1">
          <span>Bạn chưa có thông báo nào</span>{" "}
          <RiEmotionSadLine className="text-xl" />
        </div>
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
