import {MdOutlineStorefront} from "react-icons/md";
import React, {useEffect, useRef} from "react";
import {register} from "swiper/element/bundle";
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
        <ul>
          <li className="navbar-list">
            <MdOutlineStorefront className="icons" /> Net-Market
          </li>
        </ul>
      </nav>

      <div className="swiper">
      <swiper-container
        ref={swiperRef}
        slides-per-view="1"
        space-between="20"
        loop="true"
        autoplay-delay="2000"
        pagination="true"
        navigation="true"
      >
        <swiper-slide className="swiper-slider">
          <img className="swiper-banner" src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200" alt="" />
        </swiper-slide>
        <swiper-slide className="swiper-slider">
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
        </swiper-slide>
      </swiper-container>
    </div>
    </header>
  );
};

export default Header;
