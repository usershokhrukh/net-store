import React, {useContext, useEffect, useState} from "react";
import {useGetCart} from "../hooks/GET/useGetCart";
import {MdError, MdOutlineStar} from "react-icons/md";
import {TbTrashFilled} from "react-icons/tb";
import {FiMinus} from "react-icons/fi";
import {GoPlus} from "react-icons/go";
import {checkToken, checkUserId} from "../api/apiClient";
import {data, useAsyncError, useNavigate} from "react-router-dom";
import {GlobalContext} from "../context/globalContext";
import {usePutCart} from "../hooks/PUT/usePutCart";
import {FaUserGear} from "react-icons/fa6";
import {useDeleteCart} from "../hooks/DELETE/useDeleteCart";
import {LuTrash} from "react-icons/lu";
import {AiOutlineMinus} from "react-icons/ai";

const Cart = () => {
  const [userIdState, setUserIdState] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const res = await checkUserId();
      setUserIdState(res);
    };
    verify();
  }, []);

  const navigate = useNavigate();

  const {
    data: cartData,
    isFetching,
    error: getErrorCarts,
  } = userIdState ? useGetCart(userIdState) : useGetCart();

  const {
    blockMoney,
    cartProducts,
    setLocalData: setLocalDatContext,
  } = useContext(GlobalContext);

  const [localData, setLocalData] = useState(() => {
    return JSON.parse(localStorage.getItem("userCartProducts")) || [];
  });

  const [tokenValid, setTokenValid] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const result = await checkToken();
      setTokenValid(result);
    };

    verify();
  }, []);

  useEffect(() => {
    localStorage.setItem("userUI", JSON.stringify({blockMoney, cartProducts}));
  }, [blockMoney, cartProducts]);

  const handlePlusLocal = (data) => {
    const updatedCart = localData?.map((item) => {
      if (item.productId === data.productId) {
        return {
          ...item,
          inStockCount: item.inStockCount + 1,
        };
      }

      return item;
    });
    setLocalData(updatedCart);
    setLocalDatContext(updatedCart);
    localStorage.setItem("userCartProducts", JSON.stringify(updatedCart));
  };
  const handleMinusLocal = (data) => {
    const updatedCart = localData?.map((item) => {
      if (item.productId === data.productId) {
        if (item.inStockCount - 1 >= 1) {
          return {
            ...item,
            inStockCount: item.inStockCount - 1,
          };
        }
      }

      return item;
    });
    setLocalData(updatedCart);
    setLocalDatContext(updatedCart);

    localStorage.setItem("userCartProducts", JSON.stringify(updatedCart));
  };
  const handleTrashLocal = (data) => {
    let clean = [];
    const updatedCart = localData?.map((item) => {
      if (item.productId === data.productId) {
        return {
          ...item,
          inStock: false,
          inShop: false,
          inStockCount: 1,
        };
      }
      return item;
    });

    clean = updatedCart.filter((item) => item !== null);

    setLocalData(clean);
    setLocalDatContext(clean);
    localStorage.setItem("userCartProducts", JSON.stringify(clean));
  };
  const handleInShopLocal = (data) => {
    const updatedCart = localData?.map((item) => {
      if (item.productId === data.productId) {
        return {
          ...item,
          inShop: !item.inShop,
        };
      }

      return item;
    });
    setLocalData(updatedCart);
    setLocalDatContext(updatedCart);
    localStorage.setItem("userCartProducts", JSON.stringify(updatedCart));
  };

  const {
    mutate: patchCart,
    isFetching: fetchingPutCart,
    error: errorPutCart,
  } = usePutCart();

  const {
    mutate: deleteCart,
    isFetching: fetchingDeleteCart,
    error: errorDeleteCart,
  } = useDeleteCart();

  const [blockMoneyServer, setBlockMoneyServer] = useState(0);

  useEffect(() => {
    if (cartData?.length > 0) {
      setBlockMoneyServer(
        cartData?.reduce(
          (total, item) =>
            total + item.price * item.inStockCount * Number(item.inShop),
          0,
        ),
      );
    }else {
      setBlockMoneyServer(0)
    }
  }, [cartData]);

  const handlePlusServer = (data) => {
    patchCart([
      data?.id,
      {
        ...data,
        inStockCount: data.inStockCount + 1,
      },
    ]);
  };

  const handleMinusServer = (data) => {
    if (data.inStockCount - 1 >= 1) {
      patchCart([
        data?.id,
        {
          ...data,
          inStockCount: data.inStockCount - 1,
        },
      ]);
    } else if (data.inStockCount - 1 == 0) {
      deleteCart(data?.id);
    }
  };

  const handleInShopServer = (data) => {
    patchCart([
      data?.id,
      {
        ...data,
        inShop: !data.inShop,
      },
    ]);
  };

  const handleTrashServer = (data) => {
    deleteCart(data?.id);
  };

  return (
    <div className="container cart">
      {tokenValid ? (
        <>
          <div className="cart__top">
            <h2 className="cart__t-title">Your cart </h2>
            {cartData?.length > 0 ? (
              <p className="cart__t-count">
                {cartData?.length} {cartData?.length > 1 ? "items" : "item"}
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
                      inShop,
                      userId,
                      productId,
                      wish,
                    }) => (
                      <div key={`${title} ${id}`} className="cart__item">
                        <div className="cart__item-top-box">
                          <MdOutlineStar className="cart__item-star" />
                          <p className="cart__item-top-box-star">{rating}</p>
                        </div>
                        <div className="cart__item-bottom">
                          <input
                            onClick={() =>
                              handleInShopServer({
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
                                inShop,
                                userId,
                                productId,
                                wish,
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
                                <p
                                  onClick={() =>
                                    navigate(`/product/${productId}`)
                                  }
                                  className="cart__item-title"
                                >
                                  {title}
                                </p>

                                {inStockCount > 1 ? (
                                  <div
                                    onClick={() =>
                                      handleTrashServer({
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
                                        inShop,
                                        userId,
                                        productId,
                                        wish,
                                      })
                                    }
                                    className="cart__item-trash-box"
                                  >
                                    <TbTrashFilled className="cart__item-trash" />
                                    <p className="cart__item-t-text">Destroy</p>
                                  </div>
                                ) : null}
                              </div>
                              <div className="cart__item-top-b">
                                <div className="cart__item-count-box">
                                  {inStockCount > 1 ? (
                                    <>
                                      <AiOutlineMinus
                                        onClick={() =>
                                          handleMinusServer({
                                            title,
                                            price,
                                            oldPrice,
                                            image,
                                            rating,
                                            reviewCount,
                                            inStock,
                                            categoryId,
                                            inStockCount,
                                            inShop,
                                            userId,
                                            productId,
                                            id: Number(id) || id,
                                            wish,
                                          })
                                        }
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <TbTrashFilled
                                        onClick={() =>
                                          handleTrashServer({
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
                                            inShop,
                                            userId,
                                            productId,
                                            wish,
                                          })
                                        }
                                        className="cart__item-trash"
                                      />
                                    </>
                                  )}
                                  <span className="cart__item-count">
                                    {inStockCount}
                                  </span>
                                  <GoPlus
                                    onClick={() =>
                                      handlePlusServer({
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
                                        inShop,
                                        userId,
                                        productId,
                                        wish,
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
              <div className="cart__cat-box">
                <p className="cart__cat-title">Over all:</p>
                <span className="cart__item-price">${blockMoneyServer}</span>
              </div>
              <button className="cart__cat-button">Buy</button>
            </div>
          </div>
        </>
      ) : (
        <>
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
              {localData?.length
                ? localData?.map(
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
                      inShop,
                      productId,
                      wish,
                    }) => {
                      if (inStock) {
                        return (
                          <div key={`${title} ${id}`} className="cart__item">
                            <div className="cart__item-top-box">
                              <MdOutlineStar className="cart__item-star" />
                              <p className="cart__item-top-box-star">
                                {rating}
                              </p>
                            </div>
                            <div className="cart__item-bottom">
                              <input
                                onChange={() =>
                                  handleInShopLocal({
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
                                    inShop,
                                    productId,
                                    wish,
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
                                    <p
                                      onClick={() =>
                                        navigate(`/product/${productId}`)
                                      }
                                      className="cart__item-title"
                                    >
                                      {title}
                                    </p>
                                    {inStockCount > 1 ? (
                                      <div
                                        onClick={() =>
                                          handleTrashLocal({
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
                                            inShop,
                                            productId,
                                            wish,
                                          })
                                        }
                                        className="cart__item-trash-box"
                                      >
                                        <TbTrashFilled className="cart__item-trash" />
                                        <p className="cart__item-t-text">
                                          Destroy
                                        </p>
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="cart__item-top-b">
                                    <div className="cart__item-count-box">
                                      {inStockCount > 1 ? (
                                        <>
                                          <AiOutlineMinus
                                            onClick={() =>
                                              handleMinusLocal({
                                                title,
                                                price,
                                                oldPrice,
                                                image,
                                                rating,
                                                reviewCount,
                                                inStock,
                                                categoryId,
                                                inStockCount,
                                                inShop,
                                                productId,
                                                id: Number(id) || id,
                                                wish,
                                              })
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <TbTrashFilled
                                            onClick={() =>
                                              handleTrashLocal({
                                                title,
                                                price,
                                                oldPrice,
                                                image,
                                                rating,
                                                reviewCount,
                                                inStock,
                                                categoryId,
                                                inStockCount,
                                                inShop,
                                                productId,
                                                id: Number(id) || id,
                                                wish,
                                              })
                                            }
                                            className="cart__item-trash"
                                          />
                                        </>
                                      )}
                                      <span className="cart__item-count">
                                        {inStockCount}
                                      </span>
                                      <GoPlus
                                        onClick={() =>
                                          handlePlusLocal({
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
                                            inShop,
                                            productId,
                                            wish,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="cart__item-price-box">
                                      <p className="cart__item-price">
                                        ${price}
                                      </p>
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
                        );
                      }
                    },
                  )
                : "You have nothing to buy"}
            </div>
            <div className="cart__catalog">
              <div className="cart__cat-box">
                <p className="cart__cat-title">Over all:</p>
                <span className="cart__item-price">${blockMoney}</span>
              </div>
              <button className="cart__cat-button">Buy</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
