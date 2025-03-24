import { useEffect, useState } from "react";
import Volunteer from "../../Components/Volunteer";
import api, { setupInterceptors } from "../../apiService/useFetch";
import { useLocation, useParams } from "react-router-dom";
import { volunteerProps } from "../../model/ShowEventModel/volunteerProps";
import { NavLink } from "react-router-dom";
import { Breadcrumb, ConfigProvider, Empty, Pagination } from "antd";
import Loading from "../Components/Loading";
import ErrorSolving from "../../Common/ErrorSolving";
import ErrorCards from "../Components/ErrorCards";

const pageSize = 4;
const ParticipationRequest = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataRequest, setDataRequest] = useState<volunteerProps[]>([]);
  const [errCode, setErrCode] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [nameEvent, setNameEvent] = useState<string>("");
  const [resetState, setResetState] = useState<number>(0);

  const location = useLocation();
  const { nameEventState } = location.state || { nameEventState: "" };

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    setupInterceptors(setErrCode);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/event/participated-requests?EventId=${id}&PageNumber=${currentPage}&PageSize=${pageSize}`
        );

        const dataArr: volunteerProps[] = data.data.items.map((item: any) => ({
          accId: item.accountId,
          requestId: item.requestId,
          name: item.volunteerName,
          image: item.pictureProfile,
          dob: item.dateOfBirth ? new Date(item.dateOfBirth) : undefined,
          address: item.address,
          volunteerDisplayType: "REQUEST",
        }));
        setDataRequest(dataArr);
        setNameEvent(data.data.items[0].eventName);
        setTotal(data.data.totalItems);
      } catch (e: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, resetState]);

  const handleChangePageSearch = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-32 py-8">
      {isLoading && <Loading color="green" />}
      <ErrorCards errCode={errCode} />
      <Breadcrumb
        className=""
        items={[
          {
            title: <NavLink to={"/"}>Trang chủ</NavLink>,
          },
          {
            title: (
              <NavLink to={`/detail-event/${id}`}>Thông tin sự kiện</NavLink>
            ),
          },
          {
            title: (
              <div className="">
                <span>Yêu cầu tham gia của </span>
                <span className="text-primary-color">
                  {location.state?.nameEvent}
                </span>
              </div>
            ),
          },
        ]}
      />

      {dataRequest.map((item, index) => (
        <Volunteer
          key={item.requestId}
          objectVolunteer={item}
          setResetState={setResetState}
        />
      ))}
      {dataRequest.length === 0 && <Empty description="Không có dữ liệu" />}
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
        {dataRequest?.length !== 0 && (
          <div className="container flex justify-center mx-auto px-12 mb-8">
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={total}
              pageSize={pageSize}
              className="mt-4"
              onChange={handleChangePageSearch}
            />
          </div>
        )}
      </ConfigProvider>
    </div>
  );
};

export default ParticipationRequest;
