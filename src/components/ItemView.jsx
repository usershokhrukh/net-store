import React, {use, useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {checkToken, checkUserId} from "../api/apiClient";
import axios from "axios";
import {MdStarRate} from "react-icons/md";
import {LuEye, LuTrash} from "react-icons/lu";
import {GoPlus} from "react-icons/go";
import {AiOutlineMinus} from "react-icons/ai";
import {useGetProductOneId} from "../hooks/GET/useGetProductOneId";
import {useGetCartOneId} from "../hooks/GET/useGetCartOneId";
import {PiShoppingCartLight} from "react-icons/pi";
import {usePutCart} from "../hooks/PUT/usePutCart";
import {useDeleteCart} from "../hooks/DELETE/useDeleteCart";
import {usePostCart} from "../hooks/POST/usePostCart";
import {useGetProducts} from "../hooks/GET/useGetProducts";
import {GlobalContext} from "../context/globalContext";
import {useGetWishOneId} from "../hooks/GET/useGetWishOneId";

const ItemView = () => {
  const {id} = useParams();
  const [userIdState, setUserIdState] = useState(false);
  const navigate = useNavigate();

  const {data, isFetching, error: getErrorProducts} = useGetProducts();

  const [localeProducts, setLocaleProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("userCartProducts")) || [];
  });

  let mergedProducts = [];

  const mergedLocalProducts = data?.forEach((product, index) => {
    const foundInLocal = localeProducts?.find(
      ({productId}) => String(productId) === String(id),
    );
    if (foundInLocal) {
      if (!mergedProducts?.length) {
        mergedProducts.push({...foundInLocal});
      }
    }

    if (String(product?.productId) == String(id)) {
      if (!mergedProducts?.length) {
        mergedProducts.push({...product});
      }
    }
  });

  const {setLocalData: setLocalDatContext} = useContext(GlobalContext);

  const handleShop = (data) => {
    const localData =
      JSON.parse(localStorage.getItem("userCartProducts")) || [];

    let found = false;
    for (let i = 0; i < localData.length; i++) {
      if (localData[i].productId === data.productId) {
        found = true;
        localData[i] = {
          ...localData[i],
          inStockCount: 1,
          inStock: true,
          inShop: true,
        };
      }
    }

    if (!localData.length) {
      localData.push({
        ...data,
        inStock: true,
        inShop: true,
        inStockCount: 1,
      });
    } else if (!found) {
      localData.push({
        ...data,
        inStock: true,
        inStockCount: 1,
        inShop: true,
      });
    }

    setLocaleProducts(localData);
    setLocalDatContext(localData);
    localStorage.setItem("userCartProducts", JSON.stringify(localData));
  };

  const handlePlusLocal = (data) => {
    const updatedCart = localeProducts?.map((item) => {
      if (item.productId === data.productId) {
        return {
          ...item,
          inStockCount: item.inStockCount + 1,
        };
      }

      return item;
    });
    setLocaleProducts(updatedCart);
    setLocalDatContext(updatedCart);
    localStorage.setItem("userCartProducts", JSON.stringify(updatedCart));
  };

  const handleTrashLocal = (data) => {
    let clean = [];
    const updatedCart = localeProducts?.map((item) => {
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

    setLocaleProducts(clean);
    setLocalDatContext(clean);
    localStorage.setItem("userCartProducts", JSON.stringify(clean));
  };

  const handleMinusLocal = (data) => {
    const updatedCart = localeProducts?.map((item) => {
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
    setLocaleProducts(updatedCart);
    setLocalDatContext(updatedCart);
    localStorage.setItem("userCartProducts", JSON.stringify(updatedCart));
  };

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

  const {data: resProduct, error: getErrorProduct} = useGetProductOneId(id);
  const {data: resCart, error: getErrorCart} = useGetCartOneId([
    id,
    userIdState,
  ]);

  const {data: resWish} = useGetWishOneId(id);
  const [product, setProduct] = useState();

  useEffect(() => {
    if (resWish?.length) {
      if (resCart?.length || resProduct?.length) {
        if (resCart?.length) {
          setProduct([
            {
              ...resCart[0],
              wish: resWish[0]?.wish
            },
          ]);
        } else {
          setProduct([
            {
              ...resProduct[0],
              wish: resWish[0]?.wish
            },
          ]);
        }
        setError("");
      }
    } else {
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
      }
    }
  }, [resProduct, resCart]);

  useEffect(() => {
    if (getErrorCart?.message) {
      setError(getErrorCart?.message);
    }
    if (getErrorProduct?.message) {
      setError(getErrorProduct?.message);
    }
  }, [getErrorProduct, getErrorCart]);

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

  const {
    mutate: postCart,
    isFetching: fetchingPostCart,
    error: errorPostCart,
  } = usePostCart();

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

  const handleShopServer = (data) => {
    postCart({
      ...data,
      inStock: true,
      inStockCount: 1,
      inShop: true,
      id: null,
    });
  };

  return (
    <div className="container">
      {error ? (
        <div className="error-box">
          <p>{error}</p>
        </div>
      ) : null}

      {tokenValid
        ? product?.map(
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
              wish,
            }) => (
              <div key={`${id} ${title}`} className="view">
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
                                    id: Number(itemId) || itemId,
                                    wish,
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>
                              <LuTrash
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
                                    id: Number(itemId) || itemId,
                                    wish,
                                  })
                                }
                              />
                            </>
                          )}
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
                                wish,
                              });
                            }}
                          />
                        </div>
                        <span
                          onClick={() => navigate("/cart")}
                          className="view__right-cart"
                        >
                          <PiShoppingCartLight /> view
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          handleShopServer({
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
                            wish,
                          });
                        }}
                        className="view__right-add"
                      >
                        <GoPlus /> cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )
        : mergedProducts?.map(
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
            }) => (
              <div key={`${id} ${title}`} className="view">
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
                          {inStockCount > 1 ? (
                            <>
                              <AiOutlineMinus
                                onClick={() =>
                                  handleMinusLocal({
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
                            </>
                          ) : (
                            <>
                              <LuTrash
                                onClick={() => {
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
                                  });
                                }}
                              />{" "}
                            </>
                          )}
                          <span>{inStockCount}</span>
                          <GoPlus
                            onClick={() => {
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
                              });
                            }}
                          />
                        </div>
                        <span
                          onClick={() => navigate("/cart")}
                          className="view__right-cart"
                        >
                          <PiShoppingCartLight /> view
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          handleShop({
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
                          });
                        }}
                        className="view__right-add"
                      >
                        <GoPlus /> cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
    </div>
  );
};

export default ItemView;
