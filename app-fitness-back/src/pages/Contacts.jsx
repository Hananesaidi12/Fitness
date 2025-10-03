import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Contacts = () => {
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Simuler un chargement pendant 1.5s puis masquer le loader
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Gestion changement inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/contacts", formData);
      setStatus({ success: true, msg: "Message envoyé avec succès ✅" });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ success: false, msg: "Erreur lors de l'envoi ❌" });
    }
  };

  if (loading) {
    return (
      <div
        id="preloder"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        <div
          className="loader"
          style={{
            border: "8px solid #f3f3f3",
            borderTop: "8px solid #3498db",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            animation: "spin 1s linear infinite",
          }}
        ></div>

        {/* Animation CSS pour loader */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
       {/* Header Section Begin */}
                  <header className="header-section" >
        <div className="container">
          
           <div
    className="container"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}
  ></div>
    <div className="logo">
      <a href="./" style={{ textDecoration: 'none' }}>
       <h1
  style={{
    fontSize: '40px',
    fontWeight: 'bold',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    background: 'linear-gradient(to right, #FF5733 0%, #FF5733 50%, #ffffff 50%, #ffffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
  }}
>
  CoreFlex
</h1>

          
        
      </a>
    </div>


          <div className="nav-menu">
            <nav className="mainmenu mobile-menu">
                <ul>
                    <li ><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li className="active"><Link to="/contact">Contacts</Link></li>
                </ul>
            </nav>
            <Link to="/sigin" className="primary-btn signup-btn">Sign in</Link>
            <Link to="/signup" className="primary-btn signup-btn">Sign up</Link>
          </div>
          <div id="mobile-menu-wrap"></div>
        </div>
      </header>
      {/* Header End */}
                  {/* Header End */}
      
            {/* Breadcrumb Section Begin */}
            <section
              className="breadcrumb-section set-bg"
              style={{ backgroundImage: 'url(/img/hom.png)' }}
            ></section>
      {/* Breadcrumb Section End */}

      {/* Map Section Begin */}
      <div className="map position-relative">
        <iframe
          title="location-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.302931760337!2d-6.850965385027546!3d34.02088242676374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b9ec66fa1a7%3A0x8f6c9b0e63cbd0f1!2sRabat%2C%20Morocco!5e0!3m2!1sen!2sma!4v1693401000000!5m2!1sen!2sma"
          height="500"
          style={{ border: 0, width: "100%", borderRadius: "12px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        {/* Optional custom icon overlay */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "rgba(255, 111, 60, 0.9)",
            color: "#fff",
            padding: "10px 15px",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          📍 CoreFlex – Rabat
        </div>
      </div>
      {/* Map Section End */}

      {/* Contact Section Begin */}
      <section className="contact-section spad">
        <div className="container">
          <div className="row">
            {/* Contact Info */}
            <div className="col-lg-4">
              <div className="contact-info">
                <h4>Contact Us</h4>
                <div className="contact-address">
                  <div className="ca-widget">
                    <div className="cw-icon">
                      <img src="img/icon/icon-1.png" alt="" />
                    </div>
                    <div className="cw-text">
                      <h5>Our Location</h5>
                      <p>Rabat</p>
                    </div>
                  </div>
                  <div className="ca-widget">
                    <div className="cw-icon">
                      <img src="img/icon/icon-2.png" alt="" />
                    </div>
                    <div className="cw-text">
                      <h5>Phone:</h5>
                      <p>0563700803</p>
                    </div>
                  </div>
                  <div className="ca-widget">
                    <div className="cw-icon">
                      <img src="img/icon/icon-3.png" alt="" />
                    </div>
                    <div className="cw-text">
                      <h5>Mail</h5>
                      <p>contactcompany@CoreFlex.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="contact-form">
                <h4>Leave A Comment</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-12">
                      <textarea
                        name="message"
                        placeholder="Your message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <button type="submit">Send Message</button>
                    </div>
                  </div>
                </form>
                {status && (
                  <p
                    style={{
                      color: status.success ? "green" : "red",
                      marginTop: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {status.msg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section End */}

      {/* Footer Section Begin */}
      <footer className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="contact-option">
                <span>Phone</span>
                <p>(+212) 0563700803 - (+212) 0800123000</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="contact-option">
                <span>Address</span>
                <p>Rabat</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="contact-option">
                <span>Email</span>
                <p>contactcompany@CoreFlex.com</p>
              </div>
            </div>
            <div className="copyright-text">
              <div className="footer-social">
                <a href="#" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
          <div
            className="subscribe-option"
            style={{ backgroundImage: "url(/img/footer-signup.jpg)" }}
          ></div>
        </div>
      </footer>
      {/* Footer Section End */}
    </>
  );
};

export default Contacts;
