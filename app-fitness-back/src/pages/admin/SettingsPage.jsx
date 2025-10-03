import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

// Sidebar component
const Sidebar = ({ notificationsCount }) => {
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
              style={{ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) }}
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
const Header = () => (
  <header style={styles.header}>
    <h2 style={{ margin: 0, color: "#FF6F3C" }}>Paramètres Admin</h2>
  </header>
);

// SettingsPage component
const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminId = 1; // Remplacer par ID depuis session/localStorage
        const res = await fetch(`http://localhost:8000/admin/${adminId}`);
        if (!res.ok) throw new Error("Admin non trouvé");
        const data = await res.json();
        setEmail(data.email);
        setDarkMode(data.dark_mode || false);
        setEmailNotif(data.email_notifications || true);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des données : " + err.message);
      }
    };
    fetchAdmin();
  }, []);

  const handleSave = async () => {
    try {
      const adminId = 1;
      const res = await fetch(`http://localhost:8000/admin/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password, // Si vide, backend peut ignorer
          dark_mode: darkMode,
          email_notifications: emailNotif,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      alert("Paramètres sauvegardés !");
      setPassword(""); // reset champ mot de passe
    } catch (err) {
      console.error(err);
      alert("Erreur : " + err.message);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;

  return (
    <div style={styles.page}>
      <Sidebar notificationsCount={3} />
      <main style={styles.mainContent}>
        <Header />

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Profil</h3>
          <div style={styles.formGroup}>
            <label>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Mot de passe :</label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Préférences</h3>
          <div style={styles.toggle}>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
            />
            <span>Recevoir des notifications par email</span>
          </div>
          <div style={styles.toggle}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span>Activer le mode sombre</span>
          </div>
        </section>

        <button style={styles.saveBtn} onClick={handleSave}>
           Sauvegarder
        </button>
      </main>
    </div>
  );
};

const styles = {
  page: { display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif", background: "#FAFBFC" },
  sidebar: { width: 250, background: "#000", padding: "30px 20px", display: "flex", flexDirection: "column" },
  logo: { fontSize: 28, fontWeight: "900", marginBottom: 40, color: "#fff" },
  nav: { flexGrow: 1, display: "flex", flexDirection: "column" },
  navLink: { color: "#ccc", textDecoration: "none", fontWeight: "600", fontSize: 16, padding: "12px 20px", marginBottom: 15, borderRadius: 10, display: "flex", alignItems: "center", transition: "background 0.3s ease, color 0.3s ease" },
  navLinkActive: { backgroundColor: "#FF6F3C", color: "#fff" },
  badge: { position: "absolute", top: -8, right: -8, backgroundColor: "#E53935", color: "#fff", borderRadius: "50%", padding: "2px 6px", fontSize: "12px", fontWeight: "bold" },
  mainContent: { flexGrow: 1, padding: 40, overflowY: "auto" },
  header: { display: "flex", alignItems: "center", height: 60, padding: "0 20px", backgroundColor: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  section: { marginBottom: 40, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" },
  sectionTitle: { marginBottom: 20, fontSize: 18, fontWeight: "700", color: "#333" },
  formGroup: { marginBottom: 15, display: "flex", flexDirection: "column" },
  input: { padding: 10, borderRadius: 6, border: "1px solid #ccc" },
  toggle: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  saveBtn: { background: "#FF6F3C", border: "none", padding: "12px 20px", borderRadius: 8, color: "#fff", fontWeight: "600", cursor: "pointer", marginTop: 20 },
};

export default SettingsPage;
