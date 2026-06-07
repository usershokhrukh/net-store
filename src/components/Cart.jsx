import React from "react";
import {useGetCart} from "../hooks/GET/useGetCart";
import {MdOutlineStar} from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";

const Cart = () => {
  const {data, isFetching} = useGetCart();

  if (!isFetching) {
    return (
      <div className="container cart">
        <div className="cart__top">
          <h2 className="cart__t-title">Your cart, </h2>
          <p className="cart__t-count">9 products</p>
        </div>
        <div className="cart__box">
          {data?.map(({id, title, price, oldPrice, image, rating, inStockCount}) => (
            <div key={`${title} ${id}`} className="cart__item">
              <div className="cart__item-top-box">
                <MdOutlineStar className="cart__item-star" />
                <p className="cart__item-top-box-star">{rating}</p>
              </div>
              <div className="cart__item-bottom">
                <input type="checkbox" />
                <div className="cart__item-box">
                  <img
                    width={100}
                    height={110}
                    className="cart__item-img"
                    src={image}
                    alt=""
                  />
                  <div className="cart__item-b-right">
                    <div className="cart__item-top">
                      <p className="cart__item-title">{title}</p>
                      <div className="cart__item-trash-box">
                        <TbTrashFilled className="cart__item-trash" />
                        <p className="cart__item-t-text">Destroy</p>
                      </div>
                    </div>
                    <div className="cart__item-top-b">
                      <div className="cart__item-count-box">
                        <FiMinus />
                        <span className="cart__item-count">{inStockCount}</span>
                        <GoPlus />
                      </div>
                      <div className="cart__item-price-box">
                        <p className="cart__item-price">${price}</p>
                        {
                          oldPrice ? <p className="cart__item-old-price">{oldPrice}</p>: null
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container cart">
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
      </div>
    );
  }
};

export default Cart;
