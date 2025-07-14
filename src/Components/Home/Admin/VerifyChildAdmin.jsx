import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const VerifyChildAdmin = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    tempAdminId: searchParams.get('tempAdminId') || '',
    code: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Update formData if tempAdminId is in URL
    setFormData((prev) => ({
      ...prev,
      tempAdminId: searchParams.get('tempAdminId') || prev.tempAdminId
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin/verify', formData);
      setMessage(response.data.msg);
      setError('');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after verification
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to verify admin account');
      setMessage('');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Verify Child Admin Account</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="tempAdminId" className="form-label">Temporary Admin ID</label>
          <input
            type="text"
            className="form-control"
            id="tempAdminId"
            name="tempAdminId"
            value={formData.tempAdminId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="code" className="form-label">Verification Code</label>
          <input
            type="text"
            className="form-control"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Verify Account</button>
      </form>
    </div>
  );
};

export default VerifyChildAdmin;