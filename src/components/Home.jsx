import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import Categories from "./Categories";
import { useLocation, useNavigate } from "react-router-dom";
import Swiper from "./Swiper";
const Home = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  useEffect(() => {
    if(!(location == "/login" || location == "/register")) {
      navigate("/")
    }
  }, []);
  return (
    <div className="container header">
      <Swiper/>
      <Categories />
      <ProductCard />
    </div>
  );
};

export default Home;
