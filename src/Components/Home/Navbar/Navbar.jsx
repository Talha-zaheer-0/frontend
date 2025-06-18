import React from 'react';
import { Link } from 'react-router-dom';
import style from './Navbar.module.css';


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">

        <Link className="navbar-brand fw-bold fs-4" to="/"><img className="w-25" src="../../../../../../public/vite.jpg" alt="" /></Link>

        <div className="collapse navbar-collapse justify-content-center me-5" id="navbarNav">
          <ul className="navbar-nav gap-4 fw-bold">
            <li className="nav-item"><Link className="nav-link active " to="/">HOME</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/collection">COLLECTION</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">ABOUT</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">CONTACT</Link></li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span><i className="bi bi-search fs-5"></i></span>
          <span><i className="bi bi-person fs-5"></i></span>
          <span className="position-relative">
            <i className="bi bi-bag fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {/* Cart count */}
            </span>
          </span>
            


          <Link to="/login" className="btn btn-outline-dark rounded-pill px-3 ms-5">Login</Link>
          <Link to="/signup" className="btn btn-dark rounded-pill px-3 me-5">Signup</Link>

            <Link to="/login">         
<div className={style.main}>
  <div className={style.buttons}>
    <div className={style.button_pair}>
      <div className={style.btn}>
        <button className={style.button3}>
          <span className={style.button_text}>Admin</span>
        </button>
      </div>
    </div>
  </div>
</div> </Link>
          {/* ✅ Fixed Button */}
        
        </div>
      </div>
    </nav>
  );
};

export default Navbar;











