import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaDribbble } from 'react-icons/fa';


const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement pendant 1.5s puis masquer le loader
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div id="preloder" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#fff', zIndex: 9999
      }}>
        <div className="loader" style={{
          border: '8px solid #f3f3f3',
          borderTop: '8px solid #3498db',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite'
        }}></div>

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
                    <li className="active"><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contacts</Link></li>
                </ul>
            </nav>
            <Link to="/sigin" className="primary-btn signup-btn">Sign in</Link>
            <Link to="/signup" className="primary-btn signup-btn">Sign up</Link>
          </div>
          <div id="mobile-menu-wrap"></div>
        </div>
      </header>
      {/* Header End */}

      {/* Hero Section Begin */}
      <section
  className="hero-section set-bg"
  style={{
    backgroundImage: "url(/img/hom.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center"
  }}
>
  <div className="container">
    <div className="row">
      <div className="col-lg-8">
        <div
          className="hero-text"
          style={{
            background: "rgba(0,0,0,0.4)", // optionnel pour lisibilité
            padding: "20px 30px",
            borderRadius: "12px",
            maxWidth: "500px",
            marginLeft: "-80px" // décale vers la gauche
          }}
        >
          <span style={{ color: "#FF6F3C", fontWeight: "600" }}>
            FITNESS ELEMENTS
          </span>
          <h1 style={{ fontSize: "60px", fontWeight: "bold", color: "#fff" }}>
            CoreFlex
          </h1>
          <p style={{ fontSize: "18px", color: "#f1f1f1" }}>
            Boost your fitness, every day
          </p>
          <Link to="/about" className="primary-btn">
            Read More
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Hero Section End */}

      {/* About Section Begin */}
      <section className="about-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about-pic">
                <img src="/img/about-pic.jpg" alt="About" />
                <a href="https://www.youtube.com/watch?v=SlPhMPnQ58k" className="play-btn video-popup" target="_blank" rel="noreferrer">
                  <img src="/img/play.png" alt="Play" />
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-text">
                <h2>Story About Us</h2>
                <p className="first-para">
                  CoreFlex is a modern fitness app designed to empower individuals to take control of their health and wellness. Whether you’re a beginner or an experienced athlete, CoreFlex offers personalized workout plans, progress tracking, and expert guidance to help you achieve your fitness goals. Our mission is to make fitness accessible, engaging, and effective — boosting your motivation every day and helping you build a stronger, healthier core.
                Join thousands of users who trust CoreFlex to transform their fitness journey with easy-to-follow workouts, nutrition tips, and real-time feedback.
                </p>
                <p className="second-para">
                  Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, gravida
                  quam semper libero sit amet. Etiam rhoncus. Maecenas tempus, tellus eget condimentum
                  rhoncus, gravida quam semper libero sit amet.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section End */}

      {/* Services Section Begin */}
      <section className="services-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="services-pic">
                <img src="/img/services/service-pic.jpg" alt="Services" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="service-items">
                <div className="row">
                  <div className="col-md-6">
                    <div className="services-item bg-gray">
                      <img src="/img/services/service-icon-1.png" alt="Strategies" />
                      <h4>Strategies</h4>
                      <p>Effective fitness strategies tailored to your goals, designed to maximize results and boost performance.</p>
                    </div>
                    <div className="services-item bg-gray pd-b">
                      <img src="/img/services/service-icon-3.png" alt="Workout" />
                      <h4>Workout</h4>
                      <p>Structured workout plans that cater to all levels, helping you build strength, endurance, and flexibility..</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="services-item">
                      <img src="/img/services/service-icon-2.png" alt="Yoga" />
                      <h4>Yoga</h4>
                      <p>Relaxing and strengthening yoga sessions that improve balance, flexibility, and mental focus.</p>
                    </div>
                    <div className="services-item pd-b">
                      <img src="/img/services/service-icon-4.png" alt="Weight Loss" />
                      <h4>Weight Loss</h4>
                      <p>Personalized weight loss programs designed to help you shed pounds safely and effectively.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section End */}

      {/* Classes Section Begin */}
      
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
                <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" aria-label="Instagram"><FaInstagram /></a>
                
            </div>
          </div>
          </div>
          <div
            className="subscribe-option"
            style={{ backgroundImage: 'url(/img/footer-signup.jpg)' }}
          >
            
          </div>
        
        </div>
      </footer>
      {/* Footer Section End */}
    </>
  );
};

export default Home;
