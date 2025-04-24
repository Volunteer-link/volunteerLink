import { NavLink } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { GrPhone } from "react-icons/gr";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer: React.FC<{}> = () => {
  return (
    <div className="bg-primary-color px-4 text-white pt-12">
      <div className="grid grid-cols-8">
        <div></div>
        <div className="col-span-6 grid grid-cols-4 w-full relative">
          <div>
            <div className="bg-white w-16 h-16 rounded-full overflow-hidden">
              <img
                src="/materials/with bg.png"
                className="w-full h-full object-contain scale-125"
                alt=""
              />
            </div>
            <div className="text-base text-shadow-md mt-4">
              Vietnam Volunteer Link
            </div>
          </div>
          <div className="">
            <div className="text-sm pb-1 font-medium">LIÊN KẾT</div>
            <div className="text-xs hover:opacity-80 py-2">
              <NavLink className="text-shadow-sm" to={"/"}>
                Trang chủ
              </NavLink>
            </div>
            <div className="text-xs hover:opacity-80 py-2">
              <NavLink className="text-shadow-sm" to={"/organizations"}>
                Tổ chức
              </NavLink>
            </div>
            <div className="text-xs hover:opacity-80 py-2">
              <NavLink className="text-shadow-sm" to={"/volunteers"}>
                Tình nguyện viên
              </NavLink>
            </div>
            <div className="text-xs hover:opacity-80 py-2">
              <NavLink className="text-shadow-sm" to={"/events"}>
                Sự kiện
              </NavLink>
            </div>
            <div className="text-xs hover:opacity-80 py-2">
              <NavLink className="text-shadow-sm" to={"/donative-events"}>
                Ủng hộ
              </NavLink>
            </div>
            <div className="text-xs hover:opacity-80 py-2">
              <NavLink className="text-shadow-sm" to={"/aboutus"}>
                Giới thiệu
              </NavLink>
            </div>
          </div>
          <div>
            <div className="text-sm pb-1 font-medium">THÔNG TIN LIÊN LẠC</div>
            <div className="text-xs py-2 text-shadow-sm flex items-center gap-2">
              <IoMailOutline className="text-base" />
              <div>Email: vietnamvolunteerlink@gmail.com</div>
            </div>
            <div className="text-xs py-2 text-shadow-sm flex items-center gap-2">
              <GrPhone className="text-base" />
              <div>0973647298</div>
            </div>
          </div>
          {/* <div className="">
            <div className="text-sm pb-1 font-medium">MẠNG XÃ HỘI</div>
            <div className="hover:opacity-80 py-2 text-shadow-sm flex items-center gap-2 text-base cursor-pointer">
              <FaFacebookSquare />
              <FaInstagram />
            </div>
          </div> */}
          <div className="border-white border-[0.0625rem] absolute left-0 right-0 -bottom-5"></div>
        </div>
        <div></div>
      </div>
      <div className="text-center pt-8 pb-2">
        Địa chỉ: khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất,
        Hà Nội 10000 , Hà Nội , Việt Nam
      </div>
    </div>
  );
};

export default Footer;
