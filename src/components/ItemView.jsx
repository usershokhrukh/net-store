import React, {use, useContext, useEffect, useState} from "react";
import {useAsyncError, useNavigate, useParams} from "react-router-dom";
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
import {useGetByCategory} from "../hooks/GET/useGetByCategory";
import {useGetCategoryByUser} from "../hooks/GET/useGetCategoryByUser";
import {IoHeart, IoHeartOutline} from "react-icons/io5";
import {usePostWish} from "../hooks/POST/usePostWish";
import {useGetWishes} from "../hooks/GET/useGetWishes";
import {useGetCart} from "../hooks/GET/useGetCart";
import {usePutWish} from "../hooks/PUT/usePutWish";
import {useDeleteWish} from "../hooks/DELETE/useDeleteWish";

const ItemView = () => {
  const {id} = useParams();
  const [userIdState, setUserIdState] = useState(false);
  const [categoryId, setCategoryId] = useState();
  const navigate = useNavigate();

  const {data, isFetching, error: getErrorProducts} = useGetProducts();

  const {setLocalData: setLocalDatContext} = useContext(GlobalContext);

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

  //user id check

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

    if (!localData.length || !found) {
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

    // let className = e.target.className.baseVal;
    // className = className.concat(" shopped");
    // e.target.className.baseVal = className;
  };

  const handleHeartLocal = (data) => {
    const localData =
      JSON.parse(localStorage.getItem("userCartProducts")) || [];

    let found = false;
    for (let i = 0; i < localData.length; i++) {
      if (localData[i].productId === data.productId) {
        found = true;
        localData[i] = {
          ...localData[i],
          wish: !localData[i].wish,
        };
      }
    }

    if (!localData.length || !found) {
      localData.push({
        ...data,
        wish: true,
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
              wish: resWish[0]?.wish,
              userId: userIdState || null,
            },
          ]);
        } else {
          setProduct([
            {
              ...resProduct[0],
              wish: resWish[0]?.wish,
              userId: userIdState || null,
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
              userId: userIdState || null,
            },
          ]);
        } else {
          setProduct([
            {
              ...resProduct[0],
              userId: userIdState || null,
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
      userId: userIdState || null,
    });
  };

  // recommendation server

  const {
    isFetching: putProductsFetch,
    error: putProductsError,
    data: getCart,
  } = userIdState ? useGetCart(userIdState) : useGetCart();

  const {data: getCategoryProducts} = categoryId
    ? useGetByCategory(categoryId)
    : useGetByCategory(null);
  const {data: userCategoryCart} =
    userIdState && categoryId
      ? useGetCategoryByUser([userIdState, categoryId])
      : useGetCategoryByUser([null, null]);

  const [globalServerProducts, setGlobalServerProducts] = useState([]);

  const {data: getWishes} = userIdState
    ? useGetWishes(userIdState)
    : useGetWishes();

  useEffect(() => {
    if (resProduct?.length) {
      setCategoryId(resProduct[0]?.categoryId);
    }
  }, [resProduct]);

  const mergeProductsServer = getCategoryProducts?.map((product) => {
    const foundInCart = userCategoryCart?.find(
      ({productId}) => String(productId) === String(product.productId),
    );
    const foundInWish = getWishes?.find(
      ({productId}) => String(productId) === String(product.productId),
    );
    if (foundInCart) {
      return {
        ...foundInCart,
        userId: userIdState || null,
      };
    } else if (foundInWish) {
      return {
        ...product,
        userId: userIdState || null,
        wish: true,
      };
    } else {
      return {
        ...product,
        userId: userIdState || null,
      };
    }
  });

  useEffect(() => {
    setGlobalServerProducts(mergeProductsServer);
  }, [userIdState, userCategoryCart, getWishes]);

  const [wishProductId, setWishProductId] = useState();

  const {data: oneWish} = useGetWishOneId([wishProductId, userIdState]);

  const {mutate: postWish} = usePostWish();
  const {mutate: putWish} = usePutWish();
  const {mutate: deleteWish} = useDeleteWish();
  const [wishState, setWishState] = useState("");

  const handleItem = (productId, e) => {
    if (e.target.id != "stock" && e.target.tagName != "path") {
      navigate(`/product/${productId}`);
    }
  };

  const handleHeartServer = (data) => {
    setWishState("");
    setWishProductId(data.productId);
    if (data.inStock) {
      patchCart([
        data?.id,
        {
          ...data,
          wish: !data?.wish,
        },
      ]);

      if (!data.wish) {
        postWish({
          ...data,
          id: null,
          wish: true,
        });
      } else {
        setWishState("delete");
      }
    } else {
      if (!data.wish) {
        postWish({
          ...data,
          wish: true,
          id: null,
        });
      } else {
        setWishState("delete");
      }
    }
  };

  useEffect(() => {
    if (wishState == "delete" && oneWish?.length) {
      deleteWish(oneWish[0]?.id);
    }
  }, [oneWish, wishState]);

  // recommendation local

  const filterInRecServer = data?.filter(
    (item) => String(item?.categoryId) === String(categoryId),
  );
  const filterInRecLocal = localeProducts?.filter(
    (item) => String(item?.categoryId) === String(categoryId),
  );

  const mergedRec = filterInRecServer?.map((item) => {
    const findInRecLocal = filterInRecLocal?.find(
      (local) =>
        (local?.wish || local?.inStock) && item?.productId == local?.productId,
    );
    if (findInRecLocal) return findInRecLocal;
    return item;
  });
  return (
    <div className="container view__container">
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
                    width={600}
                    height={600}
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

      <div className="view__recommendation">
        {tokenValid
          ? globalServerProducts?.map(
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
                <div
                  onClick={(e) => handleItem(productId, e)}
                  key={`${title} ${id}`}
                  className="products__item"
                >
                  <div className="products__top">
                    <span
                      className="products__heart-box"
                      onClick={() =>
                        handleHeartServer({
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
                      id="stock"
                    >
                      {wish ? (
                        <IoHeart
                          id="stock"
                          className="products__top-icons products__heart-icon products__heart"
                        />
                      ) : (
                        <IoHeartOutline
                          id="stock"
                          className="products__top-icons products__heart"
                        />
                      )}
                    </span>
                  </div>
                  <img
                    className="products__image view__image"
                    src={image}
                    alt={title}
                  />
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
                    {/* <button
                    onClick={() => handleItem(productId)}
                    className="products__view-button"
                  >
                    View
                  </button> */}
                  </div>
                  <button className="products__button" id="stock">
                    {inStock ? (
                      <div className="products__button-box" id="stock">
                        <span className="products__b-center" id="stock">
                          <GoPlus
                            id="stock"
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
                            className="products__button-s-icons"
                          />
                          <span id="stock" className="products__b-count">
                            {inStockCount > 9 ? "9+" : inStockCount}
                          </span>

                          {inStockCount > 1 ? (
                            <>
                              <AiOutlineMinus
                                id="stock"
                                onClick={() =>
                                  handleMinusServer({
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
                                className="products__button-s-icons"
                              />
                            </>
                          ) : (
                            <>
                              <LuTrash
                                id="stock"
                                onClick={() =>
                                  handleMinusServer({
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
                                className="products__button-s-icons"
                              />
                            </>
                          )}
                        </span>
                      </div>
                    ) : null}

                    <PiShoppingCartLight
                      id="stock"
                      onClick={() =>
                        handleShopServer({
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
                      className={`products__button-icons ${inStock ? "shopped" : ""}`}
                    />
                  </button>
                </div>
              ),
            )
          : mergedRec?.map(
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
                <div
                  onClick={(e) => handleItem(productId, e)}
                  key={`${id} ${title}`}
                  className="products__item"
                >
                  <div className="products__top">
                    <span
                      className="products__heart-box"
                      onClick={() =>
                        handleHeartLocal({
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
                      id="stock"
                    >
                      {wish ? (
                        <IoHeart
                          id="stock"
                          className="products__top-icons products__heart-icon products__heart"
                        />
                      ) : (
                        <IoHeartOutline
                          id="stock"
                          className="products__top-icons products__heart"
                        />
                      )}
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
                    {/* <button
                    onClick={() => handleItem(productId)}
                    className="products__view-button"
                  >
                    View
                  </button> */}
                  </div>
                  <button className="products__button" id="stock">
                    {inStock ? (
                      <div id="stock" className="products__button-box">
                        <span id="stock" className="products__b-center">
                          <GoPlus
                            id="stock"
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
                            className="products__button-s-icons"
                          />
                          <span id="stock" className="products__b-count">
                            {inStockCount > 9 ? "9+" : inStockCount}
                          </span>
                          {inStockCount > 1 ? (
                            <>
                              <AiOutlineMinus
                                id="stock"
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
                                className="products__button-s-icons"
                              />
                            </>
                          ) : (
                            <>
                              <LuTrash
                                id="stock"
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
                                className="products__button-s-icons"
                              />{" "}
                            </>
                          )}
                        </span>
                      </div>
                    ) : null}

                    <PiShoppingCartLight
                      id="stock"
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
                      className={`products__button-icons ${inStock ? "shopped" : ""}`}
                    />
                  </button>
                </div>
              ),
            )}
      </div>
    </div>
  );
};

export default ItemView;
