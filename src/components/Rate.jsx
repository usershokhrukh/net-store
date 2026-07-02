import React, {useState} from "react";
import {FaRegStar, FaStar} from "react-icons/fa6";
import {useNavigate, useParams} from "react-router-dom";
import {useGetOrderById} from "../hooks/GET/useGetOrderById";
import {usePostRate} from "../hooks/POST/usePostRate";
import {toast} from "react-toastify";
import {IoCloseOutline} from "react-icons/io5";
import {useDeleteUserOrder} from "../hooks/DELETE/useDeleteUserOrder";

const Rate = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [stars, setStars] = useState([
    {
      status: false,
      id: 1,
    },
    {
      status: false,
      id: 2,
    },
    {
      status: false,
      id: 3,
    },
    {
      status: false,
      id: 4,
    },
    {
      status: false,
      id: 5,
    },
  ]);

  const [rate, setRate] = useState({
    star: null,
    comment: null,
  });

  const handleStar = (id) => {
    let starMake = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= id) {
        starMake.push({
          status: true,
          id: i,
        });
      } else {
        starMake.push({
          status: false,
          id: i,
        });
      }
    }
    setStars(starMake);
    const filterStar = starMake.filter((item) => item.status == true)?.length;
    setRate({...rate, star: filterStar});
  };

  const handleComment = (e) => {
    setRate({...rate, comment: e.target.value.trim()});
  };

  const {data} = id ? useGetOrderById(id) : useGetOrderById(null);
  const {mutate} = usePostRate();
  const {mutate: deleteOrders} = useDeleteUserOrder();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (data?.id) {
      try {
        if (rate.star && rate.comment) {
          mutate({...data, ...rate, id: null});
          deleteOrders(data?.id);
          toast.success("Thank for your rate!");
          navigate("/orders");
        } else {
          setError("Please rate and give comment!");
        }
      } catch (err) {
        toast.error("Error acquired while rating!");
        navigate("/orders");
        console.log(error);
      }
    }else {
      toast.error("Something went wrong!")
      navigate("/orders")
    }
  };

  // console.log(rate);

  const handleModal = (e) => {
    if (e.target.id == "in") {
      navigate("/orders");
    }
  };

  return (
    <div id="in" onClick={handleModal} className="rate">
      <form id="out" onSubmit={handleSubmit} className="rate__form">
        <span onClick={() => navigate("/orders")} className="rate__close">
          <IoCloseOutline className="rate__close-i" />
        </span>
        <p className="rate__title">Your rate & comment</p>
        <div id="out" className="rate__form-top">
          {stars?.map(({status, id}) => {
            if (status) {
              return (
                <FaStar
                  onClick={() => handleStar(id)}
                  id="out"
                  className="rate__ft-stars"
                  key={`${id} ${status} fill`}
                />
              );
            } else {
              return (
                <FaRegStar
                  onClick={() => handleStar(id)}
                  id="out"
                  className="rate__ft-stars"
                  key={`${id} ${status} out`}
                />
              );
            }
          })}
        </div>
        <textarea
          required
          spellCheck={false}
          className="rate__textarea"
          name=""
          id="out"
          placeholder="Write your comment"
          onChange={handleComment}
        ></textarea>
        {error?.length ? <p className="payment__error">{error}</p> : null}

        <button id="out" type="submit" className="rate__button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Rate;
