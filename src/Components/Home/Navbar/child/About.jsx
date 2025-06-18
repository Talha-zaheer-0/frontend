import React from 'react';
import aboutImage from '../../../../assets/image.png'; // Replace with your actual path
import 'bootstrap/dist/css/bootstrap.min.css';
const About = () => {
  return (
    <div className="container py-5">
      {/* About Us Title */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">ABOUT <span className="text-primary">US</span></h2>
        <hr className="mx-auto" style={{ width: '60px', borderTop: '2px solid #000' }} />
      </div>
      {/* About Content */}
      <div className="row align-items-center mb-5">
        <div className="col-md-5 mb-4 mb-md-0">
          <img src={aboutImage} alt="About" className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-md-7">
          <p>
            Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online.
            Our journey began with a simple idea: to provide a platform where customers can easily discover, explore,
            and purchase a wide range of products from the comfort of their homes.
          </p>
          <p>
            Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that
            cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer
            an extensive collection sourced from trusted brands and suppliers.
          </p>
          <p className="fw-bold mb-1">Our Mission</p>
          <p>
            Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to
            providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery
            and beyond.
          </p>
        </div>
      </div>
      {/* Why Choose Us Section */}
      <div className="text-center mb-4">
        <h3 className="fw-bold">WHY <span className="text-primary">CHOOSE US</span></h3>
        <hr className="mx-auto" style={{ width: '60px', borderTop: '2px solid #000' }} />
      </div>
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="border p-4 h-100 rounded shadow-sm">
            <h5 className="fw-bold">Quality Assurance:</h5>
            <p className="mb-0">
              We meticulously select and vet each product to ensure it meets our stringent quality standards.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="border p-4 h-100 rounded shadow-sm">
            <h5 className="fw-bold">Convenience:</h5>
            <p className="mb-0">
              With our user-friendly interface and hassle-free ordering process, shopping has never been easier.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="border p-4 h-100 rounded shadow-sm">
            <h5 className="fw-bold">Exceptional Customer Service:</h5>
            <p className="mb-0">
              Our team of dedicated professionals is here to assist you, ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;