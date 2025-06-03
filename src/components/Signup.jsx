import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup({ setAppState }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminAccess, setAdminAccess] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup', {
        email,
        password,
        role,
        adminAccess: role === 'admin' ? adminAccess : '',
      });
      setSuccess('Signup successful! Redirecting to login...');
      setError('');
      setTimeout(() => setAppState('login'), 2000); // Redirect to login
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait and try again later.');
      } else {
        setError(err.response?.data?.message || 'Signup failed');
      }
      setSuccess('');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        {success && <div className="alert success">{success}</div>}
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {role === 'admin' && (
            <>
              <label>Admin Access</label>
              <select value={adminAccess} onChange={(e) => setAdminAccess(e.target.value)}>
                <option value="">Select Access</option>
                <option value="owner">Owner</option>
                <option value="child">Child</option>
              </select>
            </>
          )}

          <button type="submit">Sign Up</button>
        </form>
        <p className="login-switch">
          Already have an account?{' '}
          <button onClick={() => setAppState('login')} className="link-btn">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;