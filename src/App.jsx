import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import "./block/general.scss";
import "./block/navbar.scss";
import "./block/banners.scss";
import "./block/category.scss";
import "./block/products.scss";
import "./block/cart.scss";
import "./block/login.scss";
import "./block/view.scss";
import "./block/payment.scss";
import "./block/orders.scss";
import "./block/buy-modal.scss";
import "./block/rate.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./components/Footer";
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import {GlobalContext} from "./context/globalContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ItemView from "./components/ItemView";
import Wish from "./components/Wish";
import Filter from "./components/Filter";
import Search from "./components/Search";
import BuyModal from "./components/BuyModal";
import Payment from "./components/Payment";
import {Cost} from "./context/cost";
import Orders from "./components/Orders";
import Rate from "./components/Rate";
const App = () => {
  const [localData, setLocalData] = useState(() => {
    return JSON.parse(localStorage.getItem("userCartProducts")) || [];
  });

  const cartProducts =
    localData?.filter((item) => item.inStock == true)?.length || 0;
  const liked = localData?.filter((item) => item.wish == true)?.length || 0;

  const blockMoney = localData?.reduce(
    (total, item) =>
      total + item?.price * item?.inStockCount * Number(item?.inShop),
    0,
  );
  useEffect(() => {
    localStorage.setItem("userUI", JSON.stringify({cartProducts, blockMoney}));
  }, [cartProducts, blockMoney]);

  const [cost, setCost] = useState();
  return (
    <div className="wrapper app">
      <GlobalContext.Provider
        value={{cartProducts, blockMoney, setLocalData, liked}}
      >
        <Cost.Provider value={{cost, setCost}}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
            <Route path="/cart" element={<Cart />}>
              <Route path="/cart/shipping" element={<BuyModal />} />
              <Route path="/cart/payment" element={<Payment />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ItemView />} />
            <Route path="/wish" element={<Wish />} />
            <Route path="/filter/:data" element={<Filter />}/>
            <Route path="/search" element={<Search />}/>
            <Route path="/orders" element={<Orders/>}>
              <Route path="/orders/rate/:id" element={<Rate/>}/>
            </Route>
            <Route path="/cart/payment" element={<Payment />} />
          </Routes>
          <div
            style={{
              flexGrow: 1,
            }}
          ></div>
          <Footer />
        </Cost.Provider>
      </GlobalContext.Provider>
    </div>
  );
};

export default App;
