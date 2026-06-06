import React from "react";
import {MdOutlineStorefront} from "react-icons/md";

const Footer = () => {
  return (
    <div className="footer wrapper">
      <ul className="navbar__ul-list">
        <li className="navbar-list">
          <MdOutlineStorefront className="icons main-icon" />
        </li>
        <li className="footer__text">
          Net store copyright
        </li>
        <li>
          <a className="navbar__link" href="">
            Home
          </a>
        </li>
      </ul>
      <p className="footer__text">2026</p>
    </div>
  );
};

export default Footer;
