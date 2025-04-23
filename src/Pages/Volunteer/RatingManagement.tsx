import { Tabs } from "antd";
import { TabsProps } from "antd/lib";
import { useState } from "react";
import MyRatingPage from "./MyRatingPage";
import OrgRatingMePage from "./OrgRatingMePage";

const RatingManagement = () => {
  const [currentTab, setCurrentTab] = useState<string>("1");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Đánh giá của bạn",
    },
    {
      key: "2",
      label: "Đánh giá của các tổ chức",
    },
  ];

  const onChangeTabs = (key: string) => {
    setCurrentTab(key);
  };

  return (
    <div className="">
      <div className="font-medium text-xl mb-2 mt-8">Đánh giá của các tổ chức về bạn</div>
      <Tabs
        defaultActiveKey={currentTab}
        items={items}
        onChange={onChangeTabs}
      />
      {currentTab === "1" && <MyRatingPage />}
      {currentTab === "2" && <OrgRatingMePage />}
    </div>
  );
};

export default RatingManagement;
