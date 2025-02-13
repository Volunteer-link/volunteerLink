import React from "react";
import LineSpacing from "./Components/LineSpacing";
import { useEffect } from "react";

const Home: React.FC<{}> = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  return (
    <div className="mb-20">
      <div className="">
        <img
          className="w-full h-96 object-cover"
          style={{ objectPosition: "50% 15%" }}
          src="/materials/medium-shot-volunteers-working-together_23-2149181985.jpg"
          alt=""
        />
        <div className="w-full lg:px-[16rem] m-auto">
          <LineSpacing />
          <div className="lg:flex lg:justify-evenly">
            <div className=" bg-white w-80 my-2 lg:my-0 rounded-xl border-2 border-primary-color shadow-md m-auto lg:m-0">
              <div className=" w-full h-44">
                <img
                  src="/materials/community.png"
                  alt=""
                  className="w-52 pt-2 m-auto "
                />
              </div>
              <div className="text-primary-color text-xl font-medium text-center">
                CỘNG ĐỒNG
              </div>
              <div className="w-44 text-center m-auto mt-4 pb-20 font-normal text-sm">
                Kết nối tình nguyện viên và tổ chức, xây dựng một cộng đồng hỗ
                trợ và phát triển bền vững
              </div>
            </div>
            <div className=" bg-white w-80 my-2 lg:my-0 rounded-xl border-2 border-primary-color shadow-md m-auto lg:m-0">
              <div className=" w-full h-44">
                <img
                  src="/materials/vecteezy_hands-support-gesture_ 1.png"
                  alt=""
                  className="w-40 pt-2 m-auto "
                />
              </div>
              <div className="text-primary-color text-xl font-medium text-center">
                HỖ TRỢ PHÁT TRIỂN
              </div>
              <div className="w-44 text-center m-auto mt-4 pb-20 font-normal text-sm">
                Cung cấp công cụ và tài nguyên giúp tình nguyện viên phát triển
                kỹ năng và nâng cao hiệu quả làm việc
              </div>
            </div>
            <div className=" bg-white w-80 my-2 lg:my-0 rounded-xl border-2 border-primary-color shadow-md m-auto lg:m-0">
              <div className=" w-full h-44">
                <img
                  src="/materials/Screenshot 2025-01-17 082557 1.png"
                  alt=""
                  className="w-40 pt-2 m-auto "
                />
              </div>
              <div className="text-primary-color text-xl font-medium text-center">
                ẢNH HƯỞNG TÍCH CỰC
              </div>
              <div className="w-44 text-center m-auto mt-4 pb-20 font-normal text-sm">
                Đảm bảo mọi nỗ lực tình nguyện mang lại lợi ích rõ ràng và tạo
                ra thay đổi lâu dài trong xã hội
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
