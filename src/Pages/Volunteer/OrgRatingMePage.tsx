import { useEffect, useState } from "react";
import api, { setupInterceptors } from "../../apiService/useFetch";
import ErrorCards from "../Components/ErrorCards";
import { ConfigProvider, Empty, Pagination, Rate } from "antd";
import { decodedCookie, getCookie } from "../../ultils/cookie";
import { OrgRatingMe } from "../../model/ShowEventModel/OrgRatingMe";

const OrgRatingMePage = () => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [errCode, setErrCode] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [listRating, setListRating] = useState<OrgRatingMe[]>([]);

  // useEffect(() => {
  //   setupInterceptors(setErrCode);
  // }, []);
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data } = await api.get(
          `/feedback/all-feedback-to-volunteer?PageNumber=${currentPage}&PageSize=${pageSize}`
        );
        console.log(data);
        setListRating(data.data.items);
        setTotal(data.data.totalItems);
      } catch (error: any) {
      } finally {
      }
    };
    fetchRating();
  }, [currentPage]);

  const handleClickEvent = (eventId: number) => {
    window.open(`/detail-event/${eventId}`, "_blank");
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div>
      {/* <ErrorCards errCode={errCode} /> */}
      {listRating.length !== 0 && (
        <div className="rounded-md border-2 border-primary-color p-4 mb-4">
          {listRating.map((item, index) => (
            <div
              onClick={() => handleClickEvent(item.eventId)}
              key={index}
              className={`p-2 flex items-start gap-4 select-none cursor-pointer hover:bg-stone-200 rounded-md transition-all ${
                index !== listRating.length - 1 ? "mb-6" : ""
              } `}
            >
              <div>
                <img
                  src={item.pictureProfile}
                  className="w-10 h-10 rounded-full bg-primary-color"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <div>Sự kiện: {item.eventName}</div>
                <div className="font-medium">{item.organizationName}</div>
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
                  {new Date(item.time).toLocaleString("vi-VN", {
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
          <Empty description="Bạn chưa được tổ chức nào đánh giá" />
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
        {listRating.length !== 0 && (
          <div className="flex justify-center px-12 mb-8">
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={total}
              pageSize={pageSize}
              className="mt-4"
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        )}
      </ConfigProvider>
    </div>
  );
};

export default OrgRatingMePage;
