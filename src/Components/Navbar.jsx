import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">

        <Link className="navbar-brand fw-bold fs-4" to="/">
          {/* Optional: Logo or brand name */}
        </Link>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-4 fw-bold">
  <li className="nav-item"><Link className="nav-link active" to="/">HOME</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/collection">COLLECTION</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/about">ABOUT</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/contact">CONTACT</Link></li>
  
</ul>

        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Icons */}
          <span><i className="bi bi-search fs-5"></i></span>
          <span><i className="bi bi-person fs-5"></i></span>
          <span className="position-relative">
            <i className="bi bi-bag fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {/* Cart count (if any) */}
            </span>
          </span>

          {/* Buttons */}
          <Link to="/login" className="btn btn-outline-dark rounded-pill px-3">Login</Link>
          <Link to="/signup" className="btn btn-dark rounded-pill px-3">Signup</Link>
<Link to="/admin" className="btn btn-outline-dark btn-sm rounded-pill px-3  py-2 fw-semibold">
    Admin Panel
  </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;










