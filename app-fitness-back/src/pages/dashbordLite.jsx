import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome, FaTachometerAlt, FaDumbbell, FaAppleAlt, FaChartLine,
  FaUsers, FaCog, FaSignOutAlt
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, Cell, 
  PieChart, Pie, Legend, RadialBarChart, RadialBar
} from "recharts";


// === Sidebar ===
const Sidebar = ({ location }) => {
  const navItems = [
    { icon: FaHome, label: "Home", to: "/" },
    { icon: FaTachometerAlt, label: "Dashboard", to: "/dashbordLite" },
    { icon: FaDumbbell, label: "Workouts", to: "/workouts" },
    { icon: FaAppleAlt, label: "Nutrition", to: "/nutrition" },
    { icon: FaChartLine, label: "Progress", to: "/progress" },
    { icon: FaUsers, label: "Community", to: "/community" },
    { icon: FaCog, label: "Settings", to: "/settings" },
    { icon: FaSignOutAlt, label: "Logout", to: "/logout" },
  ];

  return (
  // ✅ comme ton image est dans le même dossier

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
    {navItems.map(({ icon: Icon, label, to }) => {
      const isActive = location.pathname === to;
      return (
        <Link 
          key={label} 
          to={to} 
          style={{ 
            ...styles.navLink, 
            ...(isActive ? styles.navLinkActive : {}) 
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

// === Header ===
const Header = ({ userFullName }) => {
  const initials = userFullName ? userFullName.split(" ").map(n => n[0].toUpperCase()).join("") : "";
  return (
    <header style={styles.header}>
      <h2 style={{ margin: 0, color: "#FF6F3C" }}>
        Welcome back, {userFullName.split(" ")[0]}!
      </h2>
      <Link to="/profile" style={styles.profileBtn}>
        <div style={styles.avatarInitials}>{initials}</div> Profile
      </Link>
    </header>
  );
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });


// === Stat Card ===
const StatCard = ({ label, value }) => (
  <div style={styles.statCard}>
    <p style={styles.statValue}>{value}</p>
    <p style={styles.statLabel}>{label}</p>
  </div>
);

// === Dashboard Lite ===
// === Dans DashboardLite ===

const DashboardLite = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [nutritionResults, setNutritionResults] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);

  const [userFullName, setUserFullName] = useState("Utilisateur");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsDone: 0,
    caloriesBurned: 0,
    activeDays: 0,
    progressPercent: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [dailyCalories, setDailyCalories] = useState();
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [profile, setProfile] = useState({
  age: null,
  weight: null,
  height: null,
  bmi: null,
  goal: null,
});

  useEffect(() => {
  const storedName = localStorage.getItem("user_fullname");
  if (storedName) setUserFullName(storedName);
// Charger le profil utilisateur (depuis localStorage ou API)
const storedProfile = localStorage.getItem("user_profile");
if (storedProfile) {
  setProfile(JSON.parse(storedProfile));
}

  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await axios.get(
        `http://localhost:8000/client/stats?user_id=${userId}`
      );
      const data = res.data || {};

      setStats({
        workoutsDone: data.workoutsDone ?? 0,
        caloriesBurned: data.caloriesBurned ?? 0,
        activeDays: data.activeDays ?? 0,
        progressPercent: data.progressPercent ?? 0,
      });

      const saved = localStorage.getItem(`nutrition_plans_${userId}`);
if (saved) {
  const parsedPlans = JSON.parse(saved);
  setSavedPlans(parsedPlans);

  if (parsedPlans.length > 0) {
    // 🔹 Trier par date décroissante
    const sortedPlans = [...parsedPlans].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // 🔹 Prendre le plus récent
    const lastPlan = sortedPlans[0];
    setActivePlan(lastPlan);

    // 🔹 Mettre à jour graphiques
    setDailyCalories([
      { date: lastPlan.date, calories: Number(lastPlan.calories) || 0 },
    ]);
    setMacros({
      protein: Number(lastPlan.macros?.protein) || 0,
      carbs: Number(lastPlan.macros?.carbs) || 0,
      fat: Number(lastPlan.macros?.fat) || 0,
    });
  }
}

    } catch (err) {
      console.error("Erreur chargement stats client:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);




  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  if (loading) return <p style={{ padding: 40 }}>Chargement...</p>;

  const hasMacroData = macros.protein + macros.carbs + macros.fat > 0;
  const hasCaloriesData = dailyCalories > 0;
  // Charger un plan sauvegardé comme actif
const loadSavedPlan = (plan) => {
  setActivePlan(plan);
  const userId = localStorage.getItem("userId");
  if (userId) {
    localStorage.setItem(`activePlan_${userId}`, JSON.stringify(plan));
  }
};

// Supprimer un plan sauvegardé
const deleteSavedPlan = (planId) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const updatedPlans = savedPlans.filter((p) => p.id !== planId);
  setSavedPlans(updatedPlans);
  localStorage.setItem(`nutrition_plans_${userId}`, JSON.stringify(updatedPlans));
  // Définir comme plan actif
  setActivePlan(mealPlan);
  localStorage.setItem(`activePlan_${userId}`, JSON.stringify(mealPlan));

  // Si c'était le plan actif → on le retire aussi
  const currentActive = JSON.parse(localStorage.getItem(`activePlan_${userId}`));
  if (currentActive?.id === planId) {
    setActivePlan(null);
    localStorage.removeItem(`activePlan_${userId}`);
  }
};

  return (
    <div style={styles.page}>
      <Sidebar location={location} />
      <main style={styles.mainContent}>
        <Header userFullName={userFullName} />

        {/* === Stats Cards === */}
       <section style={styles.statsSection}>
  <StatCard label="Workouts Done" value={stats.workoutsDone > 0 ? stats.workoutsDone : "–"} />
  <StatCard label="Calories Burned" value={stats.caloriesBurned > 0 ? `${stats.caloriesBurned} kcal` : "–"} />
  <StatCard label="Active Days" value={stats.activeDays > 0 ? stats.activeDays : "–"} />
  <StatCard label="Progress" value={stats.progressPercent > 0 ? `${stats.progressPercent}%` : "–"} />
</section>


        {/* === Nutrition Charts === */}
<section style={styles.chartSection}>
  <div style={styles.card}>
    <h3 style={styles.title}>Macro Distribution</h3>
    {macros ? (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={[
            { name: "Proteins", value: macros.protein || 0 },
            { name: "Carbs", value: macros.carbs || 0 },
            { name: "Fats", value: macros.fat || 0 },
          ]}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            <Cell fill="#a8a5e0ff" /> {/* Proteins */}
            <Cell fill="#b0dcc1ff" /> {/* Carbs */}
            <Cell fill="#f4cc7aff" /> {/* Fats */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <p>No nutrition data available</p>
    )}
  </div>

  <div style={styles.card}>
    <h3 style={styles.title}>Calorie Tracking</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={dailyCalories}>
        <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="calories" fill="#7db043ff" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</section>



<section style={styles.cardSection}>
  {/* 🔹 Section des plans sauvegardés */}
  <h3 style={{ ...styles.title, marginTop: 20 }}>Plans sauvegardés</h3>

  {savedPlans.length > 0 ? (
    <table style={styles.table}>
      <thead>
        <tr style={styles.tableHeadRow}>
          <th style={styles.th}>Date</th>
          <th style={styles.th}>Objectif</th>
          <th style={styles.th}>Calories / jour</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {savedPlans.map((plan) => (
          <tr key={plan.id} style={styles.tableRow}>
            <td style={styles.td}>{plan.date}</td>
            <td style={styles.td}>
             <span
  style={{
    ...styles.badge,
    background: {
      "Perte de poids": "#e74c3c",         // rouge
      "Gain musculaire": "#52d388ff",       // vert
      "Maintien": "#40a2e3ff",              // bleu
      "Amélioration de la santé": "#a479b5ff", // violet
    }[plan.answers.goal] || "#7f8c8d", // fallback gris si autre
  }}
>
  {plan.answers.goal}
</span>

            </td>
            <td style={styles.td}>{plan.calories} kcal</td>
            <td style={styles.actionCell}>
              {/* Supprimer plan */}
              <button
                onClick={() => deleteSavedPlan(plan.id)}
                style={styles.deleteBtn}
                title="Supprimer ce plan"
              >
                🗑
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={styles.emptyMessage}>
      Aucun plan sauvegardé pour le moment...
    </p>
  )}
</section>

{/* 🔹 Actions rapides */}
<section style={styles.quickActions}>
  <button
    style={styles.actionButton}
    onClick={() => navigate("/workouts")}
  >
     Start Workout
  </button>
  <button
    style={{ ...styles.actionButton }}
    onClick={() => navigate("/nutrition")}
  >
     Add Nutrition
  </button>
</section>


      </main>
    </div>
  );
};

const styles = {
  page: { display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif", backgroundColor: "#F5F7FA" },
  sidebar: { width: 240, background: "#000000ff", padding: "30px 20px", display: "flex", flexDirection: "column" },
  logo: { fontSize: 28, fontWeight: "900", color: "#fff", marginBottom: 40 },
  nav: { flexGrow: 1, display: "flex", flexDirection: "column" },
  navLink: { color: "#efe7e7ff", textDecoration: "none", fontWeight: "600", fontSize: 16, padding: "12px 20px", marginBottom: 15, borderRadius: 10, display: "flex", alignItems: "center", transition: "all 0.3s" },
  navLinkActive: { backgroundColor: "#FF6F3C", color: "#fff", fontWeight: "700" },
  mainContent: { flexGrow: 1, padding: 40, overflowY: "auto", display: "flex", flexDirection: "column", gap: 40 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", height: 60, padding: "0 20px", backgroundColor: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  profileBtn: { display: "inline-flex", alignItems: "center", background: "#FF6F3C", color: "#fff", padding: "8px 16px", borderRadius: 25, fontWeight: "700", fontSize: 14, textDecoration: "none" },
  avatarInitials: { width: 28, height: 28, borderRadius: "50%", backgroundColor: "#fff", color: "#FF6F3C", fontWeight: "700", fontSize: 14, display: "flex", justifyContent: "center", alignItems: "center", marginRight: 8 },
  statsSection: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 20 },
  statCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 10px 25px rgba(255,111,60,0.15)", textAlign: "center" },
  statValue: { fontSize: 32, fontWeight: "900", color: "#FF6F3C" },
  statLabel: { fontSize: 16, fontWeight: "600", color: "#555" },
  chartSection: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 10px 25px rgba(255,111,60,0.15)" },
  title: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 12 },
  grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 },
  cardSection: { backgroundColor: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 10px 25px rgba(255,111,60,0.15)" },
  table: {
  width: "100%",
  borderCollapse: "collapse",
  borderRadius: 8,
  overflow: "hidden",
},
tableHeadRow: {
  background: "#ecf0f1",
},
tableRow: {
  transition: "background 0.2s ease",
  cursor: "pointer",
},
tableRowHover: {
  background: "#f9f9f9",
},
th: {
  padding: "12px",
  textAlign: "left",
  fontWeight: "700",
  fontSize: 14,
  color: "#555",
  borderBottom: "2px solid #ddd",
},
td: {
  padding: "12px",
  fontSize: 14,
  color: "#333",
  borderBottom: "1px solid #eee",
},
badge: {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 20,
  color: "#fff",
  fontSize: 12,
  fontWeight: "600",
},
actionCell: {
  textAlign: "center",
},
deleteBtn: {
  border: "none",
  background: "#e74c3c",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  transition: "all 0.2s",
},
deleteBtnHover: {
  background: "#c0392b",
},
emptyMessage: {
  textAlign: "center",
  marginTop: "20px",
  color: "#7f8c8d",
  fontStyle: "italic",
},
quickActions: {
  display: "flex",
  gap: 20,
  marginTop: 20,
},
actionButton: {
  flex: 1,
  padding: "14px 0",
  borderRadius: 30,
  backgroundColor: "#FF6F3C",
  color: "#fff",
  fontWeight: "700",
  fontSize: 18,
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s",
},

  actionButton: {
    flex: 1,
    padding: "14px 0",
    borderRadius: 30,
    backgroundColor: "#FF6F3C",
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    border: "none",
    cursor: "pointer",
  },
};

export default DashboardLite;
