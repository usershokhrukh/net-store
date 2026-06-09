import {IoHeartOutline} from "react-icons/io5";
import {LuEye, LuTrash} from "react-icons/lu";
import {MdError, MdStarRate} from "react-icons/md";
import {PiShoppingCartLight} from "react-icons/pi";
import {useGetProducts} from "../hooks/GET/useGetProducts";
import {GoPlus} from "react-icons/go";
import {AiOutlineMinus} from "react-icons/ai";
import {usePutProduct} from "../hooks/PUT/usePutProduct";
import {useDeleteCart} from "../hooks/DELETE/useDeleteCart";
import {usePutCart} from "../hooks/PUT/usePutCart";
import {usePostCart} from "../hooks/POST/usePostCart";
import {useGetUser} from "../hooks/GET/useGetUser";
import {usePutUser} from "../hooks/PUT/usePutUser";
import {useGetCart} from "../hooks/GET/useGetCart";
import {useEffect} from "react";

const ProductCard = () => {
  const {data, isFetching, error: getErrorProducts} = useGetProducts();
  const {mutate: putMutateProduct, error: putErrorProduct} = usePutProduct();
  const {mutate: deleteCartMutate, error: deleteErrorCart} = useDeleteCart();
  const {mutate: postMutateCart, error: postErrorCart} = usePostCart();
  const {mutate: putMutateCart, error: putErrorCart} = usePutCart();
  const {data: userData, error: getUserError} = useGetUser();
  const {mutate: putMutateUser, error: putErrorUser} = usePutUser();
  const {data: cartData, error: getErrorCart} = useGetCart();

  useEffect(() => {
    putMutateUser({
      ...userData,
      cartProducts: cartData?.length || 0,
    });
  }, [cartData]);

  const handlePlus = (data) => {
    const currentId = data.id;
    const updaterCount = data.inStockCount + 1;
    putMutateProduct([currentId, {...data, inStockCount: updaterCount}]);
    putMutateCart([
      data?.secondaryId,
      {
        ...data,
        inStockCount: updaterCount,
        secondaryId: currentId,
      },
    ]);
  };

  const handleMinus = (data) => {
    const currentId = data.id;
    if (data.inStockCount - 1 >= 1) {
      const updaterCount = data.inStockCount - 1;
      putMutateProduct([
        currentId,
        {
          ...data,
          inStockCount: updaterCount,
        },
      ]);

      putMutateCart([
        data?.secondaryId,
        {
          ...data,
          inStockCount: updaterCount,
          secondaryId: currentId,
        },
      ]);
    }
  };

  const handleShop = (e, data) => {
    e.preventDefault();
    if (!e.target.className.baseVal.includes("shopped")) {
      const currentId = data.id;
      putMutateProduct([
        currentId,
        {
          ...data,
          inStock: true,
          inStockCount: 1,
          inShop: true,
        },
      ]);
      postMutateCart(
        {
          ...data,
          inStock: true,
          inStockCount: 1,
          secondaryId: currentId,
          inShop: true,
        },
        {
          onSuccess: async (serverResponse) => {
            const newCartId = serverResponse.id;
            putMutateProduct([
              serverResponse?.secondaryId,
              {
                ...serverResponse,
                secondaryId: newCartId,
              },
            ]);
          },
        },
      );

      let className = e.target.className.baseVal;
      className = className.concat(" shopped");
      e.target.className.baseVal = className;
    }
  };

  const handleTrash = (data) => {
    const currentId = data.id;
    putMutateProduct([
      currentId,
      {
        ...data,
        inStock: false,
        inStockCount: 0,
        secondaryId: "",
        inShop: false,
      },
    ]);
    deleteCartMutate(data?.secondaryId);
  };

  const error =
    getErrorProducts?.message ||
    putErrorProduct?.message ||
    deleteErrorCart?.message ||
    postErrorCart?.message ||
    putErrorCart?.message ||
    getUserError?.message ||
    putErrorUser?.message;

  if (isFetching) {
    return (
      <div className="products container">
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
        <div className="loading-cart"></div>
      </div>
    );
  } else {
    return (
      <div className="products container">
        {error ? (
          <div className="error-box">
            <p className="error-text">{error}</p>
            <MdError className="error-icon" />
          </div>
        ) : null}
        {data?.map(
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
            secondaryId,
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
                        handleTrash({
                          id: Number(id) || id,
                          inStock,
                          inStockCount,
                          image,
                          oldPrice,
                          price,
                          rating,
                          reviewCount,
                          title,
                          categoryId,
                          secondaryId: Number(secondaryId) || secondaryId,
                          inShop,
                        });
                      }}
                      className="products__button-s-icons"
                    />
                    <span className="products__b-center">
                      <GoPlus
                        onClick={() => {
                          handlePlus({
                            id: Number(id) || id,
                            inStock,
                            inStockCount,
                            image,
                            oldPrice,
                            price,
                            rating,
                            reviewCount,
                            title,
                            categoryId,
                            secondaryId: Number(secondaryId) || secondaryId,
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
                          handleMinus({
                            id: Number(id) || id,
                            inStock,
                            inStockCount,
                            image,
                            oldPrice,
                            price,
                            rating,
                            reviewCount,
                            title,
                            categoryId,
                            secondaryId: Number(secondaryId) || secondaryId,
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
                      secondaryId: Number(secondaryId) || secondaryId,
                      inShop,
                    });
                  }}
                  className={`products__button-icons ${inStock ? "shopped" : ""}`}
                />
              </button>
            </div>
          ),
        )}
      </div>
    );
  }
};

export default ProductCard;
