import React, { useState } from 'react';
import axios from 'axios';
import contactImage from '../../../../assets/contact-banner.png'; // Adjust path to your image
import './Contact.css';

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
    <section className="contact-section py-5 bg-light">
      {/* Hero Section */}
      <div className="contact-hero mb-5 position-relative" data-aos="fade-in">
        <img
          src={contactImage}
          alt="Contact Us"
          className="img-fluid w-100"
          style={{ maxHeight: '450px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div className="position-absolute top-50 start-50 translate-middle w-100 text-center">
          <h1 className="text-white display-4 fw-bold shadow-lg">We'd Love to Hear From You</h1>
        </div>
      </div>
      {/* Contact Info + Form */}
      <div className="container">
        <div className="row align-items-start">
          {/* Info Section */}
          <div className="col-md-5 mb-5" data-aos="fade-right">
            <h2 className="fw-bold mb-4">Get in Touch</h2>
            <p className="mb-4">
              Whether you have a question about our products, pricing, or anything else — our team is ready to answer
              all your questions. We aim to provide responses within 24 hours.
            </p>
            <div className="mb-3">
              <i className="fas fa-map-marker-alt me-2 text-primary"></i>
              <strong>Address:</strong> 123 Forever Street, Lahore, Pakistan
            </div>
            <div className="mb-3">
              <i className="fas fa-envelope me-2 text-primary"></i>
              <strong>Email:</strong> support@foreverbuy.in
            </div>
            <div className="mb-3">
              <i className="fas fa-phone me-2 text-primary"></i>
              <strong>Phone:</strong> +92 300 43210
            </div>
            <div>
              <i className="fas fa-clock me-2 text-primary"></i>
              <strong>Hours:</strong> Mon – Sat: 9am – 6pm
            </div>
          </div>
          {/* Contact Form */}
          <div className="col-md-7" data-aos="fade-left">
            <form className="contact-form shadow-lg p-5 rounded bg-white" onSubmit={handleSubmit}>
              <h4 className="fw-bold mb-4">Send Us a Message</h4>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="message"
                  className="form-control"
                  placeholder="Your Message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Send Message</button>
              {message && <p className="message mt-3 text-center" style={{ color: message.includes('error') ? 'red' : 'green' }}>{message}</p>}
            </form>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="row mt-5" data-aos="fade-up">
          <div className="col-md-12 text-center">
            <h3 className="fw-bold mb-3">Frequently Asked Questions</h3>
            <p className="lead mb-4">Find quick answers to common questions about our services and support.</p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        How soon will I get a response?
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        We respond to most inquiries within 24 hours.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Can I modify my order after placing it?
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Yes, within 2 hours of placing the order.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Do you offer refunds?
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Yes, based on our return policy. Please check the Returns page.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        Is your support available 24/7?
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Email support is available 24/7. Phone support is available 9am–6pm.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;