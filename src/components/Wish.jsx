import {IoHeart, IoHeartOutline} from "react-icons/io5";
import {useGetProducts} from "../hooks/GET/useGetProducts";
import {LuEye, LuTrash} from "react-icons/lu";
import {MdStarRate} from "react-icons/md";
import {GoPlus} from "react-icons/go";
import {AiOutlineMinus} from "react-icons/ai";
import {PiShoppingCartLight} from "react-icons/pi";
import {useContext, useEffect, useState} from "react";
import {checkToken, checkUserId} from "../api/apiClient";
import {GlobalContext} from "../context/globalContext";
import {usePutProduct} from "../hooks/PUT/usePutProduct";
import {useGetCart} from "../hooks/GET/useGetCart";
import {usePutCart} from "../hooks/PUT/usePutCart";
import {useDeleteCart} from "../hooks/DELETE/useDeleteCart";
import {usePostCart} from "../hooks/POST/usePostCart";
import {useQueryClient} from "@tanstack/react-query";
import {GiHandOk} from "react-icons/gi";
import {useNavigate} from "react-router-dom";
import {useGetWishes} from "../hooks/GET/useGetWishes";
import {useGetWishOneId} from "../hooks/GET/useGetWishOneId";
import {usePostWish} from "../hooks/POST/usePostWish";
import {usePutWish} from "../hooks/PUT/usePutWish";
import {useDeleteWish} from "../hooks/DELETE/useDeleteWish";

const ProductCard = () => {
  const {data, isFetching, error: getErrorProducts} = useGetProducts();

  // local

  const [localeProducts, setLocaleProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("userCartProducts")) || [];
  });

  const mergedProducts = data?.map((product) => {
    const foundInLocal = localeProducts?.find(
      ({productId}) => String(productId) === String(product.productId),
    );
    if (foundInLocal) {
      return {
        ...foundInLocal,
      };
    } else {
      return {
        ...product,
      };
    }
  });

  const {setLocalData: setLocalDatContext} = useContext(GlobalContext);

  const handleShop = (e, data) => {
    e.preventDefault();
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

    let className = e.target.className.baseVal;
    className = className.concat(" shopped");
    e.target.className.baseVal = className;
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

  // token available
  const [tokenValid, setTokenValid] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const result = await checkToken();
      setTokenValid(result);
    };

    verify();
  }, []);

  // userId available
  const [userIdState, setUserIdState] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const res = await checkUserId();
      setUserIdState(res);
    };
    verify();
  }, []);

  // server

  const {
    isFetching: putProductsFetch,
    error: putProductsError,
    data: getCart,
  } = userIdState ? useGetCart(userIdState) : useGetCart();

  const [globalServerProducts, setGlobalServerProducts] = useState([]);
  const {data: getWishes} = userIdState ?  useGetWishes(userIdState) : useGetWishes();

  useEffect(() => {
    const mergeProductsServer = data?.map((product) => {
      const foundInCart = getCart?.find(
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

    setGlobalServerProducts(mergeProductsServer);
  }, [userIdState, getCart, getWishes]);

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

  const [wishProductId, setWishProductId] = useState();

  const {data: oneWish} = useGetWishOneId(wishProductId);

  const {mutate: postWish} = usePostWish();
  const {mutate: putWish} = usePutWish();
  const {mutate: deleteWish} = useDeleteWish();
  const [wishState, setWishState] = useState("");

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

  const handleShopServer = (e, data) => {
    postCart({
      ...data,
      inStock: true,
      inStockCount: 1,
      inShop: true,
      id: null,
    });

    let className = e.target.className.baseVal;
    className = className.concat(" shopped");
    e.target.className.baseVal = className;
  };

  const navigate = useNavigate();

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

  const [returnState, setReturnState] = useState(false);
  let returned = false;
  useEffect(() => {
    if (tokenValid) {
      const findReturn = globalServerProducts?.find(
        (item) => item.wish == true,
      );
      if (!findReturn) {
        setReturnState(true);
      }
    } else {
      const findReturn = mergedProducts?.find((item) => item.wish == true);
      if (!findReturn) {
        setReturnState(true);
      }
    }
  }, [tokenValid, mergedProducts, globalServerProducts]);

  return (
    <div className="products container">
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
            }) => {
              if (wish) {
                if (!returned) {
                  returned = true
                }
                return (
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
                        onClick={(e) =>
                          handleShopServer(e, {
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
                );
              }
            },
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
            }) => {
              if (wish) {
                if (!returned) {
                  returned = true
                }
                return (
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
                          handleShop(e, {
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
                );
              }
            },
          )}

      {returnState && !returned ? (
        <div className="products__item">
          <p>You have not wishes in wish list</p>
        </div>
      ) : null}
    </div>
  );
};

export default ProductCard;
