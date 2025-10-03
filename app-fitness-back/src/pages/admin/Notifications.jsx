import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaClock,
  FaTrash,
} from "react-icons/fa";

// Sidebar component
const Sidebar = ({ notificationsCount }) => {
  const location = useLocation();
  const navItems = [
    { icon: FaHome, label: "Home", to: "/" },
    { icon: FaTachometerAlt, label: "Dashboard", to: "/admin/dashboard" },
    { icon: FaUsers, label: "Users", to: "/admin/users" },
   
    { icon: FaCog, label: "Settings", to: "/admin/settings" },
    {
      icon: FaBell,
      label: "Notifications",
      to: "/admin/notifications",
      hasBadge: true,
    },
    { icon: FaSignOutAlt, label: "Logout", to: "/logout" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        Admin<span style={{ color: "#FF6F3C" }}>Panel</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map(({ icon: Icon, label, to, hasBadge }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={label}
              to={to}
              style={{
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              }}
            >
              <div style={{ position: "relative", marginRight: 12 }}>
                <Icon size={20} />
                {hasBadge && notificationsCount > 0 && (
                  <span style={styles.badge}>{notificationsCount}</span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

// Header component
const Header = ({ userFullName }) => {
  const initials = userFullName
    ? userFullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "";
  const firstName = userFullName ? userFullName.split(" ")[0] : "";

  return (
    <header style={styles.header}>
      <div>
        <h2 style={{ margin: 0, color: "#FF6F3C" }}>
          Notifications 
        </h2>
      </div>
    </header>
  );
};

// NotificationsPage component
const NotificationsPage = () => {
  const [userFullName, setUserFullName] = useState("Admin User");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem("user_fullname");
    if (storedName) setUserFullName(storedName);

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/contacts");
        setNotifications(res.data);
      } catch (err) {
        console.error("Erreur récupération notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette notification ?")) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div style={styles.page}>
      <Sidebar notificationsCount={notifications.length} />
      <main style={styles.mainContent}>
        <Header userFullName={userFullName} />

        <section>
          <h2 style={{ marginBottom: 20, color: "#1E2A38" }}>
            Notifications Center
          </h2>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-muted">Aucune notification disponible.</p>
          ) : (
            <div className="list-group">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="list-group-item list-group-item-action mb-3 shadow-sm rounded"
                  style={{ borderLeft: "6px solid #FF6F3C" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="badge bg-success text-white px-3 py-2"
                      style={{ borderRadius: "8px" }}
                    >
                      Message
                    </span>
                    <small className="text-muted d-flex align-items-center">
                      <FaClock className="me-2" />
                      {new Date(notif.created_at).toLocaleString()}
                    </small>
                  </div>

                  <div className="mt-3">
                    <h6 className="fw-bold text-dark">
                      {notif.name} ({notif.email})
                    </h6>
                    <p className="text-secondary mb-1">{notif.message}</p>
                  </div>

                  
                </div>
              ))}
            </div>
          )}
        </section>
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
    backgroundColor: "#FF6F3C",
    color: "#fff",
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#E53935",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
    fontWeight: "bold",
    minWidth: "18px",
    textAlign: "center",
  },
  mainContent: {
    flexGrow: 1,
    padding: 40,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    padding: "0 20px",
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  actionBtnDelete: {
    background: "#EF5350",
    border: "none",
    borderRadius: "50%",
    width: 36,
    height: 36,
    cursor: "pointer",
    color: "#fff",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    transition: "background 0.3s ease",
  },
};

export default NotificationsPage;
