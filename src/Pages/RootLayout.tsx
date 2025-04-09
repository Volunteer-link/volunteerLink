import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import ScrollToTop from "../Common/ScrollToTop";
import { Carousel } from "antd";
import { motion } from "framer-motion";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

interface SlideOneProps {
  isActive: boolean;
}

const SlideOne: React.FC<SlideOneProps> = ({ isActive }) => {
  return (
    <div
      style={{
        height: "600px",
        position: "relative",
        background: "white",
      }}
    >
      <img
        src="/materials/z6488268178733_f3b0a8de88ffd77c7cb4489b2cbe0774.jpg"
        alt="Volunteer working together"
        className="absolute top-0 left-0 w-full h-full object-cover blur-[2px]"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {isActive && (
        <motion.div
          key="slide-2-animate"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: -300 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute text-white right-10 top-1/4 max-w-[600px]"
        >
          <div className="scale-110 text-end">
            <div className="mb-12">
              <span className="text-2xl font-thin text-shadow-lg">
                Bạn không thể làm{" "}
              </span>
              <div className="bg-white opacity-80 inline-block py-2 px-4 rounded-tr-3xl">
                <span className="text-5xl text-primary-color">mọi thứ</span>
              </div>
            </div>
            <div className="mb-12 text-shadow-lg">
              <span className="text-7xl font-serif">Nhưng</span>
            </div>
            <div>
              <span className="text-2xl font-thin text-shadow-lg">
                Bạn có thể làm{" "}
              </span>
              <div className="bg-white opacity-80 inline-block py-4 px-4 rounded-br-3xl">
                <span className="text-5xl text-primary-color">
                  một điều gì đó
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SlideTwo: React.FC<SlideOneProps> = ({ isActive }) => {
  return (
    <div
      style={{
        height: "600px",
        position: "relative",
        background: "white",
      }}
    >
      <img
        src="/materials/volunteers-helping-with-food-donations-giving-thumbs-up.jpg"
        alt="Volunteer working together"
        className="absolute top-0 left-0 w-full h-full object-cover blur-[2px]"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {isActive && (
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 flex items-center justify-center gap-4">
          {/* Bên trái bay vô */}
          <motion.div
            key="slide-left"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-white text-right mb-8"
          >
            <div className="flex">
              <RiDoubleQuotesL className="text-stone-600 text-2xl" />
              <div>
                <span className="text-stone-600 text-3xl">Một hành động</span>
                <span className="text-primary-color text-5xl"> nhỏ</span>
              </div>
            </div>
          </motion.div>

          {/* Bên phải bay vô */}
          <motion.div
            key="slide-right"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-white text-left mt-8"
          >
            <div className="flex">
              <div>
                <span className="text-stone-600 text-3xl">một trái tim</span>
                <span className="text-primary-color text-5xl"> lớn</span>
              </div>
              <RiDoubleQuotesR className="text-stone-600 text-2xl" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default function RootLayout() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/admin");
  const hideFooter = location.pathname.startsWith("/admin");
  const shouldHideImage =
    location.pathname === "/" || location.pathname === "/home";
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div className="relative">
      <ScrollToTop />
      {!hideHeader && <Header />}
      {shouldHideImage && (
        <Carousel
          afterChange={(current) => setCurrentSlide(current)}
          infinite
          pauseOnFocus
          // autoplay={{ dotDuration: true }}
          // autoplaySpeed={5000}
          arrows
        >
          <div>
            <SlideOne isActive={currentSlide === 0} />
          </div>
          <div>
            <SlideTwo isActive={currentSlide === 1} />
          </div>
          <div>
            <SlideOne isActive={currentSlide === 2} />
          </div>
          <div>
            <SlideOne isActive={currentSlide === 3} />
          </div>
        </Carousel>
      )}
      <main
        className={
          hideFooter
            ? ""
            : `my-3 lg:my-8` + "container mx-auto px-4 lg:px-0 lg:w-3/4"
        }
      >
        <Outlet />
      </main>
      {!hideHeader && <Footer />}
    </div>
  );
}
