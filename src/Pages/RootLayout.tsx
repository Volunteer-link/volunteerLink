import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import ScrollToTop from '../Common/ScrollToTop';
import { Carousel } from 'antd';
import { motion } from 'framer-motion';
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri';
import LineSpacing from './Components/LineSpacing';
import { FaArrowRight } from 'react-icons/fa';

interface SlideOneProps {
  isActive: boolean;
  isMobile?: boolean;
}

const SlideOne: React.FC<SlideOneProps> = ({ isActive, isMobile }) => {
  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
        background: 'white',
      }}
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fz6488268178733_f3b0a8de88ffd77c7cb4489b2cbe0774.jpg?alt=media&token=fe58b350-dd7c-48e8-9f4f-07aaa202860e"
        alt="Volunteer working together"
        className="absolute top-0 left-0 w-full h-full object-cover blur-[2px]"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      {isActive && (
        <motion.div
          key="slide-2-animate"
          initial={isMobile ? false : { opacity: 0, x: 0 }}
          animate={isMobile ? {} : { opacity: 1, x: -300 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute text-white right-10 top-1/4 max-w-[600px]"
        >
          <div className="scale-110 text-end">
            <div className="mb-12">
              <span className="text-2xl font-quicksand font-light text-shadow-lg">
                Bạn không thể làm{' '}
              </span>
              <div className="bg-white opacity-80 inline-block py-2 px-4 rounded-tr-3xl">
                <span className="text-5xl text-primary-color font-merriweather">
                  mọi thứ
                </span>
              </div>
            </div>
            <div className="mb-12 text-shadow-lg">
              <span className="text-7xl font-merriweather">Nhưng</span>
            </div>
            <div>
              <span className="text-2xl font-quicksand font-light text-shadow-lg">
                Bạn có thể làm{' '}
              </span>
              <div className="bg-white opacity-80 inline-block py-4 px-4 rounded-br-3xl">
                <span className="text-5xl text-primary-color font-merriweather">
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

const SlideTwo: React.FC<SlideOneProps> = ({ isActive, isMobile }) => {
  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
        background: 'white',
      }}
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fclose-up-people-volunteer-teamwork-putting-finger-star-shapehands-togetherstack-handsunity-teamwork-world-environment-day.jpg?alt=media&token=e7c19c90-3154-4707-8036-4b603570165d"
        alt="Volunteer working together"
        className="absolute top-0 left-0 w-full h-full object-cover blur-[2px]"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      {isActive && (
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 flex items-center justify-center gap-4">
          {/* Bên trái bay vô */}
          <motion.div
            key="slide-left"
            initial={isMobile ? false : { opacity: 0, x: -200 }}
            animate={isMobile ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-white text-right mb-20"
          >
            <div className="flex">
              <RiDoubleQuotesL className="text-stone-700 shadow-lg text-4xl" />
              <div>
                <span className="text-5xl text-stone-700 drop-shadow-lg py-2 px-4 shadow-lg font-quicksand font-light">
                  Một hành động
                </span>
                <span className="text-primary-color bg-white rounded-bl-3xl opacity-90 py-3 font-thin px-6 text-7xl mt-4 inline-block font-merriweather">
                  {' '}
                  nhỏ
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bên phải bay vô */}
          <motion.div
            key="slide-right"
            initial={isMobile ? false : { opacity: 0, x: 200 }}
            animate={isMobile ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-white text-left mt-20"
          >
            <div className="flex">
              <div>
                <span className="text-5xl text-stone-700 drop-shadow-lg py-2 px-4 shadow-lg font-quicksand font-light">
                  một trái tim
                </span>
                <span className="text-primary-color bg-white rounded-br-3xl opacity-90 py-3 font-thin px-6 text-7xl mt-4 inline-block font-merriweather">
                  {' '}
                  lớn
                </span>
              </div>
              <RiDoubleQuotesR className="text-stone-700 shadow-lg text-4xl" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SlideThree: React.FC<SlideOneProps> = ({ isActive,isMobile }) => {
  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
        background: 'white',
      }}
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fmedium-shot-people-hugging_23-2149181996.png?alt=media&token=9f6028de-7504-452b-b832-e457811e163e"
        alt="Volunteer working together"
        className="absolute top-0 left-0 w-full h-full object-cover blur-[2px]"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      {isActive && (
        <motion.div
          key="slide-2-animate"
          initial={isMobile? false : { opacity: 0, y: 100 }}
          animate={isMobile? false : { opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute text-white md:right-[10%] top-1/3"
        >
          <div className="text-end">
            <div className="flex gap-2 items-center bg-white px-8 py-4 rounded-full opacity-80">
              <RiDoubleQuotesL className="text-stone-700 text-4xl" />
              <span>
                <span className="text-3xl text-stone-700 font-quicksand font-light">
                  Tình nguyện là{' '}
                </span>
                <span className="text-5xl font-merriweather text-primary-color">
                  ngôn ngữ{' '}
                </span>
                <span className="text-3xl text-stone-700 font-quicksand font-light">
                  của{' '}
                </span>
                <span className="text-5xl font-merriweather text-primary-color">
                  trái tim
                </span>
              </span>
              <RiDoubleQuotesR className="text-stone-700 text-4xl" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeader = location.pathname.startsWith('/admin');
  const hideFooter = location.pathname.startsWith('/admin');
  const shouldHideImage =
    location.pathname === '/' || location.pathname === '/home';
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (shouldHideImage) {
      setCurrentSlide(0);
    }
  }, [location.pathname]);

  const handleClickDonate = () => {
    navigate('/donative-events');
  };
  const handleClickOrg = () => {
    navigate('/organizations');
  };
  const handleClickEvent = () => {
    navigate('/events');
  };

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // check ban đầu
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative">
      <ScrollToTop />
      {!hideHeader && <Header />}
      {shouldHideImage && (
        <Carousel
          // key={location.key}
          afterChange={(current) => setCurrentSlide(current)}
          infinite
          pauseOnFocus
          // autoplay={{ dotDuration: true }}
          // autoplaySpeed={3000}
          arrows
        >
          <div>
            <SlideOne isMobile={isMobile} isActive={currentSlide === 0} />
          </div>
          <div>
            <SlideTwo isMobile={isMobile} isActive={currentSlide === 1} />
          </div>
          <div>
            <SlideThree isMobile={isMobile} isActive={currentSlide === 2} />
          </div>
        </Carousel>
      )}
      <main
        className={
          hideFooter
            ? ''
            : `my-3 lg:my-8` + 'container mx-auto px-4 lg:px-0 lg:w-3/4'
        }
      >
        <Outlet />
      </main>
      {shouldHideImage && (
        <div className="relative">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fz6488142294205_3ca0412548688435a3727a2293aea9fc.jpg?alt=media&token=41abadbd-5bdf-4cf4-b41d-ff87ec75edeb"
            className="w-full h-[600px] object-cover object-bottom"
            alt=""
          />
          <div className="absolute w-full sm:w-fit top-1/2 -translate-y-1/2 md:right-[10%]">
            <div className=" bg-white shadow-2xl rounded-xl py-4 px-12 mx-auto w-96">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fdonate-icon-vector_946691-933.png?alt=media&token=7ed1c73d-5bc4-48bd-b515-1bd6c93a6966"
                className="w-32 mx-auto my-8"
                alt=""
              />
              <div className="font-quicksand text-lg text-center">
                <span>
                  Chúng tôi tin rằng, mỗi hành động nhỏ, khi được cộng hưởng, sẽ
                  trở thành sức mạnh to lớn để thay đổi cuộc đời của ai đó.
                </span>
                <br></br>
                <span>
                  Dù là một cái ôm hay một lời động viên, đều mang lại giá trị
                  to lớn.
                </span>
              </div>
              <div className="text-center">
                <div
                  onClick={handleClickDonate}
                  className="text-base bg-primary-color my-2 text-white inline-block px-8 cursor-pointer hover:scale-105 border-2 transition-all shadow-xl hover:border-primary-color hover:bg-white hover:text-primary-color py-4 rounded-md"
                >
                  Ủng hộ
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <LineSpacing />
      {shouldHideImage && (
        <div className="font-quicksand">
          <div className="relative">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mealstogo-b034d.appspot.com/o/core%2Fgroup-different-people-volunteering-foodbank-poor-people_23-2149012208.jpg?alt=media&token=29a625f4-ba28-4846-9a9d-62649fff225d"
              className="w-full md:block hidden h-[600px] object-cover blur-[2px]"
              alt=""
            />
            <div className=" flex-col md:flex-row md:absolute flex gap-20 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2">
              <motion.div
                initial={isMobile ? false : { opacity: 0, x: -100 }}
                whileInView={isMobile ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ amount: 0.6 }}
              >
                <div className="md:w-[600px] w-full bg-white py-10 px-12 rounded-md shadow-lg">
                  <div className="text-4xl bg-gradient-to-r font-bold from-[#3BA769] to-[#ddff00] bg-clip-text text-transparent">
                    Tổ chức
                  </div>
                  <div className="w-40 h-1 bg-gradient-to-r from-[#3BA769] to-[#62ff00] rounded-lg mt-2"></div>
                  <div className="text-base">
                    <span className="my-4 inline-block">
                      Trong hệ thống của chúng tôi, mỗi tổ chức là một mảnh ghép
                      quan trọng tạo nên mạng lưới kết nối mạnh mẽ giữa cộng
                      đồng và những giá trị nhân văn.{' '}
                    </span>
                    <span>
                      Từ những nhóm tình nguyện nhỏ đến các tổ chức xã hội lớn,
                      tất cả đều chung một mục tiêu: lan tỏa yêu thương, sẻ chia
                      trách nhiệm và tạo ra tác động tích cực đến từng hoàn
                      cảnh, từng cuộc đời
                    </span>
                  </div>
                  <div
                    onClick={handleClickOrg}
                    className="bg-primary-color px-8 py-4 inline-flex text-lg gap-1 text-white rounded-md mt-4 hover:bg-white hover:text-primary-color border-2 hover:border-primary-color hover:scale-105 transition-all cursor-pointer items-center"
                  >
                    Khám phá
                    <FaArrowRight />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={isMobile ? false : { opacity: 0, x: 100 }}
                whileInView={isMobile ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ amount: 0.6 }}
              >
                <div className="md:w-[600px] w-full bg-white py-10 px-12 rounded-md shadow-lg">
                  <div className="text-4xl bg-gradient-to-r font-bold from-[#3BA769] to-[#ddff00] bg-clip-text text-transparent">
                    Sự kiện
                  </div>
                  <div className="w-40 h-1 bg-gradient-to-r from-[#3BA769] to-[#62ff00] rounded-lg mt-2"></div>
                  <div className="text-base">
                    <span className="my-4 inline-block">
                      Mỗi sự kiện là một hành trình – nơi bạn có thể kết nối với
                      những người cùng chí hướng, và quan trọng nhất là cùng
                      nhau tạo ra những điều thật sự có ý nghĩa.
                    </span>
                    <span>
                      Từ workshop truyền cảm hứng, hoạt động thiện nguyện, đến
                      các chiến dịch cộng đồng… mỗi khoảnh khắc đều đáng giá và
                      để lại dấu ấn riêng
                    </span>
                  </div>
                  <div
                    onClick={handleClickEvent}
                    className="bg-primary-color px-8 py-4 inline-flex text-lg gap-1 text-white rounded-md mt-4 hover:bg-white hover:text-primary-color border-2 hover:border-primary-color hover:scale-105 transition-all cursor-pointer items-center"
                  >
                    Khám phá
                    <FaArrowRight />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
      {!hideHeader && <Footer />}
    </div>
  );
}
