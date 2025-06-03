import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandingPage.css';

function LandingPage({ setAppState }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories] = useState([
    { id: 1, name: 'Electronics', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Clothing', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Home & Garden', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Books', image: 'https://via.placeholder.com/150' },
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = () => !!localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/products', {
          params: { adminAccess: 'child' },
        });
        setProducts(response.data.slice(0, 6));
      } catch (err) {
        throw new Error(`Failed to fetch products: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCart = async () => {
      if (isAuthenticated()) {
        try {
          const response = await axios.get('/api/cart', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setCart(response.data);
        } catch (err) {
          console.error('Failed to fetch cart:', err);
        }
      }
    };
    fetchProducts();
    fetchCart();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated()) {
      alert('Please log in to add items to your cart.');
      setAppState('login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/cart/add',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([...cart, response.data]);
      alert('Product added to cart!');
    } catch (err) {
      throw new Error(`Failed to add to cart: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get('/api/products/search', {
        params: { query: searchQuery, adminAccess: 'child' },
      });
      setProducts(response.data.slice(0, 6));
    } catch (err) {
      throw new Error(`Search failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeMore = () => setAppState('products');

  const placeholderProducts = [
    { id: 1, name: 'Laptop', price: 999.99, image: 'https://via.placeholder.com/200', addedBy: 'child' },
    { id: 2, name: 'T-Shirt', price: 19.99, image: 'https://via.placeholder.com/200', addedBy: 'child' },
    { id: 3, name: 'Headphones', price: 59.99, image: 'https://via.placeholder.com/200', addedBy: 'child' },
    { id: 4, name: 'Book', price: 14.99, image: 'https://via.placeholder.com/200', addedBy: 'child' },
    { id: 5, name: 'Lamp', price: 29.99, image: 'https://via.placeholder.com/200', addedBy: 'child' },
    { id: 6, name: 'Mouse', price: 24.99, image: 'https://via.placeholder.com/200', addedBy: 'child' },
  ];

  return (
    <div className="landing-container">
      <header className="header">
        <div className="logo">
          <h1>ShopEasy</h1>
        </div>
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <a href="#" className="nav-link">Home</a>
          <div className="dropdown">
            <a href="#" className="nav-link">Products ▼</a>
            <div className="dropdown-content">
              {categories.map((cat) => (
                <a key={cat.id} href={`#category-${cat.id}`}>
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
          <a href="#" className="nav-link">Discounts</a>
          <a href="#" className="nav-link">Contact</a>
          <a href="#" className="nav-link">About Us</a>
        </nav>
        <div className="header-actions">
          <button className="search-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            🔍
          </button>
          {isAuthenticated() ? (
            <button className="auth-btn" onClick={() => { localStorage.removeItem('token'); setCart([]); }}>
              Logout
            </button>
          ) : (
            <>
              <button className="auth-btn" onClick={() => setAppState('login')}>
                Login
              </button>
              <button className="auth-btn" onClick={() => setAppState('signup')}>
                Sign Up
              </button>
            </>
          )}
          <button className="cart-btn" onClick={() => setAppState('cart')}>
            🛒 {cart.length}
          </button>
        </div>
      </header>

      {isSearchOpen && (
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-submit">Search</button>
          </form>
        </div>
      )}

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card" id={`category-${cat.id}`}>
              <img src={cat.image} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="products">
        <h2>Featured Products</h2>
        {isLoading && <div className="loader">Loading...</div>}
        <div className="product-grid">
          {(products.length > 0 ? products : placeholderProducts).map((product) => (
            <div key={product.id || product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product.id || product._id)}
                disabled={!isAuthenticated() || isLoading}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <button className="see-more" onClick={handleSeeMore}>
          See More
        </button>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopEasy</h3>
            <p>Your one-stop shop for all your needs.</p>
          </div>
          <div className="footer-section">
            <h3>Links</h3>
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Discounts</a>
            <a href="#">Contact</a>
            <a href="#">About Us</a>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@shopeasy.com</p>
            <p>Phone: (123) 456-7890</p>
            <p>Address: 123 Shop St, City, Country</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>
        </div>
        <p className="footer-bottom">© 2025 ShopEasy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;