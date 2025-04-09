import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Empty, Rate, Row, Tabs, Tag } from "antd";
import { StarOutlined } from "@ant-design/icons";
import { TabsProps } from "antd/lib";
import VolunteerInformation from "./VolunteerInformation";
import api from "../../apiService/useFetch";
import { VolunteerProfilePage } from "../../model/Request/VolunteerProfile";
import dayjs from "dayjs";
import VolunteerEvents from "./VolunteerEvents";
import { useParams } from "react-router-dom";

const VolunteerProfile = () => {
  const { id } = useParams();

  const [volunteer, setVolunteer] = useState<VolunteerProfilePage>();
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const { data } = await api.get(`/profile/volunteer`, {
          params: {
            Id: id,
          },
        });
        console.log(data);

        setVolunteer(data.data);
      } catch (e: any) {
        if (e.response?.data.Message === "This profile is not available") {
          setIsAvailable(true);
        }
      } finally {
      }
    };

    fetchVolunteer();
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      children: <VolunteerInformation volunteer={volunteer} />,
    },
    {
      key: "2",
      label: "Sự kiện đã tham gia",
      children: <VolunteerEvents id={parseInt(id || "")} />,
    },
  ];

  // if (!volunteer) {
  //   return null;
  // }

  return (
    <div className="py-8">
      {isAvailable && <Empty description="Hồ sơ của người dùng này đã bị ẩn" />}
      {volunteer && (
        <div className="w-full">
          <div className="flex items-center space-x-4">
            {/* Avatar and Name */}
            <Avatar
              size={100}
              src={volunteer.urlImage || "https://i.pravatar.cc/150?img=7"}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-semibold">{volunteer.name}</h2>
              <p className="text-gray-500 my-2 text-sm">
                {" "}
                {dayjs(volunteer.dateOfBirth).format("DD/MM/YYYY")} |{" "}
                {dayjs().diff(dayjs(volunteer.dateOfBirth), "year")} tuổi{" "}
              </p>
              <div className="flex items-center space-x-1">
                <Rate disabled allowHalf defaultValue={volunteer.numberRated} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 space-x-4 ">
            <Tabs defaultActiveKey="1" items={items} />
          </div>

          {/* Button */}
          {/* <div className="mt-8">
          <Button type="primary">Mời</Button>
        </div> */}
        </div>
      )}
    </div>
  );
};

export default VolunteerProfile;
