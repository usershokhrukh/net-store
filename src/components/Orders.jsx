import React, {useEffect, useState} from "react";
import {checkUserId} from "../api/apiClient";
import {useGetUserOrder} from "../hooks/GET/useGetUserOrder";
import {toast} from "react-toastify";
import {MdOutlineStar, MdStarRate} from "react-icons/md";
import {Outlet, useNavigate} from "react-router-dom";

const Orders = () => {
  const [userIdState, setUserIdState] = useState(null);
  useEffect(() => {
    const verify = async () => {
      const res = await checkUserId();
      setUserIdState(res);
    };
    verify();
  }, []);

  useEffect(() => {
    if (userIdState != null) {
      if (!userIdState) {
        toast.error("Please login again!");
        localStorage.clear();
        window.location.reload();
      }
    }
  }, [userIdState]);

  const {data, error} = userIdState
    ? useGetUserOrder(userIdState)
    : useGetUserOrder();

  useEffect(() => {
    if (error) {
      console.log(error.message);
      toast.error("Error acquired while getting orders");
    }
  }, [error]);
  const navigate = useNavigate();

  const getMonthNumber = (month) => {
    switch (month) {
      case "January":
        return 1;
      case "February":
        return 2;
      case "March":
        return 3;
      case "April":
        return 4;
      case "May":
        return 5;
      case "June":
        return 6;
      case "July":
        return 7;
      case "August":
        return 8;
      case "September":
        return 9;
      case "October":
        return 10;
      case "November":
        return 11;
      case "December":
        return 12;
    }
  };

  const checkOrder = (orderedDate) => {
    const dateObj = new Date();
    const nowMonth = dateObj.getMonth() + 1;
    const nowDate = dateObj.getDate();

    const [orderDay, orderMonth] = orderedDate.split(" ");

    if (nowMonth < getMonthNumber(orderMonth)) {
      return "Shipping...";
    } else if (nowMonth > getMonthNumber(orderMonth)) {
      return "Your products are waiting, we save products 5 days...";
    } else if (nowMonth == getMonthNumber(orderMonth)) {
      if (nowDate < orderDay) return "Shipping...";
      if (nowDate >= orderDay) return `Your products are waiting, we save products 5 days...`;
    }
  };

  const rate = (id) => {
    navigate(`/orders/rate/${id}`)    
  }

  return (
    <div className="container orders">
      {data?.length ? (
        data?.map(
          ({products, type, phone, orderDate, currentDay, cost, oldPrice, id}) => (
            <div
              key={`${orderDate} ${phone} ${JSON.stringify(products)}`}
              className="orders__cards"
            >
              {
                checkOrder(orderDate) == "Shipping..." ? <h2 className="orders__title">Shipping...</h2> : <div className="orders__top-rate">
                  <p>Products are ready</p>
                  <button onClick={() => rate(id)} className="orders__rate-button">Rate <MdStarRate className="orders__rate-icon" /></button>
                </div>
              }
              
              <div className="orders__top">
                <p className="orders__info-txt">
                  ordered day:
                  <span className="orders__info-span">{currentDay}</span>
                </p>
                <p className="orders__info-txt">
                  deriver date:
                  <span className="orders__info-span">{orderDate}</span>
                </p>
                <p className="orders__info-txt">
                  contact:
                  <span className="orders__info-span">{phone}</span>
                </p>
                <p className="orders__info-txt">
                  in price:
                  <span className="orders__info-span">${cost}</span>
                </p>
                <p className="orders__info-txt">
                  type:
                  <span className="orders__info-span">{type}</span>
                </p>
              </div>
              <div className="orders__items">
                {products?.map(
                  ({image, title, id, productId, rating, price, inStockCount}) => (
                    <div key={`${title} ${id}`} className="cart__item">
                      <div className="cart__item-top-box">
                        <MdOutlineStar className="cart__item-star" />
                        <p className="cart__item-top-box-star">{rating}</p>
                      </div>
                      <div className="cart__item-bottom">
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
                              <p
                                onClick={() =>
                                  navigate(`/product/${productId}`)
                                }
                                className="cart__item-title"
                              >
                                {title}
                              </p>
                            </div>
                            <div className="cart__item-top-b">
                              <div className="cart__item-price-box">
                                <span style={{display: "flex", alignItems: "center", gap: 5}}>{inStockCount} x <p className="cart__item-price">${price}</p></span>
                                {oldPrice ? (
                                  <p className="cart__item-old-price">
                                    {oldPrice}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ),
        )
      ) : (
        <p>You don't have orders yet</p>
      )}

      <Outlet/>
    </div>
  );
};

export default Orders;
