import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

// Fallback image URL
const FALLBACK_IMAGE = 'https://via.placeholder.com/50x50?text=No+Image';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [trackingId, setTrackingId] = useState({});
  const [showTrackingInput, setShowTrackingInput] = useState({});
  const [loading, setLoading] = useState({}); // Track loading state for each button

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ No authentication token found. Please log in.');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/products/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched orders:', response.data.orders);
      setOrders(response.data.orders || []);
      if ((response.data.orders || []).length === 0) {
        setMessage('No orders found.');
      }
      setMessage('');
    } catch (err) {
      console.error('❌ Fetch Orders Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });
      setMessage(
        err.response?.data?.message ||
        '❌ Failed to fetch orders. Please check your connection or login status.'
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const validateImage = (image) => {
    if (!image || typeof image !== 'string') {
      console.warn('Invalid or missing image:', image);
      return null;
    }
    if (image.includes('res.cloudinary.com')) {
      const urlParts = image.split('/upload/');
      if (urlParts.length === 2) {
        return `${urlParts[0]}/upload/w_50,h_50,c_fill/${urlParts[1]}`;
      }
    }
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:image/')) {
      return image;
    }
    console.warn('Invalid image format:', image);
    return null;
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      setLoading(prev => ({ ...prev, [orderId]: newStatus }));
      const token = localStorage.getItem('token');
      const body = { status: newStatus };
      if (newStatus === 'Shipped' && trackingId[orderId]) {
        body.trackingId = trackingId[orderId];
      } else if (newStatus === 'Shipped' && !trackingId[orderId]) {
        setMessage('❌ Tracking ID is required to ship the order.');
        setLoading(prev => ({ ...prev, [orderId]: null }));
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/api/products/orders/${orderId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (newStatus === 'Delivered') {
        setOrders(orders.filter(order => order.orderId !== orderId));
        setMessage(`Order ${orderId} updated to ${newStatus} and removed from list`);
      } else {
        setOrders(orders.map(order =>
          order.orderId === orderId ? { ...order, status: newStatus, trackingId: newStatus === 'Shipped' ? trackingId[orderId] : order.trackingId } : order
        ));
        setMessage(`Order ${orderId} updated to ${newStatus}`);
      }
      setShowTrackingInput(prev => ({ ...prev, [orderId]: false }));
      setTrackingId(prev => ({ ...prev, [orderId]: '' }));
    } catch (err) {
      console.error('❌ Update Status Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || `❌ Failed to update order ${orderId}.`);
    } finally {
      setLoading(prev => ({ ...prev, [orderId]: null }));
    }
  };

  const completeOrder = async (orderId) => {
    try {
      setLoading(prev => ({ ...prev, [orderId]: 'Complete' }));
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/products/orders/${orderId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter(order => order.orderId !== orderId));
      setMessage(`Order ${orderId} completed and deleted successfully.`);
    } catch (err) {
      console.error('❌ Complete Order Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || `❌ Failed to complete order ${orderId}.`);
    } finally {
      setLoading(prev => ({ ...prev, [orderId]: null }));
    }
  };

  const toggleTrackingInput = (orderId) => {
    setShowTrackingInput(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const refreshOrders = () => {
    setMessage('');
    fetchOrders();
  };

  const filteredOrders = orders.filter(order =>
    (order?.orderId && order.orderId.includes(searchTerm)) ||
    (order?.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order?.deliveryAddress && order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="d-flex"> 
      <div className="container-fluid p-4 flex-grow-1">
        <h2 className="mb-4 text-primary">Admin - Manage Orders</h2>
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by Order ID, User, or Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={refreshOrders}>
            Refresh
          </button>
        </div>
        {message && <p className={`mt-3 fw-semibold ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>{message}</p>}
        {filteredOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Tracking ID</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.orderId} className={order.status !== 'Delivered' ? 'table-active' : ''}>
                    <td>{order.orderId}</td>
                    <td>{order.userName || 'N/A'}</td>
                    <td>
                      <ul className="list-unstyled mb-0">
                        {order.items?.map(item => (
                          <li key={item.productId?._id || item._id}>
                            {imageErrors[`${order.orderId}-${item.productId?._id || item._id}`] ? (
                              <span className="text-danger">Pic not found</span>
                            ) : (
                              <img
                                src={validateImage(item.productId?.images?.[0])}
                                alt={item.productId?.name || 'Product'}
                                width="50"
                                height="50"
                                className="me-2"
                                onError={(e) => {
                                  console.error(`Failed to load image for ${item.productId?.name || 'unknown'}:`, item.productId?.images?.[0]);
                                  setImageErrors(prev => ({
                                    ...prev,
                                    [`${order.orderId}-${item.productId?._id || item._id}`]: true,
                                  }));
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            {item.productId?.name || 'Unknown Product'} (x{item.quantity || 1}) - ${item.price?.toFixed(2) || '0.00'}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                    <td>{order.deliveryAddress || 'N/A'}</td>
                    <td>{order.phone || 'N/A'}</td>
                    <td>{order.status || 'N/A'}</td>
                    <td>{order.trackingId || 'N/A'}</td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {order.status === 'Pending' && (
                          <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={() => updateStatus(order.orderId, 'Processing')}
                            disabled={loading[order.orderId] === 'Processing'}
                          >
                            {loading[order.orderId] === 'Processing' ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Processing...
                              </>
                            ) : (
                              'Process'
                            )}
                          </button>
                        )}
                        {order.status === 'Processing' && (
                          <>
                            {showTrackingInput[order.orderId] ? (
                              <div className="input-group input-group-sm">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Tracking ID"
                                  value={trackingId[order.orderId] || ''}
                                  onChange={(e) => setTrackingId(prev => ({ ...prev, [order.orderId]: e.target.value }))}
                                />
                                <button
                                  className="btn btn-primary d-flex align-items-center"
                                  onClick={() => updateStatus(order.orderId, 'Shipped')}
                                  disabled={loading[order.orderId] === 'Shipped'}
                                >
                                  {loading[order.orderId] === 'Shipped' ? (
                                    <>
                                      <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                      />
                                      Submitting...
                                    </>
                                  ) : (
                                    'Submit'
                                  )}
                                </button>
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => toggleTrackingInput(order.orderId)}
                                  disabled={loading[order.orderId] === 'Shipped'}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary"
                                onClick={() => toggleTrackingInput(order.orderId)}
                                disabled={loading[order.orderId]}
                              >
                                Ship
                              </button>
                            )}
                          </>
                        )}
                        {order.status === 'Shipped' && (
                          <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={() => updateStatus(order.orderId, 'Delivered')}
                            disabled={loading[order.orderId] === 'Delivered'}
                          >
                            {loading[order.orderId] === 'Delivered' ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Delivering...
                              </>
                            ) : (
                              'Deliver'
                            )}
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <button
                            className="btn btn-success d-flex align-items-center"
                            onClick={() => completeOrder(order.orderId)}
                            disabled={loading[order.orderId] === 'Complete'}
                          >
                            {loading[order.orderId] === 'Complete' ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Completing...
                              </>
                            ) : (
                              'Order Complete'
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">{message || 'No orders found'}</p>
        )}
      </div>
    </div>
  );
};

export default Orders;