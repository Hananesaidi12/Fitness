import React, { useEffect, useState } from "react";
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
import axios from "axios";

// === Sidebar ===
const Sidebar = ({ notificationsCount = 0 }) => {
  const location = useLocation();
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
        Welcome Admin
      </h2>
    </header>
  );
};

// === UsersPage ===
const UsersPage = () => {
  const navigate = useNavigate();
  const [userFullName, setUserFullName] = useState("Admin User");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem("user_fullname");
    if (storedName) setUserFullName(storedName);
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setError(null);
    } catch (err) {
      console.error("Erreur fetch users", err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/contacts");
      setNotificationsCount(res.data.length);
    } catch (err) {
      console.error("Erreur fetch notifications", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:8000/user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err.response || err);
      alert("Erreur lors de la suppression : " + (err.response?.data?.detail || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={styles.page}>
      <Sidebar notificationsCount={notificationsCount} />
      <main style={styles.mainContent}>
        <Header userFullName={userFullName} />

        <section>
          <h2 style={{ marginBottom: 20, color: "#1E2A38" }}>Users Management</h2>

          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

          <div style={{ overflowX: "auto", borderRadius: 12 }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Gender</th>
                  <th style={styles.th}>Level</th>
                  <th style={styles.th}>Last Active</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th} align="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>{user.first_name} {user.last_name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.age}</td>
                    <td style={styles.td}>{user.gender}</td>
                    <td style={styles.td}>{user.level}</td>
                    <td style={styles.td}>{user.last_active ? new Date(user.last_active).toLocaleString() : "—"}</td>
                    <td style={styles.td}>{user.role}</td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        style={styles.actionBtnDelete}
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        title="Delete user"
                      >
                        <FaTrash />
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

// === Styles ===
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

export default UsersPage;
