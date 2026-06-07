import React, { useEffect } from 'react'
import Header from './components/Header'
import "./block/general.scss";
import "./block/navbar.scss";
import "./block/banners.scss";
import "./block/category.scss";
import "./block/products.scss";
import "./block/cart.scss"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from './components/Footer';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
const App = () => {
  return (
    <div className='wrapper app'>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='*' element={<Home/>}/>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App