import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import style from './Navbar.module.css';

const Navbar = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        const navbarTop = navbarRef.current.getBoundingClientRect().top;
        setIsFixed(navbarTop <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    navigate(`/collection?category=${encodeURIComponent(category)}`);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (loading) return null;

  return (
    <nav ref={navbarRef} className={`navbar navbar-expand-lg bg-white shadow-sm ${isFixed ? style.fixed : ''}`}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <img className={style.logo} src="/vite.jpg" alt="Forever Buy Logo" />
        </Link>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-4 fw-bold">
            <li className="nav-item">
              <Link className="nav-link active" to="/">HOME</Link>
            </li>
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                COLLECTION
              </span>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick('Men')}>
                    Men
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick('Women')}>
                    Women
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick('Kids')}>
                    Kids
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">ABOUT</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">CONTACT</Link>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span><i className="bi bi-search fs-5"></i></span>

          {user ? (
            <>
              <Link to="/profile" className="profile-circle" title={user.name} style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ff6a00',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '16px'
              }}>
                {getInitials(user.name)}
              </Link>
              <Link to="/cart">
                {!user.isAdmin &&
                  <button data-quantity="0" className={style["btn-cart"]}>
                    <svg className={style["icon-cart"]} viewBox="0 0 24.38 30.52" height="30.52" width="24.38" xmlns="http://www.w3.org/2000/svg">
                      <title>icon-cart</title>
                      <path transform="translate(-3.62 -0.85)" d="M28,27.3,26.24,7.51a.75.75,0,0,0-.76-.69h-3.7a6,6,0,0,0-12,0H6.13a.76.76,0,0,0-.76.69L3.62,27.3v.07a4.29,4.29,0,0,0,4.52,4H23.48a4.29,4.29,0,0,0,4.52-4ZM15.81,2.37a4.47,4.47,0,0,1,4.46,4.45H11.35a4.47,4.47,0,0,1,4.46-4.45Zm7.67,27.48H8.13a2.79,2.79,0,0,1-3-2.45L6.83,8.34h3V11a.76.76,0,0,0,1.52,0V8.34h8.92V11a.76.76,0,0,0,1.52,0V8.34h3L26.48,27.4a2.79,2.79,0,0,1-3,2.44Zm0,0"/>
                    </svg>
                    <span className={style.quantity}>0</span>
                  </button>}
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="btn px-3">
                  <h3>Admin</h3>
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline-dark rounded-pill">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-dark rounded-pill">Login</Link>
              <Link to="/signup" className="btn btn-dark rounded-pill">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;