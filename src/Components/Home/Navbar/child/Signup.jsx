import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Signup = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSignup = async (values, { setSubmitting, resetForm }) => {
    try {
      const { name, email, password } = values;
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      console.log('Signup success:', response.data);
      setTempUserId(response.data.tempUserId);
      setIsVerifying(true);
      setMessage('Please check your email for the verification code.');
      resetForm();
    } catch (error) {
      console.error('Signup error:', error);
      setMessage(error.response?.data?.msg || 'An error occurred during signup.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify', {
        tempUserId,
        code: verificationCode,
      });
      setMessage(response.data.msg);
      setIsVerifying(false);
      setVerificationCode('');
      setTempUserId('');
      window.dispatchEvent(new Event('authChange')); // Notify navbar
      navigate('/login'); // Redirect to login after verification
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.msg || 'An error occurred during verification.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">{isVerifying ? 'Verify Email' : 'Sign Up'}</h2>

      {!isVerifying ? (
        <>
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <Field name="name" type="text" className="form-control" placeholder="John Doe" />
                  <ErrorMessage name="name" component="div" className="text-danger small" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <Field name="email" type="email" className="form-control" placeholder="john@example.com" />
                  <ErrorMessage name="email" component="div" className="text-danger small" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Field name="password" type="password" className="form-control" placeholder="••••••••" />
                  <ErrorMessage name="password" component="div" className="text-danger small" />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <Field name="confirmPassword" type="password" className="form-control" placeholder="••••••••" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
                </div>
                <button type="submit" className="btn btn-dark w-100 rounded-pill" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Sign Up'}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <label htmlFor="verificationCode" className="form-label">Verification Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100 rounded-pill">
            Verify
          </button>
        </form>
      )}

      {message && <p className="text-center mt-3" style={{ color: message.includes('error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default Signup;