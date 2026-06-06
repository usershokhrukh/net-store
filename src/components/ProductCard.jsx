import React from "react";
import {IoHeartOutline} from "react-icons/io5";
import {LuEye} from "react-icons/lu";
import {MdRateReview, MdStarRate} from "react-icons/md";
import {PiShoppingCartLight} from "react-icons/pi";
import {useGetProducts} from "../hooks/GET/useGetProducts";

const ProductCard = () => {
  const {data} = useGetProducts();
  return (
    <div className="products container">
      {data?.map(({id, title, price, oldPrice, image, rating, reviewCount}) => (
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
            <span>
              <PiShoppingCartLight className="products__button-icons" />
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
