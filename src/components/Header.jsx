import {MdOutlineStorefront} from "react-icons/md";
import {IoCart, IoHeartOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();

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
          <li>
            <a onClick={() => navigate("/")} className="navbar__link" href="">
              Home
            </a>
          </li>
          <li>
            <a className="navbar__link" href="">
              About
            </a>
          </li>
          <li>
            <a className="navbar__link" href="">
              Connect
            </a>
          </li>
          <li className="navbar-list">
            <IoHeartOutline className="navbar__wish-icon" />
          </li>
          <li className="navbar-list">
            <span className="navbar__count">8</span>
            <IoCart
              onClick={() => navigate("/cart")}
              className="icons cart-icon"
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
