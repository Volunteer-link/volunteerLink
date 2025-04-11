import React from "react";
import LineSpacing from "./Components/LineSpacing";
import { useEffect } from "react";

const Home: React.FC<{}> = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  return (
    <div className="mb-20 font-quicksand">
      <div className="">
        <div className="w-full m-auto">
          <LineSpacing />
          <div className="lg:flex lg:justify-evenly select-none">
            <div className="cursor-pointer hover:scale-105 transition-all hover:shadow-custom-green bg-white w-80 my-2 lg:my-0 rounded-xl border-2 border-primary-color shadow-md m-auto lg:m-0">
              <div className=" w-full h-44">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fcommunity.png?alt=media&token=3639f32f-fcfb-4334-96c2-44a610bd2a3f"
                  alt=""
                  className="w-52 pt-2 m-auto "
                />
              </div>
              <div className="text-primary-color text-xl font-semibold text-center">
                CỘNG ĐỒNG
              </div>
              <div className="w-44 text-center m-auto mt-4 pb-20 font-normal text-base">
                Kết nối tình nguyện viên và tổ chức, xây dựng một cộng đồng hỗ
                trợ và phát triển bền vững
              </div>
            </div>
            <div className="cursor-pointer hover:scale-105 transition-all hover:shadow-custom-green bg-white w-80 my-2 lg:my-0 rounded-xl border-2 border-primary-color shadow-md m-auto lg:m-0">
              <div className=" w-full h-44">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fvecteezy_hands-support-gesture_%201.png?alt=media&token=ffb94de9-843d-4180-8f55-ded38db91346"
                  alt=""
                  className="w-40 pt-2 m-auto "
                />
              </div>
              <div className="text-primary-color text-xl font-semibold text-center">
                HỖ TRỢ PHÁT TRIỂN
              </div>
              <div className="w-44 text-center m-auto mt-4 pb-20 font-normal text-base">
                Cung cấp công cụ và tài nguyên giúp tình nguyện viên phát triển
                kỹ năng và nâng cao hiệu quả làm việc
              </div>
            </div>
            <div className="cursor-pointer hover:scale-105 transition-all hover:shadow-custom-green bg-white w-80 my-2 lg:my-0 rounded-xl border-2 border-primary-color shadow-md m-auto lg:m-0">
              <div className=" w-full h-44">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2FScreenshot%202025-01-17%20082557%201.png?alt=media&token=78475dcf-5af1-4ab2-8f8f-b7a9a28646dc"
                  alt=""
                  className="w-40 pt-2 m-auto "
                />
              </div>
              <div className="text-primary-color text-xl font-semibold text-center">
                ẢNH HƯỞNG TÍCH CỰC
              </div>
              <div className="w-44 text-center m-auto mt-4 pb-20 font-normal text-base">
                Đảm bảo mọi nỗ lực tình nguyện mang lại lợi ích rõ ràng và tạo
                ra thay đổi lâu dài trong xã hội
              </div>
            </div>
          </div>
          <LineSpacing />
        </div>
      </div>
    </div>
  );
};

export default Home;
