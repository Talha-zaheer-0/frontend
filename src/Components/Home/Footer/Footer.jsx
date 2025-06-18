import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="stylish-footer">
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
          <h3>Subscribe</h3>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Forever Buy. Built by Team Forever.</p>
      </div>
    </footer>
  );
};

export default Footer;


