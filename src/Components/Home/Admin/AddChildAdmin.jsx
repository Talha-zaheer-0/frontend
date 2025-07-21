import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../Notification';

const AddChildAdmin = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (!user?.isOwner) {
      setError('Only owner admins can add child admins.');
      setTimeout(() => navigate('/admin'), 2000);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }
      const response = await axios.post('http://localhost:5000/api/auth/admin/add-child', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.msg);
      setError('');
      setNotificationMessage(response.data.msg);
      setShowNotification(true);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to create child admin. Please try again.';
      setError(errorMsg);
      setMessage('');
      setNotificationMessage(errorMsg);
      setShowNotification(true);
      if (err.response?.status === 403) {
        setError('Child admin limit reached (maximum 3). Check your email for details.');
      } else if (err.response?.status === 500 && errorMsg.includes('email')) {
        setError('Failed to send account details email. Please try again later.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Child Admin</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Admin</button>
      </form>
      <Notification 
        show={showNotification} 
        message={notificationMessage} 
        variant={notificationMessage.includes('Failed') ? 'danger' : 'success'}
        onClose={() => setShowNotification(false)} 
      />
    </div>
  );
};

export default AddChildAdmin;