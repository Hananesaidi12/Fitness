// ./components/Layout.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaDumbbell,
  FaAppleAlt,
  FaChartLine,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { icon: FaHome, label: "Home", to: "/" },
  { icon: FaTachometerAlt, label: "Dashboard", to: "/dashbordLite" },
  { icon: FaDumbbell, label: "Workouts", to: "/workouts" },
  { icon: FaAppleAlt, label: "Nutrition", to: "/Nutrition" },
  { icon: FaChartLine, label: "Progress", to: "/progress" },
  { icon: FaUsers, label: "Community", to: "/community" },
  { icon: FaCog, label: "Settings", to: "/settings" },
  { icon: FaSignOutAlt, label: "Logout", to: "/logout" },
];

const Layout = ({ title, children }) => {
  const location = useLocation();
  const [userFullName, setUserFullName] = useState("Utilisateur");

  useEffect(() => {
    const name = localStorage.getItem("user_fullname") || "";
    if (name) setUserFullName(name);
  }, []);

  const getInitials = (fullName) => {
    const parts = fullName.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : fullName[0]?.toUpperCase() || "?";
  };

  const isActive = (to) => location.pathname === to;

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
                  <h1
  style={{
    fontSize: 28,
    fontWeight: '900',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    background: 'linear-gradient(to right, #ffffffff 10%, #ffffffff 30%,  #FF6F3C 30%,  #FF6F3C 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
    
  }}
>
  CoreFlex
</h1>

        </div>
        <nav style={styles.nav}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                ...styles.navLink,
                ...(isActive(to) ? styles.navLinkActive : {}),
              }}
            >
              <Icon size={18} style={{ marginRight: 10 }} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h2 style={{ margin: 0, color: "#FF6F3C" }}>{title}</h2>
          <Link to="/profile" style={styles.profileBtn}>
            <div style={styles.profileCircle}>{getInitials(userFullName)}</div>
          </Link>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "#FAFBFC",
    color: "#000000ff",
  },
  sidebar: {
    width: 250,
    background: "#000000ff",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "3px 0 15px rgba(0,0,0,0.1)",
  },
  logo: { fontSize: 28, fontWeight: "900", marginBottom: 40, color: "#ffffffff" },
  nav: { flexGrow: 1, display: "flex", flexDirection: "column" },
  navLink: {
    color: "#efe7e7ff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: 16,
    padding: "12px 20px",
    marginBottom: 15,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    transition: "background 0.3s ease, color 0.3s ease",
  },
  navLinkActive: {
    background: "#FF6F3C",
    color: "#fff",
    fontWeight: "700",
    boxShadow: "0 5px 12px rgba(255,111,60,0.5)",
  },
  mainContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: "30px 40px",
    overflowY: "auto",
  },
  header: {
    height: 60,
    marginBottom: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "0 30px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.1)",
    borderRadius: 10,
  },
  profileBtn: {
    display: "inline-flex",
    alignItems: "center",
    background: "#FF6F3C",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 50,
    fontWeight: "700",
    fontSize: 14,
    textDecoration: "none",
    boxShadow: "0 4px 10px rgba(255,111,60,0.4)",
    cursor: "pointer",
    gap: 10,
  },
  profileCircle: {
    background: "#fff",
    color: "#FF6F3C",
    borderRadius: "50%",
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: 14,
  },
};

export default Layout;
