import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

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
        setCart(res.data.cart || { items: [] });
        const initialSelected = {};
        res.data.cart.items.forEach(item => {
          initialSelected[item.productId?._id] = true;
        });
        setSelectedItems(initialSelected);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data || err.message);
        alert('Failed to fetch cart. Please try again.');
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Toggle delete button visibility
  const toggleDelete = (

productId) => {
    setShowDelete(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (productId) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Update quantity
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
      alert(`Failed to update quantity: ${err.response?.data?.message || err.message}`);
    }
  };

  // Remove item from cart
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
        setShowDelete(prev => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data || err.message);
      alert(`Failed to remove product from cart: ${err.response?.data?.message || err.message}`);
    }
  };

  // Calculate item price with discount
  const calculateItemPrice = (item) => {
    const price = item.productId?.price || 0;
    const discount = item.productId?.discountPercentage || 0;
    const discountedPrice = price * (1 - discount / 100);
    return (discountedPrice * item.quantity).toFixed(2);
  };

  // Calculate total for selected items
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      if (!selectedItems[item.productId?._id]) return total;
      const price = item.productId?.price || 0;
      const discount = item.productId?.discountPercentage || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + discountedPrice * item.quantity;
    }, 0).toFixed(2);
  };

  // Navigate to checkout
  const handleCheckout = () => {
    const selectedProductIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    if (selectedProductIds.length === 0) {
      alert('Please select at least one item to proceed to checkout');
      return;
    }
    navigate('/checkout', { state: { selectedProductIds } });
  };

  // Navigate to orders
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
                    onClick={() => toggleDelete(item.productId?._id)}
                    className="text-danger"
                  >
                    <FaTrash />
                  </Button>
                  {showDelete[item.productId?._id] && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item.productId?._id)}
                      className="mt-2"
                    >
                      Delete
                    </Button>
                  )}
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
    </div>
  );
};

export default Cart;