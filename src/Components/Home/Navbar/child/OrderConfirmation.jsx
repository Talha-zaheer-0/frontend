import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import './OrderConfirmation.css';

const OrderConfirmation = ({ socket }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllItems, setShowAllItems] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found, cannot fetch orders');
          setOrders([]);
          setLoading(false);
          return;
        }
        const res = await axios.get('http://localhost:5000/api/products/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched orders:', res.data.orders);
        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setOrders([]);
        setLoading(false);
      }
    };
    fetchOrders();

    const userId = localStorage.getItem('userId');
    if (userId && socket) {
      socket.on('orderUpdate', (updatedOrder) => {
        console.log('Received order update via Socket.IO:', updatedOrder);
        if (updatedOrder) {
          setOrders(prevOrders => {
            const index = prevOrders.findIndex(o => o.orderId === updatedOrder.orderId);
            if (index !== -1) {
              const newOrders = [...prevOrders];
              newOrders[index] = updatedOrder;
              return newOrders;
            } else {
              return [updatedOrder, ...prevOrders];
            }
          });
        } else {
          // Handle order deletion
          setOrders(prevOrders => prevOrders.filter(o => o.orderId !== updatedOrder?.orderId));
        }
      });
      socket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err.message);
      });
    }

    return () => {
      if (userId && socket) {
        socket.off('orderUpdate');
        socket.off('connect_error');
      }
    };
  }, [socket]);

  const toggleShowItems = (orderId) => {
    setShowAllItems((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/orders/user/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter(order => order.orderId !== orderId));
      setMessage(`Order ${orderId} deleted successfully.`);
    } catch (err) {
      console.error('❌ Delete Order Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || `❌ Failed to delete order ${orderId}.`);
    }
  };

  const handleContactClick = () => {
    const ownerPhone = '+923176511871';
    const whatsappUrl = `https://wa.me/${ownerPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusPosition = (status) => {
    switch (status?.toLowerCase()) {
      case 'order placed':
      case 'pending':
        return 0;
      case 'processing':
        return 25;
      case 'shipped':
        return 50;
      case 'delivered':
        return 75;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 order-confirmation">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Confirmation</h2>
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 order-confirmation">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Confirmation</h2>
        <p className="text-gray-600">No order details available.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl order-confirmation">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h2>
      {message && (
        <p className={`mb-4 ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>
          {message}
        </p>
      )}
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <table className="order-table color">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Delivery Address</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Tracking ID</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.orderId}</td>
                <td>{order.deliveryAddress || 'N/A'}</td>
                <td>{order.phone || 'N/A'}</td>
                <td>{order.status || 'Pending'}</td>
                <td>{order.trackingId || 'N/A'}</td>
                <td>${(order.totalAmount || 0).toFixed(2)}</td>
                <td>
                  {order.status === 'Delivered' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => deleteOrder(order.orderId)}
                    >
                      Order Completed
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-lg font-semibold mb-2 mt-4 text-gray-700">Order Items</h4>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(showAllItems[order.orderId] ? order.items : order.items.slice(0, 1)).map((item) => (
                <tr key={item.productId?._id}>
                  <td>
                    <img
                      src={item.productId?.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                      alt={item.productId?.name || 'Product'}
                      className="order-item-img"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </td>
                  <td>{item.productId?.name || 'Unknown Product'}</td>
                  <td>${(item.price || 0).toFixed(2)}</td>
                  <td>{item.quantity || 1}</td>
                  <td>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {order.items.length > 1 && (
            <button
              className="view-all-btn"
              onClick={() => toggleShowItems(order.orderId)}
            >
              {showAllItems[order.orderId] ? 'Hide Items' : 'View All'}
            </button>
          )}
          <div className="order-status-footer">
            <div className="status-bar">
              <div className="status-section">
                <span className="status-text">Order Placed</span>
              </div>
              <div className="status-section">
                <span className="status-text">Processing</span>
              </div>
              <div className="status-section">
                <span className="status-text">Shipped</span>
              </div>
              <div className="status-section">
                <span className="status-text">Delivered</span>
              </div>
              <FontAwesomeIcon
                icon={faCar}
                className="status-car"
                style={{ left: `${getStatusPosition(order.status)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
      {orders.length > 0 && (
        <div className="contact-icon" onClick={handleContactClick} title="Contact Owner via WhatsApp">
          <img className='logo5' src="/whatsApp.png" alt="WhatsApp Contact"  title='onwner contact'/>
        </div>
      )}
      <button
        onClick={() => navigate('/')}
        className="bg-dark text-white rounded pill px-4 py-2 mt-4 hover:bg-primary transition duration-300"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;