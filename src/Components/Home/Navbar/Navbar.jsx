import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import style from './Navbar.module.css';

const Navbar = ({ socket }) => {
  const { lowestPrice, user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const isHomePage = location.pathname === '/';

  const fetchCart = async () => {
    if (!user || user.isAdmin) {
      console.log('No user or user is admin, setting cartItemCount to 0');
      setCartItemCount(0);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        setCartItemCount(0);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/products/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Cart response:', response.data);
      const cart = response.data.cart || { items: [] };
      const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
      console.log('Calculated cartItemCount:', itemCount);
      setCartItemCount(itemCount);
    } catch (err) {
      console.error('Error fetching cart:', err.response?.data || err.message);
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener('authChange', fetchCart);

    const userId = localStorage.getItem('userId');
    if (userId && socket) {
      socket.on('cartUpdate', (updatedCart) => {
        console.log('Socket.IO cart update received:', updatedCart);
        const itemCount = updatedCart.items.reduce((total, item) => total + item.quantity, 0);
        console.log('Socket.IO calculated cartItemCount:', itemCount);
        setCartItemCount(itemCount);
      });
    }

    return () => {
      window.removeEventListener('authChange', fetchCart);
      if (userId && socket) {
        socket.off('cartUpdate');
      }
    };
  }, [user, socket]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setCartItemCount(0);
    fetchCart();
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
    <nav ref={navbarRef} className={`navbar navbar-expand-lg ${style.navbar} ${isHomePage ? `${style.transparent} ${style.overlay}` : ''}`}>
      <div className={`container d-flex justify-content-between align-items-center ${style.container}`}>
        <Link className={`navbar-brand fw-bold fs-4 ${style['navbar-brand']}`} to="/">
          <img className={style.logo} src="/logo.png" alt="Forever Buy Logo" />
          <img className={style.logo1} src="/logo1.png" alt="logo-card" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-center ${style['navbar-collapse']}`} id="navbarNav">
          <ul className={`navbar-nav gap-4 fw-semibold ${style['navbar-nav']}`}>
            <li className="nav-item">
              <Link className={`nav-link ${style['nav-link']}`} to="/"><span className={style.btn1}>Home</span></Link>
            </li>
            <li className="nav-item dropdown">
              <span
                className={`nav-link dropdown-toggle ${style['dropdown-toggle']}`}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className={style.btn1}>collection</span>
              </span>
              <ul className={`dropdown-menu ${style['dropdown-menu']}`}>
                <li>
                  <button className={`dropdown-item ${style['dropdown-item']}`} onClick={() => handleCategoryClick('Men')}>
                    Men
                  </button>
                </li>
                <li>
                  <button className={`dropdown-item ${style['dropdown-item']}`} onClick={() => handleCategoryClick('Women')}>
                    Women
                  </button>
                </li>
                <li>
                  <button className={`dropdown-item ${style['dropdown-item']}`} onClick={() => handleCategoryClick('Kids')}>
                    Kids
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${style['nav-link']}`} to="/about"><span className={style.btn1}>About</span></Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${style['nav-link']}`} to="/contact"><span className={style.btn1}>Contact</span></Link>
            </li>
          </ul>
        </div>

        <div className={`d-flex align-items-center gap-3 ${style['navbar-actions']}`}>
          <span className={style['search-icon']}><i className="bi bi-search fs-5"></i></span>

          {user ? (
            <>
              {console.log('User:', user, 'Cart Item Count:', cartItemCount)}
              <Link to="/profile" className={`${style['profile-circle']}`} title={user.name}>
                <span className={style['profile-initials']}>{getInitials(user.name)}</span>
              </Link>
              <Link to="/cart">
                {!user.isAdmin && (
                  <button data-quantity={cartItemCount} className={style['btn-cart']}>
                    <svg className={style['icon-cart']} viewBox="0 0 24.38 30.52" height="30.52" width="24.38" xmlns="http://www.w3.org/2000/svg">
                      <title>icon-cart</title>
                      <path
                        transform="translate(-3.62 -0.85)"
                        d="M28,27.3,26.24,7.51a.75.75,0,0,0-.76-.69h-3.7a6,6,0,0,0-12,0H6.13a.76.76,0,0,0-.76.69L3.62,27.3v.07a4.29,4.29,0,0,0,4.52,4H23.48a4.29,4.29,0,0,0,4.52-4ZM15.81,2.37a4.47,4.47,0,0,1,4.46,4.45H11.35a4.47,4.47,0,0,1,4.46-4.45Zm7.67,27.48H8.13a2.79,2.79,0,0,1-3-2.45L6.83,8.34h3V11a.76.76,0,0,0,1.52,0V8.34h8.92V11a.76.76,0,0,0,1.52,0V8.34h3L26.48,27.4a2.79,2.79,0,0,1-3,2.44Zm0,0"
                      />
                    </svg>
                    {/* Temporary span to debug cartItemCount */}
                    {cartItemCount > 0 && (
                      <span className={style['debug-cart-count']}>{cartItemCount}</span>
                    )}
                  </button>
                )}
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className={`btn ${style['btn-admin']}`}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className={`btn btn-outline-dark rounded-pill ${style['btn-logout']}`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`btn btn-outline-dark rounded-pill ${style['btn-login']}`}>Login</Link>
              <Link to="/signup" className={`btn btn-dark rounded-pill ${style['btn-signup']}`}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;