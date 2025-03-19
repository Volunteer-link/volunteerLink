import { Carousel } from "antd";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
const MySlider: React.FC<{
  listItem?: string[];
  className: string;
  size: string;
}> = ({ listItem, className, size }) => {
  const settings = {
    className: `center`,
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    infinite: true,
  };

  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 text-lg text-primary-color rounded-full cursor-pointer"
        onClick={onClick}
      >
        <FaChevronLeft />
      </div>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 text-lg text-primary-color rounded-full cursor-pointer"
        onClick={onClick}
      >
        <FaChevronRight />
      </div>
    );
  };

  return (
    <div className={className}>
      <Carousel
        arrows
        {...settings}
        prevArrow={<CustomPrevArrow />}
        nextArrow={<CustomNextArrow />}
      >
        {listItem?.map((item, index) => (
          <div
            key={index}
            className={`w-full ${size === "big" ? "h-80" : "h-32"}`}
          >
            <img className="object-cover h-full w-full" src={item} alt="" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MySlider;
