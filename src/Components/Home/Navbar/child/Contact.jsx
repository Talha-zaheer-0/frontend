import React from 'react';
import './Contact.css';

const Contact = () => {
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

        <form className="contact-form">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
