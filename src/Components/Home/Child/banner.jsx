import React from "react";
import './banner.css';

const Banner = ({bannerImg,paraGraph,title}) => {
  return (
   <div
  className="bannerMain relative   flex items-center justify-start text-left text-white banner1"
 style={{
    backgroundImage: `url(${bannerImg})`,
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "80vh",
  }}
>
  {/* Overlay */}
  <div className="darkkkk">

  {/* Banner Content */}
  <div className="cont col-4 p-5 relative z-10 max-w-xl">
    <h1 className="text-5xl mt-5 font-bold mb-4">{title}</h1>
    <p className="text-lg text1 ">
     {paraGraph}
    </p>             
    <button className="mt-6 px-6 py-3 shopBtn">
      Shop Now
    </button>
  </div>
  </div>
</div>

  );
};

export default Banner;
