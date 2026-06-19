import {MdOutlineStorefront} from "react-icons/md";
import {IoCart, IoHeartOutline} from "react-icons/io5";
import {NavLink, useNavigate} from "react-router-dom";
import {useGetUser} from "../hooks/GET/useGetUser";
import {memo, use, useContext, useEffect, useState} from "react";
import Login from "./Login";
import {GlobalContext} from "../context/globalContext";
import {checkToken, checkUserId} from "../api/apiClient";
import {useGetCart} from "../hooks/GET/useGetCart";
const Header = () => {
  const navigate = useNavigate();
  const {cartProducts} = useContext(GlobalContext);
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
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const result = await checkToken();
      setTokenValid(result);
    };

    verify();
  }, []);

  const [count, setCount] = useState();


  const filteredCart = cartData?.filter(item => item?.inStock === true)
  useEffect(() => {
    if(tokenValid) {
      setCount(filteredCart?.length)
    }
  }, [filteredCart])

  useEffect(() => {
    if(!tokenValid) {
      setCount(cartProducts)
    }
  },[cartProducts])
  
  
  

  return (
    <header className=" container header">
      <nav className="navbar">
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
          />
        </ul>
        <ul className="navbar__ul-list">
          {!tokenValid ? (
            <li>
              <NavLink className="navbar__link" to="/login">
                Login
              </NavLink>
            </li>
          ) : (
            <li
              
            >
              <a onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="navbar__link" href="">
                Log out
              </a>
            </li>
          )}

          <li>
            <a onClick={() => navigate("/")} className="navbar__link" href="">
              Home
            </a>
          </li>
          {/* <li>
            <a className="navbar__link" href="#">
              About
            </a>
          </li>
          <li>
            <a className="navbar__link" href="#">
              Connect
            </a>
          </li> */}
          <li
            className="navbar-list navbar__link"
            onClick={() => navigate("/wish")}
          >
            <IoHeartOutline className="navbar__wish-icon" />
          </li>
          <li className="navbar-list">
            {count && (cartData?.length || cartProducts) ? (
              <span className="navbar__count">{count <= 9 ? count : "9+"}</span>
            ) : null}

            <IoCart
              onClick={() => navigate("/cart")}
              className="icons cart-icon"
            />
          </li>
        </ul>
      </nav>
      {/* <Login/> */}
    </header>
  );
};

export default memo(Header);
