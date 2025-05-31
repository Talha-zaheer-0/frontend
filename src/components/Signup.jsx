import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // ✅ Import the custom CSS file

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
      await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
        role,
        adminAccess: role === 'admin' ? adminAccess : undefined,
      });
      setSuccess('Signup successful! Please check your email to verify.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

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
