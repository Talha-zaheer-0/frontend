import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import style from './Signup.module.css';

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
      setMessage(response.data.msg); // Includes attempt count, e.g., "Verification code sent to email (Attempt 2 of 3)"
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
    <div className={`container py-5 ${style.signupContainer}`} style={{ maxWidth: '500px' }}>
      <div className={style.colorBlobs}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h2 className="mb-4 text-center text-white">{isVerifying ? 'Verify Email' : 'Sign Up'}</h2>

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
                  <label htmlFor="name" className={`form-label ${style.formLabel}`}>Full Name</label>
                  <Field name="name" type="text" className={`form-control ${style.formControl}`} placeholder="John Doe" />
                  <ErrorMessage name="name" component="div" className={style.textDanger} />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className={`form-label ${style.formLabel}`}>Email Address</label>
                  <Field name="email" type="email" className={`form-control ${style.formControl}`} placeholder="john@example.com" />
                  <ErrorMessage name="email" component="div" className={style.textDanger} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className={`form-label ${style.formLabel}`}>Password</label>
                  <Field name="password" type="password" className={`form-control ${style.formControl}`} placeholder="••••••••" />
                  <ErrorMessage name="password" component="div" className={style.textDanger} />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className={`form-label ${style.formLabel}`}>Confirm Password</label>
                  <Field name="confirmPassword" type="password" className={`form-control ${style.formControl}`} placeholder="••••••••" />
                  <ErrorMessage name="confirmPassword" component="div" className={style.textDanger} />
                </div>
                <button type="submit" className={`btn btn-dark w-100 rounded-pill ${style.animatedButton}`} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Sign Up'}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-center mt-3 text-white">
            Already have an account? <Link to="/login" className={style.textPrimary}>Login here</Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <label htmlFor="verificationCode" className={`form-label ${style.formLabel}`}>Verification Code</label>
            <input
              type="text"
              className={`form-control ${style.formControl}`}
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={`btn btn-dark w-100 rounded-pill ${style.animatedButton}`}>
            Verify
          </button>
        </form>
      )}

      {message && (
        <p
          className={`text-center mt-3 ${message.includes('error') || message.includes('Too many attempts') ? style.textDanger : style.textSuccess}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Signup;