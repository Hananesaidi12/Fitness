import React, { useState, useEffect, useRef } from "react";
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
  FaTrash,
} from "react-icons/fa";
import Chart from "chart.js/auto";
import axios from "axios";

// === Sidebar ===
const Sidebar = ({ location, notificationsCount }) => {
  const navItems = [
    { icon: FaHome, label: "Home", to: "/" },
    { icon: FaTachometerAlt, label: "Dashboard", to: "/admin/dashboard" },
    { icon: FaUsers, label: "Users", to: "/admin/users" },
    
    
    { icon: FaCog, label: "Settings", to: "/admin/settings" },
    { icon: FaBell, label: "Notifications", to: "/admin/notifications", hasBadge: true },
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

// === Header ===
const Header = ({ userFullName }) => {
  const firstName = userFullName ? userFullName.split(" ")[0] : "";
  return (
    <header style={styles.header}>
      <h2 style={{ margin: 0, color: "#FF6F3C" }}>
        Welcome Admin !
      </h2>
    </header>
  );
};

// === Stat Card ===
const StatCard = ({ label, value }) => (
  <div style={styles.statCard}>
    <p style={styles.statValue}>{value}</p>
    <p style={styles.statLabel}>{label}</p>
  </div>
);

// === Dashboard ===
const DashboardAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userFullName, setUserFullName] = useState("Admin User");
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    reportsGenerated: 0,
    systemUptime: "0 days",
    monthlyData: [],
    labels: [],
    userDistribution: [],
  });
  const [latestUsers, setLatestUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  // Charger nom admin
  useEffect(() => {
    const storedName = localStorage.getItem("user_fullname");
    if (storedName) setUserFullName(storedName);
  }, []);

  // Charger stats, notifications, derniers utilisateurs
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/admin/stats");
        if (!res.ok) throw new Error("Erreur API stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/contacts");
        if (!res.ok) throw new Error("Erreur API notifications");
        const data = await res.json();
        setNotificationsCount(data.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLatestUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get("http://localhost:8000/users?latest=true");
        setLatestUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchStats();
    fetchNotifications();
    fetchLatestUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:8000/user/${id}`);
      setLatestUsers(latestUsers.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur suppression utilisateur");
    } finally {
      setDeletingId(null);
    }
  };

  // === Charts ===
  useEffect(() => {
    if (!lineChartRef.current) return;
    const ctx = lineChartRef.current.getContext("2d");
    if (lineChartRef.current.chartInstance) lineChartRef.current.chartInstance.destroy();
    lineChartRef.current.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: stats.labels,
        datasets: [{ label: "New Users", data: stats.monthlyData, borderColor: "#FF6F3C", backgroundColor: "rgba(255,111,60,0.2)", fill: true, tension: 0.4, pointRadius: 5 }],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }, [stats]);

  useEffect(() => {
    if (!doughnutChartRef.current) return;
    const ctx = doughnutChartRef.current.getContext("2d");
    if (doughnutChartRef.current.chartInstance) doughnutChartRef.current.chartInstance.destroy();
    doughnutChartRef.current.chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: { labels: ["Active", "Inactive", "Suspended"], datasets: [{ data: stats.userDistribution, backgroundColor: ["#FF6F3C", "#4B5563", "#9CA3AF"] }] },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });
  }, [stats]);

  return (
    <div style={styles.page}>
      <Sidebar location={location} notificationsCount={notificationsCount} />
      <main style={styles.mainContent}>
        <Header userFullName={userFullName} />

        {/* === Statistiques === */}
        <section style={styles.statsSection}>
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Active Users" value={stats.activeUsers} />
          
          <StatCard label="System Uptime" value={stats.systemUptime} />
        </section>

        {/* === Graphiques === */}
        <section style={styles.chartsSection}>
          <div style={styles.chartCard}>
            <h5 style={styles.chartTitle}>User Growth</h5>
            <canvas ref={lineChartRef} height="100"></canvas>
          </div>
          <div style={styles.chartCard}>
            <h5 style={styles.chartTitle}>User Distribution</h5>
            <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
              <canvas ref={doughnutChartRef}></canvas>
            </div>
          </div>
        </section>

        {/* === Derniers utilisateurs === */}
        <section style={styles.usersTableSection}>
          <h5 style={styles.chartTitle}>Derniers Utilisateurs</h5>
          {loadingUsers ? (
            <p>Chargement...</p>
          ) : latestUsers.length === 0 ? (
            <p>Aucun utilisateur trouvé</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {latestUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.last_active ? new Date(user.last_active).toLocaleString() : "—"}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        style={styles.actionBtnDelete}
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* === Quick Actions === */}
        <section style={styles.quickActions}>
          <button
            style={styles.actionButton}
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>
       
          <button
            style={styles.actionButton}
            onClick={() => navigate("/admin/settings")}
          >
            Settings
          </button>
        </section>
      </main>
    </div>
  );
};

// === Styles ===

  const styles = {
    page: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "#F3F4F6",
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
  
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#E53935",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: 12,
    fontWeight: "bold",
    minWidth: 18,
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
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  },
  statValue: { fontSize: "28px", fontWeight: "bold", color: "#000000ff" },
  statLabel: { color: "#757575ff", fontWeight: "600" },
  chartsSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    marginBottom: "30px",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  },
  chartTitle: { fontWeight: "bold", marginBottom: "15px" },
  usersTableSection: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
  },
  quickActions: { display: "flex", gap: "20px" },
  actionButton: {
    flex: 1,
    padding: "15px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#FF6F3C",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
    transition: "background 0.3s",
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

export default DashboardAdmin;
