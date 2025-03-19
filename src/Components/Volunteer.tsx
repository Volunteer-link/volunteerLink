import React, { useState } from "react";
import { Button, Flex } from "antd";
import { volunteerProps } from "../model/ShowEventModel/volunteerProps";
import Loading from "../Pages/Components/Loading";
import { Loading3QuartersOutlined, LoadingOutlined } from "@ant-design/icons";
import SmallLoading from "../Pages/Components/SmallLoading";
import api from "../apiService/useFetch";

const Volunteer: React.FC<{ objectVolunteer: volunteerProps }> = ({
  objectVolunteer,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const calculateAge = (birthDate: Date | string): number => {
    const currentDate = new Date();
    const birth = new Date(birthDate);

    let age = currentDate.getFullYear() - birth.getFullYear();
    const monthDiff = currentDate.getMonth() - birth.getMonth();

    // Kiểm tra nếu ngày tháng hiện tại chưa đến ngày sinh trong năm
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleClickName = () => {
    console.log(objectVolunteer.accId);
  };

  const handleClickBtn = async (type: string) => {
    try {
      const { data } = await api.post(`/event/handle-request`, {
        requestId: objectVolunteer.requestId,
        accept: type === "yes" ? true : false,
      });
    } catch (e: any) {
    } finally {
    }
  };

  return (
    <div className="px-14 select-none hover:scale-105 transition-all w-4/5 mx-auto flex justify-between items-center border-2 border-[#3BA769] rounded-2xl my-4 py-4 shadow-md">
      <div className="flex gap-8 items-center">
        <div className="relative rounded-full overflow-hidden">
          {isLoading && <SmallLoading />}
          <img
            src={objectVolunteer.image}
            alt=""
            className=" w-32 h-32 rounded-full object-cover bg-primary-color"
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div className="flex text-[#3BA769] leading-none  gap-6 flex-col">
          <span
            onClick={handleClickName}
            className="text-[24px] cursor-pointer transition-all"
          >
            {objectVolunteer.name}
          </span>
          <span className="text-[14px] font-medium text-stone-700">
            {objectVolunteer.dob
              ? calculateAge(objectVolunteer.dob)
              : "Không rõ"}{" "}
            tuổi
          </span>
          <span className="text-[14px] font-medium text-stone-700">
            {objectVolunteer.address}
          </span>
        </div>
      </div>

      {objectVolunteer.volunteerDisplayType === "SUGGESTION" && (
        <Button size="large" type="primary">
          Mời tham gia
        </Button>
      )}
      {objectVolunteer.volunteerDisplayType === "REQUEST" && (
        <div className="flex justify-center gap-2 items-start">
          <Button
            onClick={() => handleClickBtn("yes")}
            size="large"
            type="primary"
          >
            Chấp nhận
          </Button>
          <Button
            onClick={() => handleClickBtn("no")}
            size="large"
            type="default"
          >
            Từ chối
          </Button>
        </div>
      )}
    </div>
  );
};

export default Volunteer;
