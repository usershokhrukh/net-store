import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {checkToken, checkUserId} from "../api/apiClient";
import axios from "axios";
import {MdStarRate} from "react-icons/md";
import {LuEye} from "react-icons/lu";
import {GoPlus} from "react-icons/go";
import {AiOutlineMinus} from "react-icons/ai";
import {useGetProductOneId} from "../hooks/GET/useGetProductOneId";
import {useGetCartOneId} from "../hooks/GET/useGetCartOneId";
import {PiShoppingCartLight} from "react-icons/pi";
import {usePutCart} from "../hooks/PUT/usePutCart";

const ItemView = () => {
  const {id} = useParams();
  const [userIdState, setUserIdState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const res = await checkUserId();
      setUserIdState(res);
    };
    verify();
  }, []);

  const [tokenValid, setTokenValid] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const result = await checkToken();
      setTokenValid(result);
    };

    verify();
  }, []);

  const [error, setError] = useState();

  const {data: resProduct} = useGetProductOneId(id);
  const {data: resCart} = useGetCartOneId([id, userIdState]);
  const [product, setProduct] = useState();

  useEffect(() => {
    console.log(resCart, resProduct);

    if (resCart?.length || resProduct?.length) {
      if (resCart?.length) {
        setProduct([
          {
            ...resCart[0],
          },
        ]);
      } else {
        setProduct([
          {
            ...resProduct[0],
          },
        ]);
      }
      setError("");
    } else {
      setError("Product not found!");
    }
  }, [resProduct, resCart]);

  console.log(product);

  const {
    mutate: patchCart,
    isFetching: fetchingPutCart,
    error: errorPutCart,
  } = usePutCart();

  const handlePlusServer = (data) => {
    patchCart([
      data?.id,
      {
        ...data,
        inStockCount: data.inStockCount + 1,
      },
    ]);
  };

  console.log(product);

  return (
    <div className="container">
      {error ? (
        <div className="error-box">
          <p>{error}</p>
        </div>
      ) : null}

      {tokenValid ? (
        product?.map(
          ({
            id: itemId,
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
          }) => (
            <div className="view">
              <div className="view__left">
                <div className="view__left-top">
                  <h2 className="view__title">{title}</h2>
                  <div className="view__ltop-box">
                    <span>
                      <MdStarRate className="products__rate-icon" />
                      {rating}
                    </span>
                    <span>
                      <LuEye className="products__view-icon" />
                      {reviewCount}
                    </span>
                  </div>
                </div>
                <img
                  className="view__img"
                  width={"100%"}
                  height={`100%`}
                  src={image}
                  alt={title}
                />
              </div>
              <div className="view__right">
                <div className="view__right-top">
                  <p className="view__price">${price}</p>
                  {oldPrice ? (
                    <del className="view__del-price">${oldPrice}</del>
                  ) : null}
                </div>

                <div className="view__right-bottom">
                  {inStock ? (
                    <>
                      <div className="view__right-b-box-count">
                        <AiOutlineMinus />
                        <span>{inStockCount}</span>
                        <GoPlus
                          onClick={() => {
                            handlePlusServer({
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
                              id: Number(itemId) || itemId,
                            });
                          }}
                        />
                        {product?.id}
                      </div>
                      <span
                        onClick={() => navigate("/cart")}
                        className="view__right-cart"
                      >
                        <PiShoppingCartLight /> view
                      </span>
                    </>
                  ) : (
                    <button className="view__right-add">
                      <GoPlus /> cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ),
        )
      ) : (
        <div className="view">
          <div className="view__left">
            <div className="view__left-top">
              <h2 className="view__title">{product?.title}</h2>
              <div className="view__ltop-box">
                <span>
                  <MdStarRate className="products__rate-icon" />{" "}
                  {product?.rating}
                </span>
                <span>
                  <LuEye className="products__view-icon" />{" "}
                  {product?.reviewCount}
                </span>
              </div>
            </div>
            <img
              className="view__img"
              width={"100%"}
              height={`100%`}
              src={product?.image}
              alt={product?.title}
            />
          </div>
          <div className="view__right">
            <div className="view__right-top">
              <p className="view__price">${product?.price}</p>
              {product?.oldPrice ? (
                <del className="view__del-price">${product?.oldPrice}</del>
              ) : null}
            </div>

            <div className="view__right-bottom">
              {product?.inStock ? (
                <>
                  <div className="view__right-b-box-count">
                    <AiOutlineMinus />
                    <span>{product?.inStockCount}</span>
                    <GoPlus />
                  </div>
                  <span
                    onClick={() => navigate("/cart")}
                    className="view__right-cart"
                  >
                    <PiShoppingCartLight /> view
                  </span>
                </>
              ) : (
                <button className="view__right-add">
                  <GoPlus /> cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemView;
