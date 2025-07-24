import React from "react";
import { Link } from "react-router-dom";
import './banner.css';

const Banner = ({ bannerImg, paraGraph, title }) => {
  return (
    <div
      className="bannerMain relative flex items-center justify-start text-left text-white banner1"
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: "80vh",
      }}
    >
      {/* Overlay */}
<div className="darkkkk" />
<div className="cont p-5 relative z-20 max-w-xl">
  <h1 className="text-5xl mt-5 font-bold mb-4">{title}</h1>
  <p className="text-lg text1">{paraGraph}</p>
  <Link to="/collection" className="mt-6 px-6 py-3 shopBtn">
    Shop Now
  </Link>
</div>

    </div>
  );
};

export default Banner;