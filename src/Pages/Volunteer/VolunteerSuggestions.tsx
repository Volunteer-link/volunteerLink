import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, Empty, Pagination, Switch } from "antd";
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
  const pageSizeAll = 3;
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
  const refSearch = useRef<HTMLInputElement>(null);
  const [AISearch, setAISearch] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");

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

  const fetchAllVolunteer = async (page?: number) => {
    try {
      const pageNumber = page ?? 1;
      setIsLoading(true);
      if (!AISearch) {
        const { data } = await api.get(
          `/event/volunteer-available?EventId=${id}&PageNumber=${pageNumber}&PageSize=${pageSizeAll}&SearchKey=${searchKey}`
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
      }
      if (AISearch && searchKey) {
        const { data } = await api.get(
          `/ai/advanced-search-volunteer?EventId=${id}&PageNumber=${pageNumber}&PageSize=${pageSizeAll}&SearchKey=${searchKey}`
        );
        console.log(data);

        setListVolunteerAll(
          data.data.items.map((item: any) =>
            Object.assign(item, {
              volunteerDisplayType: "SUGGESTION",
              pictureProfile: item.urlImage,
            })
          ) || data.data
        );
        setTotalAll(data.data.totalItems);
      }
    } catch (error: any) {
    } finally {
      if (resetState !== 0) {
        setPageNumber(1);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVolunteer();
  }, []);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageChangeAll = (page: number) => {
    setCurrentPageAll(page);
    fetchAllVolunteer(page);
  };

  const handleClickSearch = () => {
    fetchAllVolunteer();
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClickSearch();
    }
  };

  const onChangeSwitchAIMode = (checked: boolean) => {
    setAISearch(checked);
  };

  const handleChangeInput = () => {
    setSearchKey(refSearch.current!.value);
  };

  return (
    <div className="relative">
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
            <Empty className="" description="Không có dữ liệu" />
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
        <div className="flex items-center justify-center gap-2">
          <div className="lg:w-[36rem] w-4/5 bg-white border-2 border-primary-color rounded-full flex items-center justify-between">
            <input
              ref={refSearch}
              type="text"
              placeholder="Tên sự kiện..."
              className="w-3/4 outline-none py-3 px-5 rounded-full relative text-base"
              onKeyDown={handleEnterKey}
              onChange={handleChangeInput}
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
          <div className="bg-white border-2 border-primary-color rounded-full py-3 px-5 flex items-center gap-3">
            <img src="/materials/AI.png" className="w-6 h-6 mb-1" alt="" />
            <Switch defaultChecked={false} onChange={onChangeSwitchAIMode} />
          </div>
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
          <Empty className="mt-4" description="Không có dữ liệu" />
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
