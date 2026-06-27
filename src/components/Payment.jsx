import React, {useContext, useEffect, useState} from "react";
import {useGetCart} from "../hooks/GET/useGetCart";
import {checkUserId} from "../api/apiClient";
import {Cost} from "../context/cost";
import {useDeleteCart} from "../hooks/DELETE/useDeleteCart";
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
  const [userIdState, setUserIdState] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const res = await checkUserId();
      setUserIdState(res);
    };
    verify();
  }, []);
  const {data} = userIdState ? useGetCart(userIdState) : useGetCart();
  const {mutate} = useDeleteCart();
  const {cost} = useContext(Cost);
  const navigate = useNavigate();

  const filter = data?.filter((item) => item?.inShop == true);
  const [method, setMethod] = useState("");
  const [orderStatus, setOrderStatus] = useState({
    products: data,
    type: "",
    phone: "",
    cardNumber: "",
    cardDate: "",
    cardCVV: "",
  });

  const changeMethod = (e) => {
    setMethod(e.target.id);
    setOrderStatus({...orderStatus, [e.target.name]: e.target.id});
  };

  const changeStatus = (e) => {
    setOrderStatus({...orderStatus, [e.target.name]: e.target.value.trim()});
  };

  useEffect(() => {
    setOrderStatus({...orderStatus, products: data});
  }, [data]);

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setError("");
      for (const item of orderStatus?.products) {
        mutate(item?.id);
        navigate("/")
      }
      toast.success("You are successfully ordered!")
    } catch (err) {      
      setError("Error acquired while ordering!")
    }
  };

  return (
    <div className="payment">
      <form onSubmit={handleSubmit} className="payment__form">
        <div className="buy-modal__top">
          <span
            onClick={() => navigate("/cart/shipping")}
            className="buy-modal__cancel"
          >
            <svg
              className="buy-modal__cancel-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.0003 13.0001L22.0004 11.0002L5.82845 11.0002L9.77817 7.05044L8.36396 5.63623L2 12.0002L8.36396 18.3642L9.77817 16.9499L5.8284 13.0002L22.0003 13.0001Z"></path>
            </svg>
          </span>
          <h2 className="buy-modal__title">Payment</h2>
        </div>
        {error?.length ? <p className="payment__error">{error}</p> : null}

        <div className="payment__boxes">
          <label className="buy-modal__section-title" htmlFor="phone">
            Your phone number:{" "}
          </label>
          <input
            onChange={changeStatus}
            required
            className="payment__input"
            type="number"
            id="phone"
            placeholder="required"
            name="phone"
          />
        </div>
        <div className="payment__type-box">
          <h2 className="buy-modal__section-title">Choose method</h2>
          <div className="payment__type-item">
            <p className="payment__type-text">Manual in destination</p>
            <input
              required
              onChange={changeMethod}
              className="payment__type-inputs"
              type="radio"
              name="type"
              id="manual"
            />
          </div>
          <div className="payment__type-item">
            <p className="payment__type-text">Online Card <span className="payment__type-svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.0049 9.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V9.99979H22.0049ZM22.0049 7.99979H2.00488V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V7.99979ZM15.0049 15.9998V17.9998H19.0049V15.9998H15.0049Z"></path></svg></span></p>
            <input
              required
              onChange={changeMethod}
              className="payment__type-inputs"
              type="radio"
              name="type"
              id="card"
            />
          </div>
        </div>
        {method == "card" ? (
          <div className="payment__boxes payment__choose">
            <h2 className="buy-modal__section-title">Payment details</h2>
            <input
              onChange={changeStatus}
              required
              className="payment__input"
              type="number"
              name="cardNumber"
              id=""
              placeholder="Card Number"
            />
            <div className="payment__input-boxes">
              <input
                onChange={changeStatus}
                required
                className="payment__input"
                type="date"
                name="cardDate"
                id=""
                placeholder="mm-yyyy"
              />
              <input
                required
                onChange={changeStatus}
                className="payment__input"
                type="number"
                name="cardCVV"
                placeholder="CVV"
              />
            </div>
          </div>
        ) : null}

        <button
          style={{alignSelf: "auto", width: "100%", maxWidth: "none"}}
          className="buy-modal__confirm"
        >
          Order ${cost ? cost : 0}
        </button>
      </form>
    </div>
  );
};

export default Payment;
