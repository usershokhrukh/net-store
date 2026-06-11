import {MdOutlineStorefront} from "react-icons/md";
import {IoCart, IoHeartOutline} from "react-icons/io5";
import {NavLink, useNavigate} from "react-router-dom";
import {useGetUser} from "../hooks/GET/useGetUser";
import {memo, useContext, useEffect, useState} from "react";
import Login from "./Login";
import {GlobalContext} from "../context/globalContext";
import {checkToken} from "../api/apiClient";
import {useGetCart} from "../hooks/GET/useGetCart";
const Header = () => {
  const navigate = useNavigate();
  const {cartProducts} = useContext(GlobalContext);
  const {data: cartData, isFetching, error: getErrorCarts} = useGetCart();
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const result = await checkToken();
      setTokenValid(result);
    };

    verify();
  }, []);

  return (
    <header className=" container header">
      <nav className="navbar">
        <ul className="navbar__ul-list navbar__ul-list-left">
          <li className="navbar-list">
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
          ) : <li onClick={() => {
            localStorage.clear();
            window.location.reload();
          }} className="navbar__link">
                Log out
            </li>}

          <li>
            <a onClick={() => navigate("/")} className="navbar__link" href="">
              Home
            </a>
          </li>
          <li>
            <a className="navbar__link" href="#">
              About
            </a>
          </li>
          <li>
            <a className="navbar__link" href="#">
              Connect
            </a>
          </li>
          <li className="navbar-list">
            <IoHeartOutline className="navbar__wish-icon" />
          </li>
          <li className="navbar-list">
            {cartProducts && !tokenValid ? (
              <span className="navbar__count">
                {cartProducts <= 9 ? cartProducts : "9+"}
              </span>
            ) : tokenValid ? (
              <>
               {
                cartData?.length > 0 ?<span className="navbar__count">{}
                {cartData?.length <= 9 ? cartData?.length : "9+"}
              </span> : null
               }
              </>
                

              
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
