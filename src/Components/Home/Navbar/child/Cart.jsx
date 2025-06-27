import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Your Cart</h2>
      <div className="card p-4">
        <p>Your cart is currently empty.</p>
        <button
          className="btn btn-dark rounded-pill mt-3"
          onClick={() => navigate('/collection')}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Cart;