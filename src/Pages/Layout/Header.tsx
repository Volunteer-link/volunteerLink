import { AiOutlineUser } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { Dropdown, Space, MenuProps, Menu } from "antd";
import { useState } from "react";
import { VscBell } from "react-icons/vsc";
import { VscBellDot } from "react-icons/vsc";

const Header: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Hồ sơ của tôi",
    },
    {
      key: "3",
      label: "Các sự kiện đã tham gia",
    },
  ];
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  return (
    <div className="bg-primary-color md:grid md:grid-cols-8 md:py-2 md:px-4 fixed w-full z-10">
      <div></div>
      <div className="bg-white w-16 h-16 m-auto my-2 lg:my-0">Logo</div>
      <div className="col-span-3 hidden md:block">
        <ul className="flex gap-8 text-white text-sm h-full items-center">
          <li className="hover:scale-110 transition-all cursor-pointer">
            <a href="#">Trang chủ</a>
          </li>
          <li className="hover:scale-110 hover:font-medium transition-transform cursor-pointer">
            Tổ chức
          </li>
          <li className="hover:scale-110 hover:font-medium transition-transform cursor-pointer">
            Sự kiện
          </li>
          <li className="hover:scale-110 hover:font-medium transition-transform cursor-pointer">
            <a href="#aboutus">Giới thiệu</a>
          </li>
        </ul>
      </div>
      {/* <div></div> option */}
      <div></div>
      <div className="col-span-2">
        {/* <div className="flex w-full h-full justify-center items-center gap-2">
          <div className="border-white border rounded-sm text-sm py-2 px-8 text-white font-medium text-center cursor-pointer hover:scale-105 transition-all">
            Đăng nhập
          </div>
          <div className="bg-white rounded-sm text-sm py-2 px-8 text-primary-color font-medium text-center cursor-pointer hover:scale-105 transition-all">
            Đăng ký
          </div>
        </div> */}
        <div className="flex gap-10 items-center justify-center h-full">
          {/* <div className="cursor-pointer hover:scale-110 transition-transform">
            <VscBell className="text-2xl text-white" />
          </div> */}
          <div className="cursor-pointer hover:scale-110 transition-transform">
            <VscBellDot className="text-2xl text-white" />
          </div>
          <div className="cursor-pointer hover:scale-110 transition-transform">
            <Dropdown menu={{ items }} placement="topRight">
              <div className="">
                <AiOutlineUser className="text-2xl text-white" />
              </div>
            </Dropdown>
          </div>
          <div className="cursor-pointer hover:scale-110 transition-transform">
            <MdLogout className="text-2xl text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
