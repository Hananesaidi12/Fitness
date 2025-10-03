import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaDribbble } from 'react-icons/fa';


const AboutUs = () => {
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
                    <li ><Link to="/">Home</Link></li>
                    <li className="active"><Link to="/about">About</Link></li>
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

      {/* Breadcrumb Section Begin */}
      <section
        className="breadcrumb-section set-bg"
        style={{ backgroundImage: 'url(/img/hom.png)' }}
      >
       
      </section>
      {/* Breadcrumb Section End */}

      {/* About Section Begin */}
      <section className="about-section about-page spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about-pic">
                <img src="/img/about-pic.jpg" alt="About" />
                <a
                  href="https://www.youtube.com/watch?v=SlPhMPnQ58k"
                  className="play-btn video-popup"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/img/play.png" alt="Play" />
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-text">
                <h2>Story About Us</h2>
                <p className="first-para">
                  At CoreFlex, we believe that fitness is more than just a routine—it’s a lifestyle. Founded by a team of passionate health enthusiasts, CoreFlex was created to empower people of all levels to take control of their wellness journey. From beginners trying to build healthy habits to athletes pushing their limits, our mission is to provide personalized guidance, innovative workouts, and continuous motivation.

                  We understand the challenges of maintaining a balanced and active life in today’s busy world. That’s why CoreFlex combines expert knowledge with easy-to-follow plans, designed to fit seamlessly into your daily routine. Our community thrives on support, encouragement, and shared success.

                  Join us at CoreFlex and take the first step toward a stronger, healthier you. Because your fitness journey deserves to be inspiring, effective, and above all, yours.


                </p>
                <p className="second-para">
                  Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, gravida
                  quam semper libero sit amet.
                </p>
                <img src="/img/about-signature.png" alt="Signature" />
                
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section End */}

      {/* About Counter Section Begin */}
      <div className="about-counter">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="about-counter-text">
                
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Counter Section End */}

      {/* Gym Award Section Begin */}
      <section className="gym-award spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="award-text">
                <h2>Best gym award</h2>
                <p>
                 We are proud to have been recognized as the best gym for our commitment to quality training, excellent facilities, and outstanding customer service. Our dedicated coaches and welcoming environment have earned us this prestigious award, and we strive every day to maintain the highest standards for our members.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <img src="/img/core.png" alt="Award" />
            </div>
          </div>
        </div>
      </section>
      {/* Gym Award Section End */}

      {/* Banner Section Begin */}
      <section
        className="banner-section set-bg"
        style={{ backgroundImage: 'url(/img/banner-bg.jpg)' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="banner-text">
                <h2>Get training today</h2>
                <p>
                  Join our expert-led training sessions and start your fitness journey now. Whether you're a beginner or a pro, we offer personalized workouts tailored just for you.
                </p>
                <a href="/signup" className="primary-btn banner-btn">Sign Up Now</a>
              </div>
            </div>
            <div className="col-lg-5">
              <img src="/img/banner-person.png" alt="Banner Person" />
            </div>
          </div>
        </div>
      </section>
      {/* Banner Section End */}

      {/* Trainer Section Begin */}
      <section className="trainer-section about-trainer spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>EXPERT TRAINERS</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Trainer 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="single-trainer-item">
                <img src="/img/trainer/about-trainer-1.jpg" alt="Patrick Cortez" />
                <div className="trainer-text">
                  <h5>Patrick Cortez</h5>
                  <span>Team Leader</span>
                  <p>Patrick leads our team with passion and expertise, ensuring every member reaches their fitness goals</p>
                  <div className="trainer-social">
                    <a href="#"><i className="fa fa-facebook"></i></a>
                    <a href="#"><i className="fa fa-instagram"></i></a>
                    <a href="#"><i className="fa fa-twitter"></i></a>
                    <a href="#"><i className="fa fa-pinterest"></i></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="single-trainer-item">
                <img src="/img/trainer/about-trainer-2.jpg" alt="Gregory Powers" />
                <div className="trainer-text">
                  <h5>Gregory Powers</h5>
                  <span>Gym coach</span>
                  <p>Gregory specializes in strength training and motivates clients to push their limits safely.</p>
                  <div className="trainer-social">
                    <a href="#"><i className="fa fa-facebook"></i></a>
                    <a href="#"><i className="fa fa-instagram"></i></a>
                    <a href="#"><i className="fa fa-twitter"></i></a>
                    <a href="#"><i className="fa fa-pinterest"></i></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="single-trainer-item">
                <img src="/img/trainer/about-trainer-3.jpg" alt="Walter Wagner" />
                <div className="trainer-text">
                  <h5>Walter Wagner</h5>
                  <span>Dance trainer</span>
                  <p>Walter combines dance and fitness to offer dynamic sessions that improve flexibility and coordination.</p>
                  <div className="trainer-social">
                    <a href="#"><i className="fa fa-facebook"></i></a>
                    <a href="#"><i className="fa fa-instagram"></i></a>
                    <a href="#"><i className="fa fa-twitter"></i></a>
                    <a href="#"><i className="fa fa-pinterest"></i></a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Trainer Section End */}

      {/* Footer Banner Section Begin */}
      <section
  className="banner-section set-bg"
  style={{ backgroundImage: 'url(/img/footer-banner/footer-banner-2.jpg)' }}
>
  <div className="container-fluid">
    <div className="row">
      <div className="col-lg-6">
        <div
          className="footer-banner-item set-bg"
          
        >
          <span>contact us</span>
          <h2>0563700803</h2>
          <p>If you trust us on your journey, we will not disappoint you!</p>
          <a href="/contact" className="primary-btn">Get Started</a>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Footer Banner Section End */}

      {/* Footer Banner Section End */}

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
      
      export default AboutUs;
      