import React from 'react';
// import SaleCarousel from './Child/SaleCarousel';
import HotProduct from './Child/HotProduct';
import FeaturedProduct from './Child/FeaturedProduct';
import Men from './Child/Men';
import Kid from './Child/Kid';
import Women from './Child/Women';
import Sales from './Child/Sale';

const Home = () => {
  return (
    <div className="home-container">
      {/* <SaleCarousel /> */}
      <Sales />
      <HotProduct />
      <FeaturedProduct />
      <Men />
      <Women />
      <Kid />
    </div>
  );
};

export default Home;