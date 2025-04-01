import { useEffect, useState } from "react";
import api from "../../apiService/useFetch";
import { Invitation } from "../../model/MyInvitation/Invitation";
import { ConfigProvider, Empty, Pagination } from "antd";
import SmallLoading from "../Components/SmallLoading";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
const InvitationComponent = () => {
  const [listInvitation, setListInvitation] = useState<Invitation[]>([]);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/event/invitation-of-volunteer?PageNumber=${currentPage}&PageSize=${pageSize}`
        );
        console.log(data);

        setListInvitation(data.data.items);
        setTotal(data.data.totalItems);
      } catch (e: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

      {listInvitation?.length === 0 && (
        <Empty className="mt-10" description="Bạn chưa có lời mời nào" />
      )}
      {listInvitation?.map((item, index) => (
        <div key={index} className="container mx-auto">
          <div
            onClick={() => handleClickInvitation(item.eventId)}
            className="bg-white w-full border-2 border-primary-color rounded-lg my-4 py-2 px-4 hover:scale-105 transition-all cursor-pointer hover:shadow-2xl flex items-center justify-between"
          >
            <div className="lg:max-w-96 max-w-52">
              <div className="">
                <span>
                  Tổ chức{" "}
                  <span className="text-primary-color font-medium">
                    {item.organizationName}
                  </span>{" "}
                  <span>đã gửi cho bạn 1 lời mời tham dự sự kiện</span>{" "}
                  <span className="text-primary-color font-medium">
                    {item.eventName}
                  </span>
                </span>
              </div>
              <div>
                Thời gian: {new Date(item.time).toLocaleString("sv-SE")}
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
        {listInvitation?.length !== 0 && (
          <div className="flex justify-center mx-auto px-12 mb-8">
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

export default InvitationComponent;
