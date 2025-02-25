import React from 'react';
import { Button, Flex } from 'antd';
const Volunteer = () => {
  return (
    <div className="px-14 flex justify-between items-center border-2 border-[#3BA769] rounded-lg py-4">
      <div className="flex gap-8 items-center">
        <img
          src="/materials/istockphoto-1426874794-612x612.jpg"
          alt=""
          className=" w-44 h-44 rounded-full object-cover"
        />
        <div className="flex text-[#3BA769] leading-none  gap-6 flex-col">
          <span className='text-[24px]'>Lê Anh Sơn</span>
          <span className='text-[16px]'>22 tuổi</span>
          <span className='text-[16px]'>Lập trình viên</span>
        </div>
      </div>
      <Button size="large" type="primary">
        Mời tham gia
      </Button>
    </div>
  );
};

export default Volunteer;
