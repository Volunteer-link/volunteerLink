import { useState } from "react";
import { TabsProps } from "antd/lib";
import { Tabs } from "antd";
import InvitationComponent from "../Components/InvitationComponent";
import RequestComponent from "../Components/RequestComponent";

const MyInvitation = () => {
  const [currentTab, setCurrentTab] = useState<string>("1");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Lời mời tham gia",
      children: "Các lời mời được gửi đến bạn:",
    },
    {
      key: "2",
      label: "Yêu cầu đã gửi",
      children: "Các yêu cầu bạn đã gửi đi:",
    },
  ];

  const onChangeTabs = (key: string) => {
    setCurrentTab(key);
  };
  console.log(currentTab);

  return (
    <div className="container mx-auto px-4 lg:px-0 lg:w-3/5">
      <Tabs
        defaultActiveKey={currentTab}
        items={items}
        onChange={onChangeTabs}
      />
      {currentTab === "1" && <InvitationComponent />}
      {currentTab === "2" && <RequestComponent />}
    </div>
  );
};

export default MyInvitation;
