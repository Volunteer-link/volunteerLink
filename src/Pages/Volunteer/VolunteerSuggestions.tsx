import React, { useEffect } from "react";
import { Breadcrumb, Pagination } from "antd";
import Volunteer from "../../Components/Volunteer";
import api from "../../apiService/useFetch";
import { useNavigate, useSearchParams } from "react-router-dom";
const VolunteerSuggestions = () => {
  const [searchParams] = useSearchParams();
  const pageFromUrl = searchParams.get("page");
  const initialPage = pageFromUrl ? parseInt(pageFromUrl) : 1;
  const [PageNumber, setPageNumber] = React.useState<number>(initialPage);
  const [listVolunteer, setListVolunteer] = React.useState<any[]>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const { data } = await api.get(`/event/participated-volunteers`, {});
        setListVolunteer(data.data.items || data.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchVolunteer();
  }, [PageNumber]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: "Tết cho em - Nhâm dần 2022",
          },
          {
            title: "Gợi ý tình nguyện viên",
          },
        ]}
      />
      <div>{/* <Volunteer volunteerDisplayType="SUGGESTION" /> */}</div>
      <Pagination className="mt-4" defaultCurrent={1} total={50} />
    </div>
  );
};

export default VolunteerSuggestions;
