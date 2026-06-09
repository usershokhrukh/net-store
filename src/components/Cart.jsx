import React, {useEffect, useState} from "react";
import {useGetCart} from "../hooks/GET/useGetCart";
import {MdError, MdOutlineStar} from "react-icons/md";
import {TbTrashFilled} from "react-icons/tb";
import {GoPlus} from "react-icons/go";
import {FiMinus} from "react-icons/fi";
import {usePutCart} from "../hooks/PUT/usePutCart";
import {usePutProduct} from "../hooks/PUT/usePutProduct";
import {usePutUser} from "../hooks/PUT/usePutUser";
import {useGetUser} from "../hooks/GET/useGetUser";
import {useDeleteCart} from "../hooks/DELETE/useDeleteCart";

const Cart = () => {
  const {data: cartData, isFetching, error: getErrorCarts} = useGetCart();
  const {mutate: putMutateUser, error: putErrorUser} = usePutUser();
  const {data: userData, error: getUserError} = useGetUser();
  const {mutate: putMutateCart, error: putErrorCart} = usePutCart();
  const {mutate: putMutateProduct, error: putErrorProduct} = usePutProduct();
  const {
    mutate: deleteMutateCart,
    error: deleteErrorCart,
    data: deleteData,
  } = useDeleteCart();
  const error =
    getErrorCarts?.message ||
    putErrorProduct?.message ||
    deleteErrorCart?.message ||
    getUserError?.message ||
    putErrorCart?.message ||
    putErrorUser?.message;

  const cartProducts = cartData?.length;

  const blockMoney =
    cartData?.reduce((total, item) => {
      if (item.inShop) {
        total += item.price * item.inStockCount;
      }
      return total;
    }, 0) || 0;

  useEffect(() => {
    putMutateUser({...userData, cartMoney: blockMoney, cartProducts: cartData?.length || 0});
  }, [blockMoney]);

  const handlePlus = (data) => {
    const currentId = data.id;
    putMutateCart([
      currentId,
      {
        ...data,
        inStockCount: data.inStockCount + 1,
      },
    ]);

    putMutateProduct([
      data.toProductId,
      {...data, inStockCount: data.inStockCount + 1, toCartId: currentId, toProductId: ""},
    ]);
  };

  const handleMinus = (data) => {
    const currentId = data.id;
    if (data.inStockCount - 1 >= 1) {
      putMutateCart([
        currentId,
        {
          ...data,
          inStockCount: data.inStockCount - 1,
        },
      ]);

      putMutateProduct([
        data.toProductId,
        {...data, inStockCount: data.inStockCount - 1, toCartId: currentId, toProductId: ""},
      ]);
    }
  };

  const handleTrash = (data) => {
    const currentId = data.id;
    deleteMutateCart(currentId);

    putMutateProduct([
      data.toProductId,
      {
        ...data,
        inStockCount: 0,
        inStock: false,
        toCartId: "",
        inShop: false,
        toProductId: ""
      },
    ]);
  };

  const handleCheckChange = (data) => {
    const currentId = data.id;
    putMutateCart([currentId, {...data, inShop: !data.inShop}]);
    putMutateProduct([
      data.toProductId,
      {...data, inShop: !data.inShop, toCartId: currentId, toProductId: ""},
    ]);
  };

  if (!isFetching) {
    return (
      <div className="container cart">
        {error ? (
          <div className="error-box">
            <p className="error-text">{error}</p>
            <MdError className="error-icon" />
          </div>
        ) : null}
        <div className="cart__top">
          <h2 className="cart__t-title">Your cart </h2>
          {cartProducts > 0 ? (
            <p className="cart__t-count">
              {cartProducts} {cartProducts > 1 ? "items" : "item"}
            </p>
          ) : null}
        </div>
        <div className="cart__container">
          <div className="cart__box">
            {cartData?.length
              ? cartData?.map(
                  ({
                    id,
                    title,
                    price,
                    oldPrice,
                    image,
                    rating,
                    reviewCount,
                    inStock,
                    categoryId,
                    inStockCount,
                    toProductId,
                    inShop,
                  }) => (
                    <div key={`${title} ${id}`} className="cart__item">
                      <div className="cart__item-top-box">
                        <MdOutlineStar className="cart__item-star" />
                        <p className="cart__item-top-box-star">{rating}</p>
                      </div>
                      <div className="cart__item-bottom">
                        <input
                          onChange={() =>
                            handleCheckChange({
                              id: Number(id) || id,
                              title,
                              price,
                              oldPrice,
                              image,
                              rating,
                              reviewCount,
                              inStock,
                              categoryId,
                              inStockCount,
                              toProductId: Number(toProductId) || toProductId,
                              inShop,
                            })
                          }
                          checked={inShop}
                          type="checkbox"
                        />
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
                              <div
                                onClick={() =>
                                  handleTrash({
                                    id: Number(id) || id,
                                    title,
                                    price,
                                    oldPrice,
                                    image,
                                    rating,
                                    reviewCount,
                                    inStock,
                                    categoryId,
                                    inStockCount,
                                    toProductId:
                                      Number(toProductId) || toProductId,
                                    inShop,
                                  })
                                }
                                className="cart__item-trash-box"
                              >
                                <TbTrashFilled className="cart__item-trash" />
                                <p className="cart__item-t-text">Destroy</p>
                              </div>
                            </div>
                            <div className="cart__item-top-b">
                              <div className="cart__item-count-box">
                                <FiMinus
                                  onClick={() =>
                                    handleMinus({
                                      id: Number(id) || id,
                                      title,
                                      price,
                                      oldPrice,
                                      image,
                                      rating,
                                      reviewCount,
                                      inStock,
                                      categoryId,
                                      inStockCount,
                                      toProductId:
                                        Number(toProductId) || toProductId,
                                      inShop,
                                    })
                                  }
                                />
                                <span className="cart__item-count">
                                  {inStockCount}
                                </span>
                                <GoPlus
                                  onClick={() =>
                                    handlePlus({
                                      id: Number(id) || id,
                                      title,
                                      price,
                                      oldPrice,
                                      image,
                                      rating,
                                      reviewCount,
                                      inStock,
                                      categoryId,
                                      inStockCount,
                                      toProductId:
                                        Number(toProductId) || toProductId,
                                      inShop,
                                    })
                                  }
                                />
                              </div>
                              <div className="cart__item-price-box">
                                <p className="cart__item-price">${price}</p>
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
                )
              : "You have nothing to buy"}
          </div>
          <div className="cart__catalog">
            <p className="cart__cat-title">
              Over all:
              <span className="cart__item-price">${blockMoney}</span>
            </p>
            <button className="cart__cat-button">Buy</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container cart cart__loading-box">
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
