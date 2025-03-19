import React from 'react';
import { Button, Flex } from 'antd';

interface volunteerProps {
  name?: string;
  image?: string;
  age?: number;
  field?: string;
  volunteerDisplayType: 'SUGGESTION' | 'PARTICIPATED' | 'REQUEST';
}
const Volunteer = ({
  name,
  image,
  age,
  field,
  volunteerDisplayType,
}: volunteerProps) => {
  return (
    <div className="px-14 flex justify-between items-center border-2 border-[#3BA769] rounded-lg py-4">
      <div className="flex gap-8 items-center">
        <img
          src="/materials/istockphoto-1426874794-612x612.jpg"
          alt=""
          className=" w-32 h-32 rounded-full object-cover"
        />
        <div className="flex text-[#3BA769] leading-none  gap-6 flex-col">
          <span className="text-[24px]">Lê Anh Sơn</span>
          <span className="text-[16px]">22 tuổi</span>
          <span className="text-[16px]">Lập trình viên</span>
        </div>
      </div>

      {volunteerDisplayType === 'SUGGESTION' && (
        <Button size="large" type="primary">
          Mời tham gia
        </Button>
      )}
      {volunteerDisplayType === 'REQUEST' && (
        <div className="flex justify-center gap-2 items-start">
          <Button size="large" type="primary">
            Chấp nhận
          </Button>
          <Button size="large" type="default">
            Từ chối 
          </Button>
        </div>
      )}
    </div>
  );
};

export default Volunteer;
