import React from "react";
import {IoHeartOutline} from "react-icons/io5";
import {LuEye} from "react-icons/lu";
import {MdStarRate} from "react-icons/md";
import {PiShoppingCartLight} from "react-icons/pi";

const ProductCard = () => {
  return (
    <div className="products container">
      <div className="products__item">
        <div className="products__top">
          <span>
            <IoHeartOutline className="products__top-icons" />
          </span>
        </div>
        <img
          className="products__image"
          src="https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400"
          alt="title"
        />
        <div className="products__bottom">
          <h4 className="products__title">Futbol to'pi Adidas</h4>
          <p className="products__price">
            $390000
            <span className="products__del-price">
              <del></del>
            </span>
          </p>
          <p className="products__views">
            <span>
              <LuEye className="products__view-icon" />
            </span>
            72
          </p>
          <p className="products__rate">
            <span>
              <MdStarRate className="products__rate-icon" />
            </span>
            4.6
          </p>
        </div>
        <button className="products__button">
          <span>
            <PiShoppingCartLight className="products__button-icons" />
          </span>
        </button>
      </div>

      <div className="products__item">
        <div className="products__top">
          <span>
            <IoHeartOutline className="products__top-icons" />
          </span>
        </div>
        <img
          className="products__image"
          src="https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400"
          alt="title"
        />
        <div className="products__bottom">
          <h4 className="products__title">Futbol to'pi Adidas</h4>
          <p className="products__price">
            $390000
            <span className="products__del-price">
              <del></del>
            </span>
          </p>
          <p className="products__views">
            <span>
              <LuEye className="products__view-icon" />
            </span>
            72
          </p>
          <p className="products__rate">
            <span>
              <MdStarRate className="products__rate-icon" />
            </span>
            4.6
          </p>
        </div>
        <button className="products__button">
          <span>
            <PiShoppingCartLight className="products__button-icons" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
