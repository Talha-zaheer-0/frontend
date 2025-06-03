import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';

function CartPage({ setAppState }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = () => !!localStorage.getItem('token');

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated()) {
        setAppState('login');
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCart(response.data);
      } catch (err) {
        throw new Error(`Failed to fetch cart: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="cart-container">
      <section className="cart">
        <h2>Your Cart</h2>
        {isLoading && <div className="loader">Loading...</div>}
        {cart.length === 0 && !isLoading && <p>Your cart is empty.</p>}
        <div className="cart-grid">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.productId.image} alt={item.productId.name} />
              <div className="cart-item-details">
                <h3>{item.productId.name}</h3>
                <p>${item.productId.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CartPage;