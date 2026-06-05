import React from 'react'
import Header from './components/Header'
import "./block/general.scss";
import "./block/navbar.scss";
import "./block/banners.scss";
import "./block/category.scss";
import "./block/products.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
const App = () => {
  return (
    <div className='wrapper'>
      <Header/>
      <Categories/>
      <ProductCard/>
      <Footer/>
    </div>
  )
}

export default App