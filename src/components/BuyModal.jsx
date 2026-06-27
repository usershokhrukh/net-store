import {useContext, useEffect, useState} from "react";
import {useGetCart} from "../hooks/GET/useGetCart";
import {MdOutlineStar} from "react-icons/md";
import {TbTrashFilled} from "react-icons/tb";
import {GoPlus} from "react-icons/go";
import {checkToken, checkUserId} from "../api/apiClient";
import {useAsyncError, useNavigate} from "react-router-dom";
import {usePutCart} from "../hooks/PUT/usePutCart";
import {useDeleteCart} from "../hooks/DELETE/useDeleteCart";
import {AiOutlineMinus} from "react-icons/ai";
import { Cost } from "../context/cost";

const BuyModal = () => {
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

  const [tokenValid, setTokenValid] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const result = await checkToken();
      setTokenValid(result);
    };

    verify();
  }, []);

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
    } else {
      setBlockMoneyServer(0);
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

  const [saleCode, setSaleCode] = useState();
  const [currentSale, setCurrentSale] = useState();
  const [finalPrice, setFinalPrice] = useState();

  const changeCode = (e) => {
    const button = document.querySelector(".buy-modal__promotion-button");
    if (e.target.value.trim() && blockMoneyServer) {
      button.classList.add("promotion-button-active");
    } else {
      button.classList.remove("promotion-button-active");
      setSaleCode(null);
      setCurrentSale(null);
      setFinalPrice(0)
    }
  };

  const checkCode = () => {
    const input = document.querySelector(".buy-modal__promotion-input");
    if (input?.value.trim() && blockMoneyServer) {
      setSaleCode((Math.random() * 100).toFixed(0));
    } else {
      setSaleCode(null);
      setCurrentSale(null);
      setFinalPrice(0)
    }
  };

  const [delivery, setDelivery] = useState((Math.random() * 1 + 1).toFixed(2));

  useEffect(() => {
    if (saleCode && blockMoneyServer) {
      const summary = Number(blockMoneyServer) + Number(delivery);
      const percent = Number(
        (Number(summary) * Number(saleCode)) / 100,
      ).toFixed(2);
      setCurrentSale(percent);
      setFinalPrice(Number(summary - percent).toFixed(2));
    } else if (blockMoneyServer) {
      setFinalPrice(Number(blockMoneyServer) + Number(delivery));
      setCurrentSale(null);
    }else {
      setCurrentSale(null)
    }
  }, [delivery, saleCode, blockMoneyServer]);

  useEffect(() => {
    if (!blockMoneyServer) {
      setFinalPrice(0);
    }
  }, [blockMoneyServer]);

  const [inShopProducts, setInShopProducts] = useState([]);

  useEffect(() => {
    const filter = cartData?.filter((item) => item.inShop == true);
    setInShopProducts(filter);
  }, [cartData]);

  const {cost, setCost} = useContext(Cost)
  
  useEffect(() => {
    setCost(finalPrice)
  }, [finalPrice])

  return (
    <div className="buy-modal__container">
      <form onSubmit={(e) => e.preventDefault()} className="buy-modal__form">
        <div className="buy-modal__top">
          <span onClick={() => navigate("/cart")} className="buy-modal__cancel">
            <svg
              className="buy-modal__cancel-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.0003 13.0001L22.0004 11.0002L5.82845 11.0002L9.77817 7.05044L8.36396 5.63623L2 12.0002L8.36396 18.3642L9.77817 16.9499L5.8284 13.0002L22.0003 13.0001Z"></path>
            </svg>
          </span>
          <h2 className="buy-modal__title">Your Cart</h2>
        </div>
        <div className="buy-modal__products">
          {tokenValid ? (
            <>
              <div className="cart__container">
                <div className="cart__box buy-modal__products-box">
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
                              <p className="cart__item-top-box-star">
                                {rating}
                              </p>
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
                        ),
                      )
                    : "You have nothing to buy, return to homepage"}
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div className="buy-modal__promotion">
          <h2 className="buy-modal__section-title buy-modal__promotion-title">
            Have a promotion code?{" "}
            {saleCode ? (
              <span className="buy-modal__promotion-code">
                You got {saleCode}% sale
              </span>
            ) : null}{" "}
          </h2>
          <div className="buy-modal__promo-form">
            <input
              onChange={changeCode}
              placeholder="Enter Code"
              type="text"
              className="buy-modal__promotion-input"
            />
            <button
              onClick={checkCode}
              className="buy-modal__promotion-button"
              type="submit"
            >
              Apply Code
            </button>
          </div>
        </div>
        <div className="buy-modal__map">
          <h2 className="buy-modal__section-title">Destination</h2>
          <iframe
            id="map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d408385.54207008524!2d69.54706364965028!3d41.151319870782395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1782546289277!5m2!1sen!2s"
            width="100%"
            height="300"
            allowfullscreen=""
            style={{border: 0}}
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
        <div className="buy-modal__order">
          <h2 className="buy-modal__section-title">Order Summary</h2>
          <div className="buy-modal__order-box">
            <div className="buy-modal__order-itemb">
              <p className="buy-modal__text">{inShopProducts?.length ? inShopProducts?.length : 0} {inShopProducts?.length > 1 ? "items" : "item"}</p>
              <p className="buy-modal__text-money">
                ${Number(blockMoneyServer)}.00
              </p>
            </div>
            <div className="buy-modal__order-itemb">
              <p className="buy-modal__text">
                Delivery Costs
                <span>
                  <svg
                    className="buy-modal__order-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path>
                  </svg>
                </span>
              </p>
              <p className="buy-modal__text-money">
                ${blockMoneyServer ? delivery : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="buy-modal__total">
          <h2 className="buy-modal__total-title">Total: </h2>
          <p className="buy-modal__total-money">
            ${finalPrice}{" "}
            {currentSale ? (
              <span className="buy-modal__current-sale">
                -${currentSale} sale
              </span>
            ) : null}
          </p>
        </div>
        <button
          onClick={() => {
            if (finalPrice) {
              navigate("/cart/payment");
            }
          }}
          className={`${finalPrice ? "buy-modal__confirm" : "buy-modal__promotion-button"}`}
          style={{maxWidth: 300, alignSelf: "flex-end", width: "100%"}}
        >
          Confirm checkout
        </button>
      </form>
    </div>
  );
};

export default BuyModal;
