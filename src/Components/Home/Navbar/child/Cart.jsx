import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Notification from '../../Notification';

const Cart = ({ socket }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

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
        setCart(res.data.cart || { items: [] });
        const initialSelected = {};
        res.data.cart.items.forEach(item => {
          initialSelected[item.productId?._id] = true;
        });
        setSelectedItems(initialSelected);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data || err.message);
        setNotificationMessage('Failed to fetch cart. Please try again.');
        setShowNotification(true);
        setLoading(false);
      }
    };
    fetchCart();

    const userId = localStorage.getItem('userId');
    if (userId && socket) {
      socket.on('cartUpdate', (updatedCart) => {
        console.log('Received cart update via Socket.IO:', updatedCart);
        setCart(updatedCart || { items: [] });
        const updatedSelected = {};
        updatedCart.items.forEach(item => {
          updatedSelected[item.productId?._id] = true;
        });
        setSelectedItems(updatedSelected);
      });

      socket.on('orderUpdate', (order) => {
        console.log('Received order update via Socket.IO:', order);
        if (order) {
          setNotificationMessage(`Order ${order.orderId} created or updated!`);
          setShowNotification(true);
          navigate('/order-confirmation');
        } else {
          setNotificationMessage('An order was deleted or completed.');
          setShowNotification(true);
          fetchCart();
        }
      });
    }

    return () => {
      if (userId && socket) {
        socket.off('cartUpdate');
        socket.off('orderUpdate');
      }
    };
  }, [navigate, socket]);

  const handleCheckboxChange = (productId) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleQuantityChange = async (productId, currentQuantity, direction) => {
    try {
      const newQuantity = direction === 'increase' ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/products/cart/add',
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.cart) {
        setCart(res.data.cart);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error updating quantity:', err.response?.data || err.message);
      setNotificationMessage(`Failed to update quantity: ${err.response?.data?.message || err.message}`);
      setShowNotification(true);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(
        `http://localhost:5000/api/products/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.cart) {
        setCart(res.data.cart);
        setSelectedItems(prev => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
        setNotificationMessage('Product removed from cart successfully!');
        setShowNotification(true);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data || err.message);
      setNotificationMessage(`Failed to remove product from cart: ${err.response?.data?.message || err.message}`);
      setShowNotification(true);
    }
  };

  const calculateItemPrice = (item) => {
    const price = item.productId?.price || 0;
    const discount = item.productId?.discountPercentage || 0;
    const discountedPrice = price * (1 - discount / 100);
    return (discountedPrice * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      if (!selectedItems[item.productId?._id]) return total;
      const price = item.productId?.price || 0;
      const discount = item.productId?.discountPercentage || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + discountedPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    const selectedProductIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    if (selectedProductIds.length === 0) {
      setNotificationMessage('Please select at least one item to proceed to checkout');
      setShowNotification(true);
      return;
    }
    navigate('/checkout', { state: { selectedProductIds } });
  };

  const handleViewOrders = () => {
    navigate('/order-confirmation');
  };

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-center">Your Cart</h2>
        <Button
          variant="outline-primary"
          className="rounded-pill"
          onClick={handleViewOrders}
        >
          View Orders
        </Button>
      </div>
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
                <div className="d-flex align-items-center w-100">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.productId?._id]}
                    onChange={() => handleCheckboxChange(item.productId?._id)}
                    className="me-3"
                  />
                  <img
                    src={item.productId?.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.productId?.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
                  />
                  <div className="flex-1">
                    <h5>{item.productId?.name}</h5>
                    <p className="mb-1">
                      Price: ${item.productId?.price?.toFixed(2)}
                      {item.productId?.discountPercentage > 0 && (
                        <span className="text-success ms-2">
                          ({item.productId.discountPercentage}% off)
                        </span>
                      )}
                    </p>
                    <div className="d-flex align-items-center mb-1">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId?._id, item.quantity, 'decrease')}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId?._id, item.quantity, 'increase')}
                      >
                        +
                      </Button>
                    </div>
                    <p className="mb-0">Subtotal: ${calculateItemPrice(item)}</p>
                  </div>
                </div>
                <div className="text-end">
                  <Button
                    variant="link"
                    onClick={() => handleRemove(item.productId?._id)}
                    className="text-danger"
                    style={{ fontSize: '1.2rem', textDecoration: 'none' }}
                  >
                    ✕
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
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
      <Notification 
        show={showNotification} 
        message={notificationMessage} 
        variant={notificationMessage.includes('Failed') ? 'danger' : 'success'}
        onClose={() => setShowNotification(false)} 
      />
    </div>
  );
};

export default Cart;