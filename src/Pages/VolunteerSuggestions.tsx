import React from 'react';
import { Breadcrumb, Pagination } from 'antd';
import Volunteer from '../Components/Volunteer';
const VolunteerSuggestions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
          },
          {
            title: 'Tết cho em - Nhâm dần 2022',
          },
          {
            title: 'Gợi ý tình nguyện viên',
          },
        ]}
      />
      <div>
        <Volunteer />
      </div>
      <Pagination className="mt-4" defaultCurrent={1} total={50} />
    </div>
  );
};

export default VolunteerSuggestions;
