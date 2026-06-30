import {MdOutlineStorefront} from "react-icons/md";
import {IoCart, IoHeartOutline} from "react-icons/io5";
import {NavLink, useAsyncError, useNavigate} from "react-router-dom";
import {useGetUser} from "../hooks/GET/useGetUser";
import {memo, use, useContext, useEffect, useState} from "react";
import Login from "./Login";
import {GlobalContext} from "../context/globalContext";
import {checkToken, checkUserId} from "../api/apiClient";
import {useGetCart} from "../hooks/GET/useGetCart";
import {useGetWishes} from "../hooks/GET/useGetWishes";
const Header = () => {
  const navigate = useNavigate();
  const {cartProducts, liked} = useContext(GlobalContext);
  const [userIdState, setUserIdState] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const res = await checkUserId();
      setUserIdState(res);
    };
    verify();
  }, []);

  const {
    data: cartData,
    isFetching,
    error: getErrorCarts,
  } = userIdState ? useGetCart(userIdState) : useGetCart();

  const {data: wishData} = userIdState
    ? useGetWishes(userIdState)
    : useGetWishes();

  const [wishes, setWishes] = useState();
  const filteredWishes = wishData?.filter((item) => item?.wish == true);

  useEffect(() => {
    if (tokenValid) {
      setWishes(filteredWishes?.length);
    }
  }, [filteredWishes]);

  useEffect(() => {
    if (!tokenValid) {
      setWishes(liked);
    }
  }, [liked]);

  const [tokenValid, setTokenValid] = useState(false);
  const verify = async () => {
    const result = await checkToken();
    setTokenValid(result);
  };

  useEffect(() => {
    verify();
  }, []);

  const [count, setCount] = useState();

  const filteredCart = cartData?.filter((item) => item?.inStock === true);
  useEffect(() => {
    if (tokenValid) {
      setCount(filteredCart?.length);
    }
  }, [filteredCart]);

  useEffect(() => {
    if (!tokenValid) {
      setCount(cartProducts);
    }
  }, [cartProducts]);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (input?.length) {
      const time = setTimeout(() => {
        navigate(`search?q=${input}`);
      }, 800);
      return () => clearTimeout(time);
    } else {
      navigate("/");
    }
  }, [input]);

  const checkOrderClick = () => {
    verify();
    if (tokenValid) {
      return "/orders";
    } else {
      return "/login";
    }
  };

  return (
    <header className=" container header">
      <nav className="navbar">
        <div className="navbar__box">
          <ul className="navbar__ul-list navbar__ul-list-left">
            <li
              onClick={() => navigate("/")}
              className="navbar-list navbar__link"
            >
              <MdOutlineStorefront className="icons main-icon" />
            </li>
            <input
              className="navbar-input"
              placeholder="Search bar"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value.trim());
              }}
            />
          </ul>
          <ul className="navbar__ul-list">
            <li>
              <NavLink className={"navbar__link"} to={"/"}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={"navbar__link"} to={`${checkOrderClick()}`}>
                Orders
              </NavLink>
            </li>
            {!tokenValid ? (
              <li>
                <NavLink className="navbar__link" to="/login">
                  Login
                </NavLink>
              </li>
            ) : (
              <li>
                <a
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="navbar__link"
                  href=""
                >
                  Log out
                </a>
              </li>
            )}

            <li
              className="navbar-list navbar__link"
              onClick={() => navigate("/wish")}
            >
              {wishes && (wishData?.length || liked) ? (
                <span className="navbar__wish">
                  {wishes <= 9 ? wishes : "9+"}
                </span>
              ) : null}
              <IoHeartOutline className="navbar__wish-icon" />
            </li>
            <li className="navbar-list">
              {count && (cartData?.length || cartProducts) ? (
                <span className="navbar__count">
                  {count <= 9 ? count : "9+"}
                </span>
              ) : null}

              <IoCart
                onClick={() => navigate("/cart")}
                className="icons cart-icon"
              />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default memo(Header);
