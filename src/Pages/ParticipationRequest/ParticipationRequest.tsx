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

const pageSize = 10;
const ParticipationRequest = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataRequest, setDataRequest] = useState<volunteerProps[]>([]);
  // const [errCode, setErrCode] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [nameEvent, setNameEvent] = useState<string>("");
  const [resetState, setResetState] = useState<number>(0);

  const location = useLocation();
  const { nameEventState } = location.state || { nameEventState: "" };

  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get(`/event/check-owner?eventId=${id}`);

        if (data.data.success) {
          setStatus(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatus();
  }, []);
  // useEffect(() => {
  //   setupInterceptors(setErrCode);
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/event/participated-requests?EventId=${id}&PageNumber=${currentPage}&PageSize=${pageSize}`
        );

        const dataArr: volunteerProps[] = data.data.items?.map((item: any) => ({
          accId: item.accountId,
          requestId: item.requestId,
          name: item.volunteerName,
          pictureProfile: item.pictureProfile,
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
    if (status) {
      fetchData();
    }
  }, [currentPage, resetState, status]);

  const handleChangePageSearch = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="">
      {isLoading && <Loading color="green" />}
      {/* <ErrorCards errCode={errCode} /> */}
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
                <span>Danh sách yêu cầu tham gia sự kiện </span>
                <span className="text-primary-color"></span>
              </div>
            ),
          },
        ]}
      />

      {dataRequest?.map((item, index) => (
        <Volunteer
          key={item.requestId}
          objectVolunteer={item}
          setResetState={setResetState}
        />
      ))}
      {dataRequest.length === 0 && (
        <Empty description="Không có yêu cầu tham gia" />
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
        {dataRequest?.length !== 0 && (
          <div className="flex justify-center mb-8">
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
