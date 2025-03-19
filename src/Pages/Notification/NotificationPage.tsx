import { useEffect, useState } from "react";
import { NotiType } from "../../model/Noti/NotiType";
import api from "../../apiService/useFetch";
import { ConfigProvider, Pagination } from "antd";
import { RiEmotionSadLine } from "react-icons/ri";
import Loading from "../Components/Loading";

const pageSize = 10;
const NotificationPage = () => {
  const [notiList, setNotiList] = useState<NotiType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
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
  return (
    <div className="container mx-auto w-3/5">
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
            className="bg-white w-full border-2 border-primary-color rounded-lg my-4 py-2 px-4 hover:scale-105 transition-all cursor-pointer hover:shadow-2xl"
          >
            <div>{item.content}</div>
            <div>Thời gian: {new Date(item.time).toLocaleString("sv-SE")}</div>
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
