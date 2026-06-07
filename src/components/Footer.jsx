import React from "react";
import {MdOutlineStorefront} from "react-icons/md";

const Footer = () => {
  return (
    <div className="footer wrapper">
      <div className="footer__box container">
        <ul className="navbar__ul-list">
        <li className="navbar-list">
          <MdOutlineStorefront className="icons main-icon" />
        </li>
        <li className="footer__text">
          Net store copyright
        </li>
        <li>
          <a className="footer__text" href="">
            Home
          </a>
        </li>
      </ul>
      <p className="footer__text">2026</p>
      </div>
      
    </div>
  );
};

export default Footer;
