import React from "react";
import LineSpacing from "./Components/LineSpacing";
import { useEffect } from "react";

const Home: React.FC<{}> = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  return (
    <div className="">
      <img
        className="w-full h-96 object-cover"
        style={{ objectPosition: "50% 15%" }}
        src="/materials/medium-shot-volunteers-working-together_23-2149181985.jpg"
        alt=""
      />
      <div className="w-full px-[16rem] m-auto">
        <LineSpacing />
        <div className="flex justify-evenly">
          <div className=" bg-white w-80 rounded-xl border-2 border-primary-color shadow-md">
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
              Kết nối tình nguyện viên và tổ chức, xây dựng một cộng đồng hỗ trợ
              và phát triển bền vững
            </div>
          </div>
          <div className=" bg-white w-80 rounded-xl border-2 border-primary-color shadow-md">
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
              Cung cấp công cụ và tài nguyên giúp tình nguyện viên phát triển kỹ
              năng và nâng cao hiệu quả làm việc
            </div>
          </div>
          <div className=" bg-white w-80 rounded-xl border-2 border-primary-color shadow-md">
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
              Đảm bảo mọi nỗ lực tình nguyện mang lại lợi ích rõ ràng và tạo ra
              thay đổi lâu dài trong xã hội
            </div>
          </div>
        </div>
        <LineSpacing />
        <section id="aboutus" className="pb-20">
          <div className="flex gap-1 justify-center">
            <div className="text-2xl">Câu chuyện</div>
            <div className="text-2xl text-primary-color">chúng tôi</div>
          </div>
          <div className="w-full mt-8 flex items-center text-end pr-8">
            <img
              src="/materials/istockphoto-1426874794-612x612.jpg"
              alt=""
              className="[clip-path:polygon(0_0,100%_0,70%_100%,0_100%)]"
            />
            <div>
              <div className="w-[90%] text-lg font-medium text-primary-color ml-auto">
                “Điều kỳ diệu xảy đến với những người thực sự biết yêu thương”
              </div>
              <div className="text-xs mt-4">
                Trong thế giới mà lòng nhân ái là ánh sáng dẫn lối, chúng tôi tự
                hào kết nối những trái tim thiện nguyện với những hoàn cảnh cần
                giúp đỡ. Chúng tôi không chỉ là cầu nối, mà còn là hành trình sẻ
                chia yêu thương, nơi từng cử chỉ nhỏ bé đều tạo nên điều kỳ
                diệu.
              </div>
              <div className="text-xs mt-4">
                Với sứ mệnh lan tỏa giá trị nhân văn, chúng tôi tạo nên không
                gian để mỗi người trở thành ánh sáng hy vọng. Dù là bàn tay nâng
                đỡ, lời an ủi chân thành hay đóng góp vật chất, tất cả đều hợp
                thành dòng chảy yêu thương không ngừng.
              </div>
              <div className="text-xs mt-4">
                Chúng tôi cam kết minh bạch và tận tâm, để mọi đóng góp mang lại
                giá trị thực tiễn. Hãy cùng chúng tôi viết tiếp câu chuyện nhân
                ái, nơi mỗi ngày đều tràn ngập tình yêu và sẻ chia.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
