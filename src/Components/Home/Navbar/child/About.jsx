import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import aboutImg1 from '../../../../assets/aboutImg1.png.jpg';
import aboutImg2 from '../../../../assets/aboutImg2.png.avif';
import aboutImg3 from '../../../../assets/aboutImg3.png.jpeg';
import aboutImg4 from '../../../../assets/aboutImg4.png.jpg';
import team1 from '../../../../assets/team1.jpg';
import team2 from '../../../../assets/team2.png';
import team3 from '../../../../assets/team3.png';
import team4 from '../../../../assets/team4.png';
const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  const teamMembers = [
    { img: team1, name: 'Ahmad Azhar', role: 'Team Lead' },
    { img: team2, name: 'Sarah Ali', role: 'Frontend Developer' },
    { img: team3, name: 'Usman Tariq', role: 'Backend Developer' },
    { img: team4, name: 'Hina Raza', role: 'QA Engineer' },
  ];
  return (
    <div className="container py-5">
      {/* Title */}
      <div className="text-center mb-5" data-aos="fade-up">
        <h2 className="fw-bold">ABOUT <span className="text-primary">US</span></h2>
        <hr className="mx-auto" style={{ width: '60px', borderTop: '2px solid #000' }} />
      </div>
      {/* Our Story */}
      <div className="row align-items-center mb-5" data-aos="fade-right">
        <div className="col-md-6">
          <img src={aboutImg1} className="img-fluid rounded shadow-sm" alt="Story" />
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold">Our Story</h4>
          <p>
            Forever was founded to redefine the online shopping experience. Our mission is to provide convenience,
            trust, and value through a modern digital platform. From humble beginnings, we’ve grown into a team
            that’s passionate about customer satisfaction.
          </p>
          <p>
            We believe shopping should be more than a transaction — it should be a joyful, seamless journey from
            browsing to unboxing.
          </p>
        </div>
      </div>
      {/* Quality */}
      <div className="row align-items-center mb-5 flex-md-row-reverse" data-aos="fade-left">
        <div className="col-md-6">
          <img src={aboutImg2} className="img-fluid rounded shadow-sm" alt="Quality" />
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold">Unmatched Quality</h4>
          <p>
            Every product goes through a careful selection process. We collaborate with top-tier suppliers and
            ensure everything meets our high standards of quality, durability, and design.
          </p>
          <p>
            Our focus on quality helps us build long-term trust with customers who return again and again.
          </p>
        </div>
      </div>
      {/* Convenience */}
      <div className="row align-items-center mb-5" data-aos="fade-up">
        <div className="col-md-6">
          <img src={aboutImg3} className="img-fluid rounded shadow-sm" alt="Convenience" />
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold">Ease of Shopping</h4>
          <p>
            We’re committed to giving you a fast, intuitive experience across all devices. Our platform is optimized
            for mobile and desktop, ensuring you can shop effortlessly anytime, anywhere.
          </p>
          <p>
            Filters, sorting, and a smart cart experience make your shopping journey smoother than ever.
          </p>
        </div>
      </div>
      {/* Support */}
      <div className="row align-items-center mb-5 flex-md-row-reverse" data-aos="fade-up">
        <div className="col-md-6">
          <img src={aboutImg4} className="img-fluid rounded shadow-sm" alt="Support" />
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold">Customer Support</h4>
          <p>
            Our support team is ready 24/7 to help you. Whether it’s tracking orders, processing returns, or answering
            product queries — we’re here to assist with a smile.
          </p>
          <p>
            Live chat, email, and call options ensure you’re never left waiting.
          </p>
        </div>
      </div>
      {/* Team Section */}
      <div className="text-center mb-5" data-aos="fade-up">
        <h3 className="fw-bold">MEET <span className="text-primary">OUR TEAM</span></h3>
        <hr className="mx-auto" style={{ width: '60px', borderTop: '2px solid #000' }} />
      </div>
      <div className="row text-center mb-5">
        {teamMembers.map((member, idx) => (
          <div className="col-md-3 mb-4" key={idx} data-aos="zoom-in" data-aos-delay={idx * 100}>
            <img
              src={member.img}
              className="rounded-circle shadow-sm mb-3"
              alt={member.name}
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
            <h6 className="fw-bold mb-0">{member.name}</h6>
            <p className="text-muted mb-0">{member.role}</p>
          </div>
        ))}
      </div>
      {/* Closing */}
      <div className="text-center px-3" data-aos="fade-up">
        <h4 className="fw-bold mb-3">Our Promise</h4>
        <p className="lead">
          At Forever, you're not just a customer – you're a valued part of our journey. We promise quality, transparency,
          and constant innovation to make your online shopping delightful and dependable.
        </p>
      </div>
    </div>
  );
};
export default About;