import React from "react";
import {IoHeartOutline} from "react-icons/io5";
import {LuEye, LuTrash} from "react-icons/lu";
import {MdRateReview, MdStarRate} from "react-icons/md";
import {PiShoppingCartLight} from "react-icons/pi";
import {useGetProducts} from "../hooks/GET/useGetProducts";
import {GoPlus} from "react-icons/go";
import {AiOutlineMinus} from "react-icons/ai";

const ProductCard = () => {
  const {data} = useGetProducts();
  const handleShop = (e) => {
    if (!e.target.className.baseVal.includes("shopping")) {
      let className = e.target.className.baseVal;
      className = className.concat(" shopping");
      e.target.className.baseVal = className;
    }
  };
  return (
    <div className="products container">
      {data?.map(
        ({id, title, price, oldPrice, image, rating, reviewCount, inStock}) => (
          <div key={`${id} ${title}`} className="products__item">
            <div className="products__top">
              <span>
                <IoHeartOutline className="products__top-icons" />
              </span>
            </div>
            <img className="products__image" src={image} alt={title} />
            <div className="products__bottom">
              <h4 className="products__title">{title}</h4>
              <p className="products__price">
                ${price}
                {oldPrice ? (
                  <span className="products__del-price">
                    <del>${oldPrice}</del>
                  </span>
                ) : null}
              </p>
              <p className="products__views">
                <span>
                  <LuEye className="products__view-icon" />
                </span>
                {reviewCount}
              </p>
              <p className="products__rate">
                <span>
                  <MdStarRate className="products__rate-icon" />
                </span>
                {rating}
              </p>
            </div>
            <button className="products__button">
              {inStock ? (
                <div className="products__button-box">
                  <LuTrash className="products__button-s-icons" />
                  <span className="products__b-center">
                    <GoPlus className="products__button-s-icons" />
                    <span className="products__b-count">1</span>
                    <AiOutlineMinus className="products__button-s-icons" />
                  </span>
                </div>
              ) : null}

                <PiShoppingCartLight
                  onClick={handleShop}
                  className={`products__button-icons ${inStock ? "shopping" : ""}`}
                />
            </button>
          </div>
        ),
      )}
    </div>
  );
};

export default ProductCard;
