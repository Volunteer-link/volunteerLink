import React, { useEffect, useState } from "react";
import { Breadcrumb, Empty, Pagination } from "antd";
import Volunteer from "../../Components/Volunteer";
import api, { setupInterceptors } from "../../apiService/useFetch";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { DetailEventType } from "../../model/ShowEventModel/DetailEventType";
import Loading from "../Components/Loading";
import ErrorSolving from "../../Common/ErrorSolving";
import ErrorCards from "../Components/ErrorCards";
import LineSpacing from "../Components/LineSpacing";
const VolunteerSuggestions = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const pageSizeAI = 1;
  const pageSizeAll = 1;
  const pageFromUrl = searchParams.get("page");
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const [currentPageAll, setCurrentPageAll] = React.useState<number>(1);
  const [listVolunteer, setListVolunteer] = React.useState<any[]>();
  const [listVolunteerAll, setListVolunteerAll] = React.useState<any[]>();
  const navigate = useNavigate();
  const [eventInfo, setEventInfo] = useState<DetailEventType>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [total, setTotal] = useState<number>(0);
  const [totalAll, setTotalAll] = useState<number>(0);
  const [resetState, setResetState] = useState<number>(0);
  const [resetStateAll, setResetStateAll] = useState<number>(0);
  const [errCode, setErrCode] = useState<number>(0);

  useEffect(() => {
    setupInterceptors(setErrCode);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/common/get-event-infomation?eventId=${id}`
        );

        setEventInfo(data.data);
      } catch (e: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        console.log("ây ai");

        setIsLoading(true);
        const { data } = await api.get(
          `/ai/suggested-volunteer?EventId=${id}&PageNumber=${PageNumber}&PageSize=${pageSizeAI}`
        );

        setListVolunteer(
          data.data.items.map((item: any) =>
            Object.assign(item, {
              volunteerDisplayType: "SUGGESTION",
              pictureProfile: item.urlImage,
            })
          ) || data.data
        );
        setTotal(data.data.totalItems);
      } catch (e: any) {
        console.log(e);
      } finally {
        if (resetState !== 0) {
          setPageNumber(1);
        }
        setIsLoading(false);
      }
    };

    fetchVolunteer();
  }, [PageNumber, resetState]);

  useEffect(() => {
    const fetchAllVolunteer = async () => {
      console.log("ôn");

      try {
        setIsLoading(true);
        const { data } = await api.get(
          `/event/volunteer-available?EventId=${id}&PageNumber=${currentPageAll}&PageSize=${pageSizeAll}`
        );

        setListVolunteerAll(
          data.data.items.map((item: any) =>
            Object.assign(item, {
              volunteerDisplayType: "SUGGESTION",
              pictureProfile: item.pictureImage,
            })
          ) || data.data
        );
        setTotalAll(data.data.totalItems);
      } catch (error: any) {
      } finally {
        if (resetState !== 0) {
          setPageNumber(1);
        }
        setIsLoading(false);
      }
    };
    fetchAllVolunteer();
  }, [currentPageAll, resetStateAll]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageChangeAll = (page: number) => {
    setCurrentPageAll(page);
  };

  return (
    <div className="container mx-auto px-32 py-8 relative">
      <div>
        {isLoading && <Loading color="green" />}
        <ErrorCards errCode={errCode} />

        {/* <Loading color="green" /> */}
        <Breadcrumb
          items={[
            {
              title: <NavLink to={"/"}>Trang chủ</NavLink>,
            },
            {
              title: (
                <NavLink to={`/detail-event/${id}`}>
                  {eventInfo?.name || "Tên sự kiện"}
                </NavLink>
              ),
            },
            {
              title: "Gợi ý tình nguyện viên",
            },
          ]}
        />
        <div>
          <LineSpacing />
          <div className="text-xl text-center mb-8">Gợi ý tình nguyện viên</div>
          {/* <Volunteer volunteerDisplayType="SUGGESTION" /> */}
          {listVolunteer?.map((item, index) => (
            <Volunteer
              objectVolunteer={item}
              key={item.accountId + "suggestion_volunteer"}
              eventId={Number(id)}
              setResetState={setResetState}
              setResetStateAll={setResetStateAll}
            />
          ))}
          {listVolunteer?.length === 0 && (
            <Empty description="Không có dữ liệu" />
          )}
        </div>
        {total !== 0 && (
          <Pagination
            className="mt-4"
            defaultCurrent={1}
            onChange={handlePageChange}
            total={total}
            pageSize={pageSizeAI}
            current={PageNumber}
          />
        )}
      </div>
      <div>
        <LineSpacing />
        <div className="text-xl text-center mb-8">
          Các tình nguyện viên trong hệ thống
        </div>
        {listVolunteerAll?.map((item, index) => (
          <Volunteer
            key={item.accountId + "volunteer"}
            objectVolunteer={item}
            eventId={Number(id)}
            setResetState={setResetState}
            setResetStateAll={setResetStateAll}
          />
        ))}
        {listVolunteerAll?.length === 0 && (
          <Empty description="Không có dữ liệu" />
        )}
        {totalAll !== 0 && (
          <Pagination
            className="mt-4"
            defaultCurrent={1}
            onChange={handlePageChangeAll}
            total={totalAll}
            pageSize={pageSizeAll}
            current={currentPageAll}
          />
        )}
      </div>
    </div>
  );
};

export default VolunteerSuggestions;
