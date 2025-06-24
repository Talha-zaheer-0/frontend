import React, { useState } from 'react';
import './Contact.css';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/email/contact', formData);
      setMessage(response.data.msg);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.msg || 'An error occurred');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-wrapper">
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p className="desc">Have any questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>123 Forever Street, Lahore, Pakistan</span>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <span>support@foreverbuy.in</span>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <span>+92 300 43210</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default Contact;