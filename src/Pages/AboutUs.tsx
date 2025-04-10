const AboutUs = () => {
  return (
    <div className="w-full m-auto">
      <div className="mb-20 mt-10">
        <div className="flex gap-1 justify-center">
          <div className="text-2xl">Câu chuyện</div>
          <div className="text-2xl text-primary-color">chúng tôi</div>
        </div>
        <div className="mt-8 flex items-center flex-wrap lg:flex-nowrap text-end lg:pr-8">
          <img
            src="/materials/istockphoto-1426874794-612x612.jpg"
            alt=""
            className="lg:[clip-path:polygon(0_0,100%_0,70%_100%,0_100%)] lg:w-3/5 w-full m-auto lg:m-0 mb-2 lg:mb-0"
          />
          <div className="lg:px-0 text-center lg:text-right px-8">
            <div className="text-xl  font-medium text-primary-color  lg:ml-auto">
              “Điều kỳ diệu xảy đến với những người thực sự biết yêu thương”
            </div>
            <div className="text-xs lg:text-sm mt-4">
              Trong thế giới mà lòng nhân ái là ánh sáng dẫn lối, chúng tôi tự
              hào kết nối những trái tim thiện nguyện với những hoàn cảnh cần
              giúp đỡ. Chúng tôi không chỉ là cầu nối, mà còn là hành trình sẻ
              chia yêu thương, nơi từng cử chỉ nhỏ bé đều tạo nên điều kỳ diệu.
            </div>
            <div className="text-xs lg:text-sm mt-4">
              Với sứ mệnh lan tỏa giá trị nhân văn, chúng tôi tạo nên không gian
              để mỗi người trở thành ánh sáng hy vọng. Dù là bàn tay nâng đỡ,
              lời an ủi chân thành hay đóng góp vật chất, tất cả đều hợp thành
              dòng chảy yêu thương không ngừng.
            </div>
            <div className="text-xs lg:text-sm mt-4">
              Chúng tôi cam kết minh bạch và tận tâm, để mọi đóng góp mang lại
              giá trị thực tiễn. Hãy cùng chúng tôi viết tiếp câu chuyện nhân
              ái, nơi mỗi ngày đều tràn ngập tình yêu và sẻ chia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
