import axios from "axios";
import React, {useState} from "react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {NavLink, useAsyncError} from "react-router-dom";
import {
  loginUser,
  mergeGuestCartToServer,
  registerUser,
} from "../api/apiClient";
import { IoCloseOutline } from "react-icons/io5";

const Register = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [eye, setEye] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(input.email, input.password, input.name);
      await mergeGuestCartToServer(data.user.id);

      window.location.href = "/";
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login__form">
        <div className="login__form-box">
          <p className="login__subtitle">Register form</p>
          <input
            onChange={handleChange}
            placeholder="email"
            name="email"
            type="email"
            className="login__input"
          />
          <input
            onChange={handleChange}
            placeholder="name"
            name="name"
            type="text"
            className="login__input"
          />
          <div className="login__input-box">
            <input
              onChange={handleChange}
              placeholder="password"
              name="password"
              className="login__input"
              type={`${eye ? "text" : "password"}`}
              id="password"
            />
            <label
              onClick={() => setEye(!eye)}
              className="login__label"
              htmlFor="password"
            >
              {eye ? (
                <IoMdEye className="login__icons" />
              ) : (
                <IoMdEyeOff className="login__icons" />
              )}
            </label>
          </div>
          <NavLink to={"/login"} className={"login__link"}>
            I already have an account
          </NavLink>
        </div>
        <NavLink to={"/"}>
          <IoCloseOutline className="login__close" />
        </NavLink>

        <button className="login__button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
