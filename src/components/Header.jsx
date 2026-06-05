import {MdOutlineStorefront} from "react-icons/md";
import React, {useEffect, useRef} from "react";
import {register} from "swiper/element/bundle";
import { IoCart } from "react-icons/io5";
const Header = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    register();
  }, []);

  const play = () => {
    if (swiperRef.current) swiperRef.current.swiper.autoplay.start();
  };

  const pause = () => {
    if (swiperRef.current) swiperRef.current.swiper.autoplay.stop();
  };

  return (
    <header className="container header">
      <nav className="navbar">
        <ul className="navbar__ul-list">
          <li className="navbar-list">
            <MdOutlineStorefront className="icons main-icon" />
          </li>
          <li>
            <a className="navbar__link" href="">Home</a></li>
        </ul>
        <input className="navbar-input" placeholder="Search bar" type="text" />
        <ul className="navbar__ul-list">
          <li className="navbar-list">
            <IoCart className="icons cart-icon" />
          </li>
        </ul>
      </nav>

      <div className="swiper">
        <swiper-container
          ref={swiperRef}
          slides-per-view="1"
          space-between="20"
          loop="true"
          autoplay-delay="10000"
          pagination="true"
          navigation="true"
          effect="fade"
          speed="0"
          fade-effect='{"crossFade": true}'
        >
          <swiper-slide className="swiper-slider banner">
            <img
              className="swiper-banner"
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200"
              alt=""
            />
            <div className="banner__box">
              <h3 className="banner__title">Yangi Yozgi Kolleksiya</h3>
              <p className="banner__subtitle">Eng so'nggi trendlar sizni kutmoqda</p>
              <button className="banner__button">Ko'rish</button>
            </div>
          </swiper-slide>
          <swiper-slide className="swiper-slider banner">
            <img
              className="swiper-banner"
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200"
              alt=""
            />
            <div className="banner__box">
              <h3 className="banner__title">Elektronika Chegirmasi</h3>
              <p className="banner__subtitle">Barcha gadjetlarda 20% chegirma</p>
              <button className="banner__button">Xarid qilish</button>
            </div>
          </swiper-slide>
          {/* <swiper-slide className="swiper-slider">
            <div
              style={{
                background: "#28a745",
                color: "white",
                padding: "40px",
                textAlign: "center",
                borderRadius: "8px",
              }}
            >
              Slide 2
            </div>
          </swiper-slide>
          <swiper-slide className="swiper-slider">
            <div
              style={{
                background: "#dc3545",
                color: "white",
                padding: "40px",
                textAlign: "center",
                borderRadius: "8px",
              }}
            >
              Slide 3
            </div>
          </swiper-slide>
          <swiper-slide className="swiper-slider">
            <div
              style={{
                background: "#ffc107",
                color: "white",
                padding: "40px",
                textAlign: "center",
                borderRadius: "8px",
              }}
            >
              Slide 4
            </div>
          </swiper-slide> */}
        </swiper-container>
      </div>
    </header>
  );
};

export default Header;
