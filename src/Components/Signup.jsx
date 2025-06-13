import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Signup = () => {
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { name, email, password } = values;

      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      console.log('Signup success:', response.data);
      alert('Signup successful!');
      resetForm();
    } catch (error) {
      console.error('Signup error:', error);

      if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert('An error occurred during signup.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Sign Up</h2>

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            {/* Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <Field name="name" type="text" className="form-control" placeholder="John Doe" />
              <ErrorMessage name="name" component="div" className="text-danger small" />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <Field name="email" type="email" className="form-control" placeholder="john@example.com" />
              <ErrorMessage name="email" component="div" className="text-danger small" />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <Field name="password" type="password" className="form-control" placeholder="••••••••" />
              <ErrorMessage name="password" component="div" className="text-danger small" />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <Field name="confirmPassword" type="password" className="form-control" placeholder="••••••••" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-dark w-100 rounded-pill" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
