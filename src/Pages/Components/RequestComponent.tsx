import { ConfigProvider, Empty, Pagination } from "antd";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import api from "../../apiService/useFetch";
import { RequestType } from "../../model/MyInvitation/RequestType";
import SmallLoading from "./SmallLoading";
import { useNavigate } from "react-router-dom";

const RequestComponent = () => {
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listRequest, setListRequest] = useState<RequestType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await api.get(
          `/event/request-of-volunteer?PageNumber=${currentPage}&PageSize=${pageSize}`
        );
        console.log(data);
        setTotal(data.data.totalItems);
        setListRequest(data.data.items);
      } catch (e: any) {
      } finally {
      }
    };
    fetchRequest();
  }, [currentPage]);

  const handleChangePageSearch = (page: number) => {
    setCurrentPage(page);
  };

  const handleClickInvitation = (id: number) => {
    // navigate(`/detail-event/${id}`, { state: { from: "invi" } });
    window.open(`/detail-event/${id}`, "_blank");
  };

  return (
    <div>
      {isLoading && <Loading color="green" />}

      {listRequest?.length === 0 && (
        <Empty className="mt-10" description="Bạn chưa có lời mời nào" />
      )}
      {listRequest?.map((item, index) => (
        <div key={index} className="container mx-auto">
          <div
            onClick={() => handleClickInvitation(item.eventId)}
            className="bg-white w-full border-2 border-primary-color rounded-lg my-4 py-2 px-4 hover:scale-105 transition-all cursor-pointer hover:shadow-2xl flex items-center justify-between"
          >
            <div className="lg:max-w-96 max-w-52">
              <div className="">
                <span>
                  Bạn đã gửi yêu cầu tham gia sự kiện{" "}
                  <span className="text-primary-color font-medium">
                    {item.eventName}
                  </span>
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
            <div className="bg-primary-color w-32 h-16 relative">
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
          </div>
        </div>
      ))}
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
        {listRequest?.length !== 0 && (
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

export default RequestComponent;
