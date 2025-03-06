import { Breadcrumb, ConfigProvider, Modal, Rate } from "antd";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { decodedCookie, getCookie } from "../../ultils/cookie";
import { FiUsers } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaDotCircle } from "react-icons/fa";
import MySlider from "../../Common/MySlider";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";

const DetailEvent = () => {
  const [stateModalJoin, setStateModalJoin] = useState<boolean>(false);
  const [stateModalDonation, setStateModalDonation] = useState<boolean>(false);
  const [stateModalRate, setStateModalRate] = useState<boolean>(false);
  const [valueRating, setValueRating] = useState<number>(0);
  const { id } = useParams();
  const token = getCookie("accessToken");
  const user = decodedCookie(token);
  const listItem = [
    "/materials/image 13.png",
    "/materials/istockphoto-1426874794-612x612.jpg",
    "/materials/medium-shot-volunteers-working-together_23-2149181985.jpg",
    "/materials/pixelcut-export.jpeg",
  ];

  const handleOpenJoin = () => {
    setStateModalJoin(true);
  };
  const handleCloseJoin = () => {
    setStateModalJoin(false);
  };
  const handleOpenDonation = () => {
    setStateModalDonation(true);
  };
  const handleCloseDonation = () => {
    setStateModalDonation(false);
  };
  const handleOpenRate = () => {
    setStateModalRate(true);
  };
  const handleCloseRate = () => {
    setStateModalRate(false);
  };
  const handleViewOrganization = () => {
    console.log("annyeonghaseyo");
  };
  const handleRating = (value: number) => {
    console.log(value);
  };
  console.log(user);

  return (
    <div>
      <div className="grid grid-cols-8">
        <div></div>
        <div className="col-span-6 ">
          <div className="lg:flex lg:items-center lg:justify-between lg:my-6 mt-20">
            <Breadcrumb
              className=""
              items={[
                {
                  title: <NavLink to={"/events"}>Sự kiện</NavLink>,
                },
                {
                  title: `Demo event number ${id}`,
                },
              ]}
            />
            {/* Organization sight */}
            {/* <div className="lg:flex lg:gap-2">
              <div className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 border-2 inline-block border-primary-color rounded-xl px-6 py-2 bg-white text-primary-color font-medium lg:w-auto w-full text-center my-1">
                Yêu cầu tham gia
              </div>
              <div className="cursor-pointer hover:lg:opacity-95 hover:lg:scale-105 duration-300 px-6 py-2 bg-primary-color rounded-xl text-white lg:w-auto w-full my-1 flex items-center justify-center">
                Tình nguyện viên phù hợp
              </div>
            </div> */}
            {/* Organization sight */}
          </div>
          <div className="w-full mb-10">
            <img
              src="/materials/image 7.png"
              alt=""
              className="w-full lg:h-60 h-20 object-cover"
            />
            <div className="w-full grid grid-cols-10 bg-primary-color">
              <div className=""></div>
              <div className="text-white lg:col-span-3 py-8 col-span-8">
                <div className="flex items-center justify-between mb-4">
                  <div
                    onClick={handleViewOrganization}
                    className="flex items-center gap-2 hover:lg:cursor-pointer hover:lg:scale-105 duration-300 hover:lg:opacity-95"
                  >
                    <FiUsers />
                    <div className="lg:max-w-40 max-w-20 overflow-hidden text-ellipsis whitespace-nowrap">
                      Host name Host name Host name Host name Host name Host
                      name Host name Host name
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <div>May, 20</div>
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="">200 người tham gia</div>
                  <div className="flex items-center gap-2">
                    <FaLocationDot />
                    <div>Ha Noi</div>
                  </div>
                </div>
              </div>
              <div className=""></div>
              <div className=""></div>
              {/* Volunteer sight */}
              {/* <div className="lg:col-span-3 col-span-8 flex lg:items-center justify-center lg:justify-end mb-6 lg:mb-0">
              <div className="bg-white text-primary-color inline-block py-2 px-12 rounded-full font-medium lg:hover:opacity-95 lg:hover:scale-105 duration-300 cursor-pointer">
                Tham gia sự kiện
              </div>
            </div> */}
              {/* Volunteer sight */}

              {/* Volunteer already sign */}
              {/* <div className="lg:col-span-3 col-span-8 flex lg:items-center lg:justify-end mb-6 lg:mb-0 gap-4">
                <div
                  onClick={handleOpenJoin}
                  className="text-xs lg:text-sm flex items-center gap-1 border-2 px-6 py-2 rounded-full text-white font-medium hover:cursor-pointer hover:lg:bg-white hover:lg:scale-105 hover:lg:text-primary-color duration-300"
                >
                  <div>Đã tham gia</div>
                  <FaCheck />
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <div
                    onClick={handleOpenDonation}
                    className="text-xs lg:text-sm bg-white px-6 py-2 rounded-full text-primary-color hover:cursor-pointer hover:lg:scale-105 hover:lg:opacity-95 duration-300"
                  >
                    Quyên góp
                  </div>
                </div>
              </div> */}
              {/* Volunteer already sign */}
              {/* Volunteer event end */}
              <div className="lg:col-span-3 col-span-8 flex lg:items-center lg:justify-end mb-6 lg:mb-0 gap-4">
                <div className="flex items-center gap-1 font-medium">
                  <div
                    onClick={handleOpenRate}
                    className="text-xs lg:text-sm bg-white px-6 py-2 rounded-full text-primary-color hover:cursor-pointer hover:lg:scale-105 hover:lg:opacity-95 duration-300"
                  >
                    Đánh giá sự kiện
                  </div>
                </div>
              </div>
              {/* Volunteer event end */}
              <div className=""></div>
            </div>
            <div className="bg-white border-x-2 border-b-2 border-primary-color rounded-b-md py-8 grid grid-cols-10">
              <div></div>
              <div className="col-span-8">
                <div className="mb-10">
                  <div className="flex items-center gap-2 text-primary-color">
                    <FaDotCircle />
                    <div className=" text-base font-medium">Diễn ra</div>
                  </div>
                  <div>abc - def</div>
                </div>
                <div className="mb-10">
                  <div className="flex items-center gap-2 text-primary-color">
                    <FaDotCircle />
                    <div className=" text-base font-medium">Mô tả sự kiện</div>
                  </div>
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                    magni temporibus omnis natus amet atque aliquam, dolor nisi
                    molestiae vero quia distinctio quaerat harum ut illum
                    dolores error fugit cumque!
                  </div>
                </div>
                <div className="mb-10">
                  <div className="flex items-center gap-2 text-primary-color">
                    <FaDotCircle />
                    <div className=" text-base font-medium">
                      Một số hình ảnh
                    </div>
                  </div>
                </div>
                <MySlider
                  className="hidden lg:block"
                  listItem={listItem}
                  size={"big"}
                />
                <MySlider
                  className="block lg:hidden"
                  listItem={listItem}
                  size={"small"}
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <ConfigProvider>
        <Modal
          title="Thông báo"
          open={stateModalJoin}
          // onOk={handleOk}
          onCancel={handleCloseJoin}
        >
          <p>Bạn có chắc muốn hủy tham gia sự kiện không?</p>
          <p>Nếu muốn tham gia sự kiện, bạn sẽ phải gửi lại yêu cầu tham gia</p>
        </Modal>

        <Modal
          title="Quyên góp cho sự kiện"
          open={stateModalDonation}
          // onOk={handleOk}
          onCancel={handleCloseDonation}
        >
          <p>Bạn có chắc muốn hủy tham gia sự kiện không?</p>
        </Modal>

        <Modal
          title="Đánh giá sự kiện"
          open={stateModalRate}
          // onOk={handleOk}
          onCancel={handleCloseRate}
        >
          <Rate onChange={handleRating} />
        </Modal>
      </ConfigProvider>
    </div>
  );
};
export default DetailEvent;
