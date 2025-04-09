import { useEffect, useMemo, useRef, useState } from "react";
import api, { setupInterceptors } from "../../apiService/useFetch";
import ErrorCards from "../Components/ErrorCards";
import {
  ConfigProvider,
  Dropdown,
  Empty,
  message,
  Modal,
  Pagination,
  Rate,
} from "antd";
import { MyRatingType } from "../../model/ShowEventModel/MyRatingType";
import { SlOptions } from "react-icons/sl";
import { MenuProps } from "antd/lib";
import TextArea from "antd/es/input/TextArea";
import Loading from "../Components/Loading";
import MyRatingPageComponent from "./MyRatingPageComponent";

const MyRatingPage = () => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resetKey, setResetKey] = useState<number>(1);

  // const [errCode, setErrCode] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [listRating, setListRating] = useState<MyRatingType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   setupInterceptors(setErrCode);
  // }, []);
  useEffect(() => {
    const fetchRating = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/feedback/all-feedback-volunteer-rated?PageNumber=${currentPage}&PageSize=${pageSize}`
        );
        setListRating(data.data.items);
        setTotal(data.data.totalItems);
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchRating();
  }, [resetKey, currentPage]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {isLoading && <Loading color="green" />}
      {/* <ErrorCards errCode={errCode} /> */}
      {listRating.length !== 0 && (
        <div className="rounded-md border-2 border-primary-color p-4 mb-4">
          {listRating.map((item, index) => (
            <MyRatingPageComponent
              setResetKey={setResetKey}
              setIsLoading={setIsLoading}
              listRating={listRating}
              index={index}
              key={index}
              object={item}
            />
          ))}
        </div>
      )}
      {listRating.length === 0 && (
        <div className="mb-8">
          <Empty description="Bạn chưa đánh giá sự kiện nào" />
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

export default MyRatingPage;
