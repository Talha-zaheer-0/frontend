import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import './style.css'; // Assuming you have a CSS file for styling

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedProductIds = state?.selectedProductIds || [];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [cart, setCart] = useState({ items: [] });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found, redirecting to login');
          setLoading(false);
          navigate('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/products/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredItems = res.data.cart.items.filter(item => 
          selectedProductIds.includes(item.productId?._id)
        );
        setCart({ ...res.data.cart, items: filteredItems });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        alert('Failed to fetch cart. Please try again.');
        setLoading(false);
      }
    };
    fetchCart();
  }, [selectedProductIds, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      const discount = item.productId?.discountPercentage || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + discountedPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        console.log('Submitting order with data:', {
          userName: formData.name,
          deliveryAddress: formData.address,
          phone: formData.phone,
          selectedProductIds
        });
        const response = await axios.post(
          'http://localhost:5000/api/products/order',
          {
            userName: formData.name,
            deliveryAddress: formData.address,
            phone: formData.phone
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Order creation response:', {
          status: response.status,
          data: response.data
        });

        // Prepare and send order confirmation email
        const items = cart.items.map(item => {
          const price = (item.productId?.price || 0) * (1 - (item.productId?.discountPercentage || 0) / 100);
          return {
            productName: item.productId?.name || 'Unknown Product',
            quantity: item.quantity,
            price: price.toFixed(2),
            subtotal: (price * item.quantity).toFixed(2)
          };
        });

        try {
          console.log('Sending order confirmation email with payload:', {
            userName: formData.name,
            userEmail: formData.email,
            deliveryAddress: formData.address,
            phone: formData.phone,
            items,
            total: calculateTotal()
          });
          await axios.post(
            'http://localhost:5000/api/auth/order-confirmation',
            {
              userName: formData.name,
              userEmail: formData.email,
              deliveryAddress: formData.address,
              phone: formData.phone,
              items,
              total: calculateTotal()
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Order confirmation email sent successfully');
        } catch (emailErr) {
          console.error('Failed to send order confirmation email:', {
            message: emailErr.message,
            response: emailErr.response?.data,
            status: emailErr.response?.status,
            stack: emailErr.stack
          });
          // Continue to order confirmation page even if email fails
        }

        localStorage.setItem('hasOrdered', 'true');
        alert('Order placed successfully!');
        navigate('/order-confirmation');
      } catch (err) {
        console.error('Error during checkout:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          selectedProductIds
        });
        alert(`Failed to place order: ${err.response?.data?.message || err.message || 'Server error'}`);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.log('Falling back to order history page');
          navigate('/order-confirmation');
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 text-center">Checkout</h2>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : cart.items.length === 0 ? (
        <div className="card p-4 text-center">
          <p>No items selected for checkout.</p>
          <button
            className="btn btn-dark rounded-pill"
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h4 className="mb-3">Selected Items</h4>
            {cart.items.map((item) => (
              <div key={item.productId?._id} className="d-flex align-items-center mb-3 border-bottom pb-3">
                <img
                  src={item.productId?.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.productId?.name || 'Product'}
                  className="w-20 h-20 object-contain rounded me-3 order-item-img"
                  style={{ maxWidth: '80px !important', maxHeight: '80px !important' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.productId?.name}</p>
                  <p className="text-gray-600">
                    ${item.productId?.price?.toFixed(2)}
                    {item.productId?.discountPercentage > 0 && (
                      <span className="text-success ms-2">
                        ({item.productId?.discountPercentage}% off)
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-800 font-semibold">
                    Subtotal: ${(item.productId?.price * (1 - (item.productId?.discountPercentage || 0) / 100) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="text-end mb-4">
              <p className="text-xl font-bold text-gray-800">Total: ${calculateTotal()}</p>
            </div>
          </div>
          <h4>Delivery charges Apply</h4>
          <p className='mb-3 font-semibold text-xl'>Cash on Delivery</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!!user?.name}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!user?.email}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Delivery Address</label>
              <textarea
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your delivery address"
              />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
            <button
              type="submit"
              className="btn btn-dark w-100 rounded-pill"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : 'Place Order'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Checkout;