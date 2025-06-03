import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ setAppState }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/login', {
        email,
        password,
      });
      setSuccess('Login successful! Redirecting to landing page...');
      setError('');
      setTimeout(() => setAppState('landing'), 2000); // Redirect to landing
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait and try again later.');
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
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

          <button type="submit">Login</button>
        </form>
        <p className="signup-switch">
          Don't have an account?{' '}
          <button onClick={() => setAppState('signup')} className="link-btn">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;