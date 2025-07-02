import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get('http://localhost:5000/api/products/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data || err.message);
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Remove item from cart
  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/products/cart/remove',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data || err.message);
      alert('Failed to remove product from cart');
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 text-center">Your Cart</h2>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : cart.items.length === 0 ? (
        <div className="card p-4 text-center">
          <p>Your cart is currently empty.</p>
          <Button
            variant="dark"
            className="rounded-pill"
            onClick={() => navigate('/collection')}
          >
            Shop Now
          </Button>
        </div>
      ) : (
        <div>
          {cart.items.map((item) => (
            <Card key={item.productId?._id} className="mb-3 shadow-sm">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src={item.productId?.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.productId?.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
                  />
                  <div>
                    <h5>{item.productId?.name}</h5>
                    <p className="mb-1">Price: ${item.productId?.price?.toFixed(2)}</p>
                    <p className="mb-0">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="fw-bold">Subtotal: ${(item.productId?.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(item.productId?._id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
          <div className="text-end mt-4">
            <h4>Total: ${calculateTotal()}</h4>
            <Button
              variant="dark"
              className="rounded-pill mt-3"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;