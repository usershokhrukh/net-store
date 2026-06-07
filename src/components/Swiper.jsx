import React, {useEffect, useRef} from "react";
import {register} from "swiper/element/bundle";
import {useGetBanners} from "../hooks/GET/useGetBanners";

const Swiper = () => {
  const {data} = useGetBanners();
  const swiperRef = useRef(null);

  useEffect(() => {
    register();
  }, []);
  return (
    <div className="swiper">
      <swiper-container
        ref={swiperRef}
        slides-per-view="1"
        space-between="20"
        loop="true"
        autoplay-delay="2000"
        pagination="true"
        navigation="true"
        effect="fade"
      >
        {data?.map(({ctaText, id, image, subtitle, title}) => (
          <swiper-slide key={`${title} ${id}`} className="swiper-slider banner">
            <div className="banner__box">
              <h3 className="banner__title">{title}</h3>
              <p className="banner__subtitle">{subtitle}</p>
              <button className="banner__button">{ctaText}</button>
            </div>
            <img className="swiper-banner" src={image} alt={title} />
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
};

export default Swiper;
