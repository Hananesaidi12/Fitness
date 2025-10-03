import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaTachometerAlt, FaDumbbell, FaAppleAlt,
  FaChartLine, FaUserCircle, FaUsers, FaCog, FaSignOutAlt
} from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/img/dashboard-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#111', // fallback
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderRadius: 12,
        padding: 40,
        color: '#fff',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: 10,
          fontWeight: '700',
          fontSize: '36px'
        }}>
          Welcome to CoreFlex
        </h1>
        <p style={{
          textAlign: 'center',
          marginBottom: 40,
          fontSize: '16px',
          opacity: 0.85
        }}>
          Your personalized fitness dashboard
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 25,
          justifyItems: 'center',
        }}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E04E2B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5733'}
            >
              <Icon size={36} style={{ marginBottom: 10 }} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const navItems = [
  { icon: FaHome, label: 'Home', to: '/' },
  { icon: FaTachometerAlt, label: 'DashbordLite', to: '/dashbordLite' },
  { icon: FaDumbbell, label: 'Workouts', to: '/workouts' },
  { icon: FaAppleAlt, label: 'Nutrition', to: '/nutrition' },
  { icon: FaChartLine, label: 'Progress', to: '/progress' },
  { icon: FaUserCircle, label: 'Profile', to: '/profile' },
  { icon: FaUsers, label: 'Community', to: '/community' },
  { icon: FaCog, label: 'Settings', to: '/settings' },
  { icon: FaSignOutAlt, label: 'Logout', to: '/logout' }
];

const buttonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FF5733',
  padding: '20px',
  borderRadius: 12,
  width: '100%',
  maxWidth: 160,
  height: 130,
  textDecoration: 'none',
  color: '#fff',
  fontWeight: '600',
  textAlign: 'center',
  boxShadow: '0 6px 12px rgba(255, 87, 51, 0.4)',
  transition: 'background-color 0.3s ease',
  cursor: 'pointer',
};

export default Dashboard;
