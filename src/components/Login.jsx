import axios from "axios";
import React, {useState} from "react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {NavLink, useAsyncError} from "react-router-dom";
import {loginUser, mergeGuestCartToServer} from "../api/apiClient";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [eye, setEye] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    try {
      if(!input.email || !input.password) return  setError("Fill all inputs!") 
      const data = await loginUser(input.email, input.password);
      await mergeGuestCartToServer(data.user.id);
      window.location.href = "/"
    } catch (err) {
      setError("Invalid password or email!")   
    }
  };

  const handleChange = (e) => {
    setError("")
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login__form">
        <div className="login__form-box">
          <p className="login__subtitle">Login form</p>
          <input
            onChange={handleChange}
            placeholder="email"
            name="email"
            type="email"
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
          <NavLink to={"/register"} className={"login__link"}>create account</NavLink>
          {
            error ? <p className="login__error-message">{error}</p> : null
          }
          
        </div>
        <NavLink to={"/"}><IoCloseOutline className="login__close" /></NavLink> 
        <button className="login__button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
