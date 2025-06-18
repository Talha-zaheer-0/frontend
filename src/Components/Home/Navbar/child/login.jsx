import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    setServerError('');

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        console.log("✅ Login successful:", response.data);

        // Save token to localStorage
        localStorage.setItem('token', response.data.token);

        // Check if user is admin and redirect accordingly
        if (response.data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("❌ Login error:", err);
        setServerError(err.response?.data?.msg || "Something went wrong");
      }
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Sign In</h2>
      
      {serverError && (
        <div className="alert alert-danger">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input 
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-dark w-100 rounded-pill">Login</button>
      </form>
    </div>
  );
};

export default Login;