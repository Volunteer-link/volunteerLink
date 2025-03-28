import { AiOutlineUser } from "react-icons/ai";
import { MdEvent, MdLogout } from "react-icons/md";
import { Dropdown, Space, MenuProps, Menu, Badge, ConfigProvider } from "antd";
import { useContext, useEffect, useState } from "react";
import { VscBell } from "react-icons/vsc";
import { VscBellDot } from "react-icons/vsc";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { decodedCookie, deleteCookie, getCookie } from "../../ultils/cookie";
import { useLogout } from "../../ultils/logout";
import { CgProfile } from "react-icons/cg";
import { FaCalendarAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import api from "../../apiService/useFetch";
import useWebSocket from "../../Hook/useWebSocket";
import WebsocketContext from "../../ultils/WebsocketContext";
import { SlEnvolopeLetter } from "react-icons/sl";
import { TbStarsFilled } from "react-icons/tb";

const Header: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);
  const [checkProfile, setCheckProfile] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [notiStatus, setNotiStatus] = useState<boolean>(false);
  const token = getCookie("accessToken");
  const user = decodedCookie(token);
  const logout = useLogout();

  const isExactMatch = location.pathname === "/organizations";

  useEffect(() => {
    const fetchCheckStatus = async () => {
      try {
        const { data } = await api.get(`/profile/check-status-profile`);
        setCheckProfile(data.data.success);
      } catch (e: any) {
      } finally {
      }
    };

    if (user) {
      fetchCheckStatus();
    }
  }, []);

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
      label: (
        <NavLink
          className="flex items-center gap-1"
          to={`${
            user?.role === "Volunteer"
              ? "/volunteerProfile"
              : "/organizations/edit-profile"
          }`}
        >
          <CgProfile />
          <span>Hồ sơ của tôi</span>
          <div
            className={`w-1 h-1 rounded-full bg-red-500 ${
              !checkProfile ? "" : "hidden"
            }`}
          ></div>
        </NavLink>
      ),
    },
    ...(user?.role === "Volunteer"
      ? [
          {
            key: "3",
            label: (
              <NavLink
                className="flex items-center gap-1"
                to={"/joined-events"}
              >
                <FaCalendarAlt />
                <span>Các sự kiện đã tham gia</span>
              </NavLink>
            ),
          },
        ]
      : []),
    ...(user?.role === "Volunteer"
      ? [
          {
            key: "4",
            label: (
              <NavLink
                className="flex items-center gap-1"
                to={"/my-invitation"}
              >
                <SlEnvolopeLetter />
                <span>Quản lý lời mời</span>
              </NavLink>
            ),
          },
        ]
      : []),
    ...(user?.role === "Organization"
      ? [
          {
            key: "6",
            label: (
              <NavLink
                className="flex items-center gap-1"
                to={"/organizations/events"}
              >
                <MdEvent />
                <span>Quản lý sự kiện</span>
              </NavLink>
            ),
          },
        ]
      : []),
    ...(user?.role === "Volunteer"
      ? [
          {
            key: "7",
            label: (
              <NavLink
                className="flex items-center gap-1"
                to={"/rating-management"}
              >
                <TbStarsFilled />
                <span>Quản lý đánh giá</span>
              </NavLink>
            ),
          },
        ]
      : []),
    {
      key: "5",
      label: (
        <NavLink
          className="flex items-center gap-1"
          to={"/account-information"}
        >
          <IoSettingsOutline />
          <span>Thông tin tài khoản</span>
        </NavLink>
      ),
    },
  ];
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  const handleLogout = () => {
    logout();
  };

  const socket = useContext(WebsocketContext);
  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", (event) => {
        const parsedData = JSON.parse(event.data);
        if (
          parsedData.Message === "New Notification" &&
          parsedData.message !== "Connected" &&
          socket.readyState === WebSocket.OPEN
        ) {
          setNotiStatus(true);
        }
        // console.log(JSON.parse(event.data));
      });
    }
  }, [socket]);

  const handleNotification = () => {
    setNotiStatus(false);
    navigate("notification");
  };

  return (
    <div className="bg-primary-color md:grid md:grid-cols-8 py-2 px-4 sticky top-0 w-full z-50">
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
              to="/organizations"
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
            <Badge dot={notiStatus}>
              <div
                onClick={handleNotification}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <VscBell className="text-2xl text-white" />
              </div>
            </Badge>
            {/* <div className="cursor-pointer hover:scale-110 transition-transform">
              <VscBellDot className="text-2xl text-white" />
            </div> */}

            <div className="cursor-pointer hover:scale-110 transition-transform mt-1">
              <Dropdown menu={{ items }} placement="topRight">
                <div className="">
                  <Badge dot={!checkProfile}>
                    <AiOutlineUser className="text-2xl text-white" />
                  </Badge>
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
