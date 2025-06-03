import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductsPage.css';

function ProductsPage({ setAppState }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = () => !!localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/products', {
          params: { adminAccess: 'child' },
        });
        setProducts(response.data);
      } catch (err) {
        throw new Error(`Failed to fetch products: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated()) {
      alert('Please log in to add items to your cart.');
      setAppState('login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/cart/add',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product added to cart!');
    } catch (err) {
      throw new Error(`Failed to add to cart: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="products-container">
      <section className="products">
        <h2>All Products</h2>
        {isLoading && <div className="loader">Loading...</div>}
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product._id)}
                disabled={!isAuthenticated() || isLoading}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;