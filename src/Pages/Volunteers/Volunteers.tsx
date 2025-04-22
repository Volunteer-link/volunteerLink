import { ConfigProvider, Empty, Pagination } from "antd";
import { useEffect, useRef, useState } from "react";
import api from "../../apiService/useFetch";
import Loading from "../Components/Loading";
import SmallLoading from "../Components/SmallLoading";
import LineSpacing from "../Components/LineSpacing";

const Volunteers = () => {
  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const refSearch = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadPic, setLoadPic] = useState<boolean>(true);
  const [searchKey, setSearchKey] = useState<string>("");
  const [listVolunteer, setListVolunteer] = useState<
    {
      accountId: number;
      address: string;
      dateOfBirth: Date | string;
      id: number;
      isAvailable: boolean;
      location: string;
      name: string;
      phoneNumber: string;
      pictureImage: string;
      sex: number;
      skill: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/common/get-volunteer-common?SearchKey=${searchKey}&PageNumber=${currentPage}&PageSize=${pageSize}`
        );
        setTotal(data.data.totalItems);
        setListVolunteer(data.data.items);
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchKey]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleClickProfile = (accountId: number) => {
    window.open(`/volunteerProfile/${accountId}`);
  };

  const handleClickSearch = async () => {
    setSearchKey(refSearch?.current!.value);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Việc cần làm khi bấm Enter nè

      handleClickSearch();
    }
  };

  return (
    <div>
      {isLoading && <Loading color="green" />}
      <div>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fteam-volunteers-stacking-hands_53876-20900.jpg?alt=media&token=3ee32692-2da1-4f73-b5f2-ed56b7f93bc3"
          className="w-full h-72 object-cover mb-8"
          alt=""
        />
      </div>
      <LineSpacing />
      <div className="items-center gap-1 justify-center text-2xl flex my-10 font-medium">
        <div className="">
          Các <span className="text-primary-color">tình nguyện viên</span>{" "}
        </div>
        <div className="">của chúng tôi</div>
      </div>
      <div className="my-4">
        <div className="flex items-center justify-center gap-2">
          <div className="lg:w-[36rem] w-4/5 bg-white border-2 border-primary-color rounded-full flex items-center justify-between">
            <input
              ref={refSearch}
              type="text"
              placeholder="Tìm kiếm theo tên tình nguyện viên..."
              className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
              onKeyDown={handleKeyDown}
            />
            <div className="flex pr-2 items-center gap-4 select-none">
              <div
                onClick={handleClickSearch}
                className="bg-primary-color text-white lg:px-4 text-nowrap px-8 py-2 lg:py-2 text-xs lg:text-sm rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
              >
                Tìm kiếm
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {listVolunteer?.map((item, index) => {
          const birthYear = new Date(item.dateOfBirth).getFullYear();
          const birthMonth = new Date(item.dateOfBirth).getMonth();
          const birthDay = new Date(item.dateOfBirth).getDate();
          const today = new Date();
          const age =
            today.getFullYear() -
            birthYear -
            (today.getMonth() < birthMonth ||
            (today.getMonth() === birthMonth && today.getDate() < birthDay)
              ? 1
              : 0);

          const sexLabel =
            item.sex === 1 ? "Nam" : item.sex === -1 ? "Nữ" : "Khác";

          return (
            <div
              key={item.accountId}
              onClick={() => handleClickProfile(item.accountId)}
              className="border-2 border-primary-color p-4 flex gap-4 lg:col-span-6 col-span-12 xl:col-span-4 rounded-lg select-none cursor-pointer hover:scale-105 transition-all"
            >
              <div className="relative rounded-full overflow-hidden shrink-0 w-16 h-16">
                {loadPic && <SmallLoading size="small" />}
                <img
                  src={item.pictureImage}
                  alt=""
                  className="w-16 h-16 object-cover rounded-full"
                  onLoad={() => {
                    setLoadPic(false);
                  }}
                />
              </div>
              <div className="">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span>{age} tuổi</span>
                  <span>•</span>
                  <span>{sexLabel}</span>
                </div>
                <div className="text-sm text-gray-500 max-w-64 truncate">
                  {item.address}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {listVolunteer.length === 0 && (
          <Empty description="Không có dữ liệu tình nguyện viên" />
        )}
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
        {listVolunteer?.length !== 0 && (
          <div className="my-8">
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handleChangePage}
            />
          </div>
        )}
      </ConfigProvider>
    </div>
  );
};

export default Volunteers;
