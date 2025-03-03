import { AiOutlineUser } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { Dropdown, Space, MenuProps, Menu } from "antd";
import { useState } from "react";
import { VscBell } from "react-icons/vsc";
import { VscBellDot } from "react-icons/vsc";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { decodedCookie, deleteCookie, getCookie } from "../../ultils/cookie";
import { useLogout } from "../../ultils/logout";

const Header: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCookie("accessToken");
  const user = decodedCookie(token);
  const logout = useLogout();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: `Chào! ${user?.given_name}`,
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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-primary-color md:grid md:grid-cols-8 py-2 px-4 fixed w-full z-10">
      <div></div>
      <div className="bg-white w-16 h-16 m-auto my-2 lg:my-0">Logo</div>
      <div className="col-span-3 hidden md:block">
        <ul className="flex gap-8 text-white text-sm h-full items-center">
          <li className="hover:scale-110 transition-all cursor-pointer">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-white hover:text-white ${
                  isActive || location.pathname === "/"
                    ? "font-bold border-b-2 pb-1 border-white"
                    : ""
                }`
              }
            >
              Trang chủ
            </NavLink>
          </li>
          <li className="hover:scale-110 hover:font-medium transition-transform cursor-pointer">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white hover:text-white ${
                  isActive ? "font-bold border-b-2 pb-1 border-white" : ""
                }`
              }
            >
              Tổ chức
            </NavLink>
          </li>
          <li className="hover:scale-110 hover:font-medium transition-transform cursor-pointer">
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `text-white hover:text-white ${
                  isActive ? "font-bold border-b-2 pb-1 border-white" : ""
                }`
              }
            >
              Sự kiện
            </NavLink>
          </li>
          <li className="hover:scale-110 hover:font-medium transition-transform cursor-pointer">
            <NavLink
              to={`/aboutus`}
              className={({ isActive }) =>
                `text-white hover:text-white ${
                  isActive ? "font-bold border-b-2 pb-1 border-white" : ""
                }`
              }
            >
              Giới thiệu
            </NavLink>
          </li>
        </ul>
      </div>
      {/* <div></div> option */}
      <div></div>
      <div className="col-span-2">
        {!user && (
          <div className="flex w-full h-full justify-center items-center gap-2">
            <NavLink to={"/authentication/signin"}>
              <div className="border-white border rounded-sm text-sm py-2 px-8 text-white font-medium text-center cursor-pointer hover:scale-105 transition-all">
                Đăng nhập
              </div>
            </NavLink>
            <NavLink to={"/authentication/signup"}>
              <div className="bg-white rounded-sm text-sm py-2 px-8 text-primary-color font-medium text-center cursor-pointer hover:scale-105 transition-all">
                Đăng ký
              </div>
            </NavLink>
          </div>
        )}
        {user && (
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

            <div
              onClick={handleLogout}
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              <MdLogout className="text-2xl text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
