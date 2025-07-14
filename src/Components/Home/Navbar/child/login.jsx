import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import axios from 'axios';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [resetData, setResetData] = useState({
    email: '',
    verificationCode: '',
    newPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    setServerError('');

    if (Object.keys(newErrors).length === 0) {
      try {
        const user = await login(formData.email, formData.password);
        console.log('Logged in user:', user, 'isOwner:', user.isOwner);
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("❌ Login error:", err.response?.data || err.message);
        setServerError(err.response?.data?.msg || "Something went wrong");
      }
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setServerError('');
    setResetSuccess('');

    if (!resetData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email: resetData.email
      });
      setResetSuccess(response.data.msg);
      setErrors({});
    } catch (err) {
      setServerError(err.response?.data?.msg || "Something went wrong");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setResetSuccess('');

    let newErrors = {};
    if (!resetData.email) newErrors.email = "Email is required";
    if (!resetData.verificationCode) newErrors.verificationCode = "Verification code is required";
    if (!resetData.newPassword) newErrors.newPassword = "New password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('/api/auth/reset-password', {
          email: resetData.email,
          code: resetData.verificationCode,
          newPassword: resetData.newPassword
        });
        setResetSuccess(response.data.msg);
        setResetData({ email: '', verificationCode: '', newPassword: '' });
        setIsResetMode(false);
      } catch (err) {
        setServerError(err.response?.data?.msg || "Something went wrong");
      }
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">{isResetMode ? 'Reset Password' : 'Sign In'}</h2>
      
      {serverError && (
        <div className="alert alert-danger">{serverError}</div>
      )}
      {resetSuccess && (
        <div className="alert alert-success">{resetSuccess}</div>
      )}

      {!isResetMode ? (
        <>
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

          <p className="text-center mt-3">
            <button 
              className="btn btn-link p-0"
              onClick={() => setIsResetMode(true)}
            >
              Forgot Password?
            </button>
          </p>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </>
      ) : (
        <>
          <form onSubmit={resetData.verificationCode ? handleResetSubmit : handleResetRequest} noValidate>
            <div className="mb-3">
              <label htmlFor="resetEmail" className="form-label">Email address</label>
              <input 
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="resetEmail"
                name="email"
                value={resetData.email}
                onChange={handleResetChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {resetSuccess.includes('Verification code sent') && (
              <>
                <div className="mb-3">
                  <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.verificationCode ? 'is-invalid' : ''}`}
                    id="verificationCode"
                    name="verificationCode"
                    value={resetData.verificationCode}
                    onChange={handleResetChange}
                  />
                  {errors.verificationCode && <div className="invalid-feedback">{errors.verificationCode}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input 
                    type="password"
                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                    id="newPassword"
                    name="newPassword"
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                  />
                  {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn btn-dark w-100 rounded-pill"
            >
              {resetData.verificationCode ? 'Reset Password' : 'Send Verification Code'}
            </button>
          </form>

          <p className="text-center mt-3">
            <button 
              className="btn btn-link p-0"
              onClick={() => {
                setIsResetMode(false);
                setResetData({ email: '', verificationCode: '', newPassword: '' });
                setErrors({});
                setServerError('');
                setResetSuccess('');
              }}
            >
              Back to Login
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default Login;