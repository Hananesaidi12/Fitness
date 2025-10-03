import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaEye,
  FaDownload
} from "react-icons/fa";

// Sidebar component
const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { icon: FaHome, label: "Home", to: "/" },
    { icon: FaTachometerAlt, label: "Dashboard", to: "/admin/dashboard" },
    { icon: FaUsers, label: "Users", to: "/admin/users" },
    { icon: FaClipboardList, label: "Reports", to: "/admin/reports" },
    { icon: FaChartPie, label: "Analytics", to: "/admin/analytics" },
    { icon: FaCog, label: "Settings", to: "/admin/settings" },
    { icon: FaBell, label: "Notifications", to: "/admin/notifications" },
    { icon: FaSignOutAlt, label: "Logout", to: "/logout" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        Admin<span style={{ color: "#FF6F3C" }}>Panel</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map(({ icon: Icon, label, to }) => {
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
              <Icon size={20} style={{ marginRight: 12 }} />
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
    ? userFullName.split(" ").map(n => n[0]).join("").toUpperCase()
    : "";
  const firstName = userFullName ? userFullName.split(" ")[0] : "";

  return (
    <header style={styles.header}>
      <div>
        <h2 style={{ margin: 0, color: "#FF6F3C" }}>
          Reports{firstName ? ` – Welcome ${firstName}` : ""}
        </h2>
      </div>
      <div>
        <Link to="/profile" style={styles.profileBtn}>
          <div style={styles.avatarInitials}>{initials}</div>
          Profile
        </Link>
      </div>
    </header>
  );
};

// ReportsPage component
const ReportsPage = () => {
  const [userFullName, setUserFullName] = useState("Admin User");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem("user_fullname");
    if (storedName) setUserFullName(storedName);

    // Simulation d'un fetch API
    setReports([
      { id: 1, title: "Monthly Activity", date: "2025-07-01", type: "PDF" },
      { id: 2, title: "User Engagement", date: "2025-06-15", type: "Excel" },
      { id: 3, title: "System Logs", date: "2025-06-01", type: "TXT" },
    ]);
  }, []);

  const handleView = (id) => {
    alert(`Viewing report ID: ${id}`);
  };

  const handleDownload = (id) => {
    alert(`Downloading report ID: ${id}`);
  };

  return (
    <div style={styles.page}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Header userFullName={userFullName} />

        <section>
          <h2 style={{ marginBottom: 20, color: "#1E2A38" }}>Reports Management</h2>

          <div style={{ overflowX: "auto", borderRadius: 12 }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th} align="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} style={styles.tr}>
                    <td style={styles.td}>{report.title}</td>
                    <td style={styles.td}>
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{report.type}</td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        style={styles.actionBtnView}
                        onClick={() => handleView(report.id)}
                        title="View Report"
                      >
                        <FaEye />
                      </button>
                      <button
                        style={styles.actionBtnDownload}
                        onClick={() => handleDownload(report.id)}
                        title="Download Report"
                      >
                        <FaDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    backgroundColor: "#F5F7FA",
    color: "#333",
  },
  sidebar: {
    width: 240,
    backgroundColor: "#1E2A38",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 40,
  },
  nav: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  navLink: {
    color: "#AAB8C2",
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
  profileBtn: {
    display: "inline-flex",
    alignItems: "center",
    background: "#FF6F3C",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 25,
    fontWeight: "700",
    fontSize: 14,
    textDecoration: "none",
    boxShadow: "0 4px 10px rgba(255,111,60,0.4)",
    cursor: "pointer",
  },
  avatarInitials: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: "#fff",
    color: "#FF6F3C",
    fontWeight: "700",
    fontSize: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  th: {
    padding: "16px",
    backgroundColor: "#FF6F3C",
    color: "#fff",
    textAlign: "left",
    fontWeight: "600",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #eee",
    fontSize: 15,
    verticalAlign: "middle",
  },
  tr: {
    transition: "background 0.2s ease",
  },
  actionBtnView: {
    background: "#42A5F5",
    border: "none",
    borderRadius: "50%",
    width: 36,
    height: 36,
    marginRight: 10,
    cursor: "pointer",
    color: "#fff",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    transition: "background 0.3s ease",
  },
  actionBtnDownload: {
    background: "#66BB6A",
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

export default ReportsPage;
