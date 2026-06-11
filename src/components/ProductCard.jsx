import {IoHeartOutline} from "react-icons/io5";
import {useGetProducts} from "../hooks/GET/useGetProducts";
import {LuEye, LuTrash} from "react-icons/lu";
import {MdStarRate} from "react-icons/md";
import {GoPlus} from "react-icons/go";
import {AiOutlineMinus} from "react-icons/ai";
import {PiShoppingCartLight} from "react-icons/pi";
import {useContext, useEffect, useState} from "react";
import {checkToken} from "../api/apiClient";
import {GlobalContext} from "../context/globalContext";
import {usePutProduct} from "../hooks/PUT/usePutProduct";
import {useGetCart} from "../hooks/GET/useGetCart";

const ProductCard = () => {
  const {data, isFetching, error: getErrorProducts} = useGetProducts();

  const [localeProducts, setLocaleProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("userCartProducts")) || [];
  });

  const mergedProducts = data?.map((product) => {
    const foundInLocal = localeProducts?.find(
      ({id}) => String(id) === String(product.id),
    );
    if (foundInLocal) {
      return {
        ...product,
        inStock: true,
        inStockCount: foundInLocal.inStockCount,
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
      if (localData[i].id === data.id) {
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

    let className = e.target.className.baseVal;
    className = className.concat(" shopped");
    e.target.className.baseVal = className;
  };

  const handlePlusLocal = (data) => {
    const updatedCart = localeProducts?.map((item) => {
      if (item.id === data.id) {
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
  const handleMinusLocal = (data) => {
    const updatedCart = localeProducts?.map((item) => {
      if (item.id === data.id) {
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
  const handleTrashLocal = (data) => {
    let clean = [];
    const updatedCart = localeProducts?.map((item) => {
      if (item.id !== data.id) {
        return item;
      }
      return null;
    });

    clean = updatedCart.filter((item) => item !== null);

    setLocaleProducts(clean);
    setLocalDatContext(clean);
    localStorage.setItem("userCartProducts", JSON.stringify(clean));
  };

  const [tokenValid, setTokenValid] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const result = await checkToken();
      setTokenValid(result);
    };

    verify();
  }, []);

  console.log(data);
  const {
    isFetching: putProductsFetch,
    error: putProductsError,
    data: getCart,
  } = useGetCart();
  console.log(getCart);

  const mergeProductsServer = data?.map((product) => {
    const foundInCart = getCart?.find(
      ({id}) => String(id) === String(product.id),
    );
    if (foundInCart) {
      return {
        ...product,
        inStock: true,
        inStockCount: foundInCart.inStockCount,
      };
    } else {
      return {
        ...product,
      };
    }
  });
  

  return (
    <div className="products container">
      {tokenValid ? (
        mergeProductsServer?.map(
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
          }) => (
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
                {inStock ? (
                  <div className="products__button-box">
                    <LuTrash
                      // onClick={() => {
                      //   handleTrashLocal({
                      //     id: Number(id) || id,
                      //     title,
                      //     price,
                      //     oldPrice,
                      //     image,
                      //     rating,
                      //     reviewCount,
                      //     inStock,
                      //     categoryId,
                      //     inStockCount,
                      //     inShop,
                      //   });
                      // }}
                      className="products__button-s-icons"
                    />
                    <span className="products__b-center">
                      <GoPlus
                        // onClick={() => {
                        //   handlePlusLocal({
                        //     id: Number(id) || id,
                        //     title,
                        //     price,
                        //     oldPrice,
                        //     image,
                        //     rating,
                        //     reviewCount,
                        //     inStock,
                        //     categoryId,
                        //     inStockCount,
                        //     inShop,
                        //   });
                        // }}
                        className="products__button-s-icons"
                      />
                      <span className="products__b-count">
                        {inStockCount > 9 ? "9+" : inStockCount}
                      </span>
                      <AiOutlineMinus
                        // onClick={() => {
                        //   handleMinusLocal({
                        //     id: Number(id) || id,
                        //     title,
                        //     price,
                        //     oldPrice,
                        //     image,
                        //     rating,
                        //     reviewCount,
                        //     inStock,
                        //     categoryId,
                        //     inStockCount,
                        //     inShop,
                        //   });
                        // }}
                        className="products__button-s-icons"
                      />
                    </span>
                  </div>
                ) : null}

                <PiShoppingCartLight
                  // onClick={(e) => {
                  //   handleShop(e, {
                  //     id: Number(id) || id,
                  //     title,
                  //     price,
                  //     oldPrice,
                  //     image,
                  //     rating,
                  //     reviewCount,
                  //     inStock,
                  //     categoryId,
                  //     inStockCount,
                  //     inShop,
                  //   });
                  // }}
                  className={`products__button-icons ${inStock ? "shopped" : ""}`}
                />
              </button>
            </div>
          ),
        )
      ) : (
        mergedProducts?.map(
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
          }) => (
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
                {inStock ? (
                  <div className="products__button-box">
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
                        });
                      }}
                      className="products__button-s-icons"
                    />
                    <span className="products__b-center">
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
                          });
                        }}
                        className="products__button-s-icons"
                      />
                      <span className="products__b-count">
                        {inStockCount > 9 ? "9+" : inStockCount}
                      </span>
                      <AiOutlineMinus
                        onClick={() => {
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
                          });
                        }}
                        className="products__button-s-icons"
                      />
                    </span>
                  </div>
                ) : null}

                <PiShoppingCartLight
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
                    });
                  }}
                  className={`products__button-icons ${inStock ? "shopped" : ""}`}
                />
              </button>
            </div>
          ),
        )
      )}
    </div>
  );
};

export default ProductCard;
