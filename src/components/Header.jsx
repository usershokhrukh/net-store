import {MdOutlineStorefront} from "react-icons/md";
import React, {useEffect, useRef} from "react";
import {register} from "swiper/element/bundle";
import {IoCart} from "react-icons/io5";
import {useGetBanners} from "../hooks/GET/useGetBanners";
const Header = () => {
  const {data} = useGetBanners();
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
    <header className=" container header">
      <nav className="navbar">
        <ul className="navbar__ul-list">
          <li className="navbar-list">
            <MdOutlineStorefront className="icons main-icon" />
          </li>
          <li>
            <a className="navbar__link" href="">
              Home
            </a>
          </li>
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
          autoplay-delay="4000"
          pagination="true"
          navigation="true"
          effect="fade"
          speed="0"
          fade-effect='{"crossFade": true}'
        >
          {data?.map(({ctaText, id, image, subtitle, title}) => (
            <swiper-slide key={`${title} ${id}`} className="swiper-slider banner">
              <img
                className="swiper-banner"
                src={image}
                alt={title}
              />
              <div className="banner__box">
                <h3 className="banner__title">{title}</h3>
                <p className="banner__subtitle">
                  {subtitle}
                </p>
                <button className="banner__button">{ctaText}</button>
              </div>
            </swiper-slide>
          ))}
        </swiper-container>
      </div>
    </header>
  );
};

export default Header;
