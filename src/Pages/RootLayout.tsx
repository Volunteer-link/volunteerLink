import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import ScrollToTop from '../Common/ScrollToTop';
import { Carousel } from 'antd';
import { motion } from 'framer-motion';
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri';

interface SlideOneProps {
  isActive: boolean;
}

const SlideOne: React.FC<SlideOneProps> = ({ isActive }) => {
  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
        background: 'white',
      }}
    >
      <img
        src="/materials/z6488268178733_f3b0a8de88ffd77c7cb4489b2cbe0774.jpg"
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
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: -300 }}
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

const SlideTwo: React.FC<SlideOneProps> = ({ isActive }) => {
  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
        background: 'white',
      }}
    >
      <img
        src="/materials/close-up-people-volunteer-teamwork-putting-finger-star-shapehands-togetherstack-handsunity-teamwork-world-environment-day.jpg"
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
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
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
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
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

const SlideThree: React.FC<SlideOneProps> = ({ isActive }) => {
  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
        background: 'white',
      }}
    >
      <img
        src="/materials/medium-shot-people-hugging_23-2149181996.png"
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
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute text-white right-[10%] top-1/3"
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
          autoplay={{ dotDuration: true }}
          autoplaySpeed={3000}
          arrows
        >
          <div>
            <SlideOne isActive={currentSlide === 0} />
          </div>
          <div>
            <SlideTwo isActive={currentSlide === 1} />
          </div>
          <div>
            <SlideThree isActive={currentSlide === 2} />
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
      {!hideHeader && <Footer />}
    </div>
  );
}
