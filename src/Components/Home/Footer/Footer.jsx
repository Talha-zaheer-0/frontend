import React, { useState } from "react";
import "./Footer.css";
import axios from 'axios';
import backgroundImage from '../../../assets/footer.jpg'; // Adjust path as needed

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/email/quote', { email });
      setMessage(response.data.msg);
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.msg || 'An error occurred');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <footer className="footer-section stylish-footer" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Forever Buy</h2>
          <p>Delivering happiness to your doorstep with every order.</p>
        </div>

        <div className="footer-menu">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer-subscribe">
          <h3>Get a Quote</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="animated-button">Submit</button>
          </form>
          {message && <p className="error-message">{message}</p>}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Forever Buy | Built by Team Forever</p>
      </div>
    </footer>
  );
};

export default Footer;