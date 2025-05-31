import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {role === 'admin' && (
            <div className="mb-4">
              <label className="block text-gray-700">Admin Access</label>
              <select
                value={adminAccess}
                onChange={(e) => setAdminAccess(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Access</option>
                <option value="owner">Owner</option>
                <option value="child">Child</option>
              </select>
            </div>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button onClick={() => setAppState('login')} className="text-blue-500 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;