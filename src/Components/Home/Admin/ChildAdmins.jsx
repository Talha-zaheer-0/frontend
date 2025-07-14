import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChildAdmins = () => {
  const { user } = useAuth();
  const [childAdmins, setChildAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChildAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/auth/admin/child-admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChildAdmins(response.data.childAdmins);
      if (response.data.childAdmins.length === 0) {
        setError('No child admins found.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch child admins. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this child admin?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }
      await axios.delete(`http://localhost:5000/api/auth/admin/child-admins/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChildAdmins(childAdmins.filter((admin) => admin._id !== adminId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to remove child admin. Please try again.');
    }
  };

  useEffect(() => {
    if (user?.isOwner) {
      fetchChildAdmins();
    } else {
      setError('Only owner admins can view child admins.');
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Child Admins</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border"

System: variant="primary" />
        </div>
      ) : (
        <div className="row">
          {childAdmins.length > 0 ? (
            childAdmins.map((admin) => (
              <div className="col-md-12 mb-3" key={admin._id}>
                <div className="card p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{admin.name}</h6>
                      <p className="mb-0">{admin.email}</p>
                      <p className="mb-0 text-muted">Status: {admin.isVerified ? 'Verified' : 'Pending Verification'}</p>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveAdmin(admin._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No child admins found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChildAdmins;