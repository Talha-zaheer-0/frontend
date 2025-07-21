import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import styles from './Checkout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Notification';

const Checkout = ({ socket }) => {
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
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found, redirecting to login');
          setMessage('Please log in to proceed with checkout.');
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
        const filteredItems = updatedCart.items.filter(item => 
          selectedProductIds.includes(item.productId?._id)
        );
        setCart({ ...updatedCart, items: filteredItems });
      });
      socket.on('orderUpdate', (order) => {
        console.log('Received order update via Socket.IO:', order);
        if (order) {
          setNotificationMessage('Order placed successfully! Redirecting...');
          setShowNotification(true);
          setTimeout(() => navigate('/order-confirmation'), 2000);
        }
      });
      socket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err.message);
      });
    }

    return () => {
      if (userId && socket) {
        socket.off('cartUpdate');
        socket.off('orderUpdate');
        socket.off('connect_error');
      }
    };
  }, [selectedProductIds, navigate, socket]);

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
            'http://localhost:5000/api/email/order-confirmation',
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
        }

        localStorage.setItem('hasOrdered', 'true');
        setNotificationMessage('Order placed successfully! Redirecting...');
        setShowNotification(true);
        setTimeout(() => navigate('/order-confirmation'), 2000);
      } catch (err) {
        console.error('Error during checkout:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          selectedProductIds
        });
        setNotificationMessage(`Failed to place order: ${err.response?.data?.message || err.message || 'Server error'}`);
        setShowNotification(true);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={`${styles.textCenter} ${styles.mb4} ${styles.textGray800} ${styles.fontBold}`}>
        Checkout
      </h2>
      {message && (
        <div className={`${styles.message} ${styles.mb4} ${styles.textCenter} ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>
          {message}
        </div>
      )}
      {loading ? (
        <div className={`${styles.textCenter} ${styles.my5}`}>
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : cart.items.length === 0 ? (
        <div className={styles.card}>
          <p className={`${styles.textGray800} ${styles.textCenter}`}>No items selected for checkout.</p>
          <button
            className={`${styles.btnDark} ${styles.roundedPill} ${styles.w100}`}
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className={styles.formContainer}>
              <h4 className={`${styles.mb3} ${styles.textGray800} ${styles.fontSemibold}`}>
                Shipping Information
              </h4>
              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.mb3}>
                  <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    className={`${styles.formControl} ${errors.name ? styles.formControlInvalid : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!!user?.name}
                  />
                  {errors.name && <div className={styles.invalidFeedback}>{errors.name}</div>}
                </div>
                <div className={styles.mb3}>
                  <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    className={`${styles.formControl} ${errors.email ? styles.formControlInvalid : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!user?.email}
                  />
                  {errors.email && <div className={styles.invalidFeedback}>{errors.email}</div>}
                </div>
                <div className={styles.mb3}>
                  <label htmlFor="address" className={styles.formLabel}>Delivery Address</label>
                  <textarea
                    className={`${styles.formControl} ${errors.address ? styles.formControlInvalid : ''}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your delivery address"
                  />
                  {errors.address && <div className={styles.invalidFeedback}>{errors.address}</div>}
                </div>
                <div className={styles.mb3}>
                  <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    className={`${styles.formControl} ${errors.phone ? styles.formControlInvalid : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <div className={styles.invalidFeedback}>{errors.phone}</div>}
                </div>
                <button
                  type="submit"
                  className={`${styles.btnDark} ${styles.w100} ${styles.roundedPill} ${styles.dFlex} ${styles.alignItemsCenter} ${styles.justifyContentCenter}`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className={styles.spinnerBorder}
                      />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.orderSummary}>
              <h4 className={`${styles.mb3} ${styles.textGray800} ${styles.fontSemibold}`}>
                Order Summary
              </h4>
              {cart.items.map((item) => (
                <div
                  key={item.productId?._id}
                  className={`${styles.dFlex} ${styles.alignItemsCenter} ${styles.mb3} ${styles.borderBottom} ${styles.pb3}`}
                >
                  <img
                    src={item.productId?.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.productId?.name || 'Product'}
                    className={styles.orderItemImg}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                  <div className={`${styles.flex1} ms-3`}>
                    <p className={`${styles.fontMedium} ${styles.textGray800}`}>
                      {item.productId?.name}
                    </p>
                    <p className={styles.textGray600}>
                      ${item.productId?.price?.toFixed(2)}
                      {item.productId?.discountPercentage > 0 && (
                        <span className="text-success ms-2">
                          ({item.productId?.discountPercentage}% off)
                        </span>
                      )}
                    </p>
                    <p className={styles.textGray600}>Quantity: {item.quantity}</p>
                    <p className={`${styles.textGray800} ${styles.fontSemibold}`}>
                      Subtotal: ${(item.productId?.price * (1 - (item.productId?.discountPercentage || 0) / 100) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className={`${styles.textEnd} ${styles.mb3}`}>
                <p className={`${styles.textXl} ${styles.fontBold} ${styles.textGray800}`}>
                  Total: ${calculateTotal()}
                </p>
              </div>
              <div className={styles.mb3}>
                <p className={`${styles.fontSemibold} ${styles.textGray800}`}>
                  Delivery Charges: <span className="text-muted">TBD at checkout</span>
                </p>
                <p className={`${styles.fontSemibold} ${styles.textGray800}`}>
                  Payment Method: <span className="text-muted">Cash on Delivery</span>
                </p>
              </div>
            </div>
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

export default Checkout;