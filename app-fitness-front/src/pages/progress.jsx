import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { FaDownload } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// === Header ===
const Header = () => {
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


};

// === Helpers ===
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const groupByWeek = (sessions) => {
  const weeks = {};
  sessions.forEach((s) => {
    const d = new Date(s.start_time);
    const onejan = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    const key = `${d.getFullYear()}-S${weekNum}`;
    if (!weeks[key]) weeks[key] = 0;
    weeks[key] += 1;
  });
  return weeks;
};

const exportCSV = (sessions) => {
  if (!sessions || sessions.length === 0) return;
  const header = ["Date", "Type", "Durée (min)", "Évaluation", "Exercices réalisés"];
  const rows = sessions.map((s) => [
    formatDate(s.start_time),
    s.session_type || s.type,
    Math.round(s.duration / 60),
    s.evaluation,
    `"${s.exercises_done || ""}"`,
  ]);
  const csvContent =
    "data:text/csv;charset=utf-8," + [header, ...rows].map((e) => e.join(",")).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "historique_seances.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// === EvaluationChart ===
const EvaluationChart = ({ evaluations }) => {
  const valueMap = { Mauvais: 1, Moyen: 3, Bien: 5 };
  const data = useMemo(
    () => ({
      labels: evaluations.map((e) => formatDate(e.date)),
      datasets: [
        {
          label: "Évaluation (1 à 5)",
          data: evaluations.map((e) => valueMap[e.value] || 0),
          borderColor: "#FF6F3C",
          backgroundColor: "rgba(255,111,60,0.6)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }),
    [evaluations]
  );

  return (
    <section style={{ ...styles.card, marginTop: 40 }}>
      <h3>Progression des évaluations</h3>
      <div style={{ maxHeight: 250 }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Évolution des évaluations" },
              tooltip: { mode: "index", intersect: false },
            },
            scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
          }}
        />
      </div>
    </section>
  );
};

// === WeeklySessionsChart ===
const WeeklySessionsChart = ({ sessions }) => {
  const weeks = useMemo(() => groupByWeek(sessions), [sessions]);
  const labels = Object.keys(weeks).sort();
  const data = labels.map((w) => weeks[w]);
  const chartData = { labels, datasets: [{ label: "Séances par semaine", data, backgroundColor: "#FF6F3C" }] };

  return (
    <section style={{ ...styles.card, marginTop: 40 }}>
      <h3>Sessions par semaine</h3>
      <div style={{ maxHeight: 250 }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    </section>
  );
};

// === StatsSummary ===
const StatsSummary = ({ totalSessions, maxSessions, evaluationAvg, totalDuration }) => {
  const hasGoal = maxSessions && maxSessions > 0;
  const sessionPercent = hasGoal ? Math.round((totalSessions / maxSessions) * 100) : null;

  let recommendation = "Continue comme ça ! 💪";
  if (totalSessions === 0) recommendation = "Commence ta première séance ! 🚀";
  else if (hasGoal && sessionPercent < 50) recommendation = "Courage, tu peux faire mieux ! 🔁";
  else if (hasGoal && sessionPercent >= 50 && sessionPercent < 100) recommendation = "Super, tu es à plus de la moitié ! 👏";
  else if (hasGoal && sessionPercent >= 100) recommendation = "Objectif atteint, bravo ! 🏆";

  return (
   
<section style={{ ...styles.card, marginTop: 40 }}>
      <h3>Statistiques clés</h3>
      <div style={{ maxHeight: 250 }}></div>
      <div style={{ ...styles.statsGrid, gap: "20px" }}>
        <div
          style={{
            ...styles.statBox,
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h4 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>Progression des séances</h4>
          <p
            style={{
              ...styles.statValue,
              fontSize: "20px",
              fontWeight: "600",
              color: "#000000ff",
            }}
          >
            {hasGoal
              ? totalSessions < maxSessions
                ? `${sessionPercent}% atteint (${totalSessions} séances)`
                : `🏆 Objectif dépassé : ${totalSessions} séances`
              : `${totalSessions} séance${totalSessions > 1 ? "s" : ""}`}
          </p>
          {hasGoal && (
            <progress
              value={Math.min(totalSessions, maxSessions)}
              max={maxSessions}
              style={{
                width: "100%",
                height: 12,
                borderRadius: 6,
                marginTop: 10,
                appearance: "none",
              }}
            />
          )}
        </div>

        <div
          style={{
            ...styles.statBox,
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h4 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}> Évaluation moyenne</h4>
          <p
            style={{
              ...styles.statValue,
              fontSize: "22px",
              fontWeight: "600",
              color: "#000000ff",
            }}
          >
            {evaluationAvg || "N/A"}
          </p>
        </div>

        <div
          style={{
            ...styles.statBox,
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h4 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}> Durée totale (minutes)</h4>
          <p
            style={{
              ...styles.statValue,
              fontSize: "22px",
              fontWeight: "600",
              color: "#000000ff",
            }}
          >
            {Math.round(totalDuration)}
          </p>
        </div>
      </div>

      <p
        style={{
          marginTop: 25,
          fontSize: "18px",
          fontWeight: "600",
          color: "#444",
          textAlign: "center",
          background: "#f1f1f1",
          padding: "12px 18px",
          borderRadius: "10px",
          boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
        }}
      >
        {recommendation}
      </p>
    </section>
  );
};

// === SessionHistory ===
const SessionHistory = ({ sessions }) => {
  const [hover, setHover] = useState(false); // ✅ Toujours appelé

  if (!sessions || sessions.length === 0) return <p>Aucune séance réalisée.</p>;

  return (
    <section style={{ ...styles.card, marginTop: 40, marginBottom: 40 }}>
      <h3>Historique des séances</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#FF6F3C", color: "#fff" }}>
            <th style={styles.tableTh}>Date</th>
            <th style={styles.tableTh}>Type</th>
            <th style={styles.tableTh}>Durée (min)</th>
            <th style={styles.tableTh}>Évaluation</th>
            <th style={styles.tableTh}>Exercices réalisés</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((sess) => (
            <tr key={sess.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={styles.tableTd}>{formatDate(sess.start_time)}</td>
              <td style={styles.tableTd}>{sess.session_type || sess.type}</td>
              <td style={styles.tableTd}>{Math.round(sess.duration / 60)}</td>
              <td style={styles.tableTd}>{sess.evaluation}</td>
              <td style={styles.tableTd}>{sess.exercises_done}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button
        onClick={() => exportCSV(sessions)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...styles.exportBtn,
          marginBottom: 10,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: hover ? "#e65b2a" : "#FF6F3C",
          boxShadow: hover
            ? "0 8px 20px rgba(230, 91, 42, 0.95)"
            : "0 6px 14px rgba(255,111,60,0.8)",
        }}
      >
        <FaDownload /> Exporter CSV
      </button>
    </section>
  );
};


// === Main Progress ===
const Progress = () => {
  const [progressData, setProgressData] = useState({ sessions: [], evaluations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("all");
  const maxSessions = 20;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Utilisateur non connecté. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/sessions/progress/user/${userId}`);
        const uniqueSessions = Array.from(new Map(response.data.sessions.map((s) => [s.id, s])).values());
        const uniqueEvaluations = Array.from(new Map(response.data.evaluations.map((e) => [e.id, e])).values());
        setProgressData({ sessions: uniqueSessions, evaluations: uniqueEvaluations });
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSessions = useMemo(() => {
    if (!progressData?.sessions) return [];
    if (period === "all") return progressData.sessions;
    const now = new Date();
    const daysAgo = parseInt(period, 10);
    return progressData.sessions.filter((s) => (now - new Date(s.start_time)) / (1000 * 60 * 60 * 24) <= daysAgo);
  }, [period, progressData]);

  const filteredEvaluations = useMemo(() => {
    if (!progressData?.evaluations) return [];
    if (period === "all") return progressData.evaluations;
    const now = new Date();
    const daysAgo = parseInt(period, 10);
    return progressData.evaluations.filter((e) => (now - new Date(e.date)) / (1000 * 60 * 60 * 24) <= daysAgo);
  }, [period, progressData]);

  const evaluationAvg = useMemo(() => {
    if (!filteredEvaluations.length) return "N/A";
    const mapVal = { Mauvais: 1, Moyen: 3, Bien: 5 };
    const total = filteredEvaluations.reduce((sum, e) => sum + (mapVal[e.value] || 0), 0);
    return (total / filteredEvaluations.length).toFixed(2);
  }, [filteredEvaluations]);

  if (loading) return <p>Chargement des statistiques...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Layout title="Suivi de progression">
      <Header />
      <main style={styles.mainContent}>
        <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <label htmlFor="periodSelect" style={{ fontWeight: "600", fontSize: 16 }}>
            Filtrer par période :
          </label>
          <select
            id="periodSelect"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="all">Tout</option>
            {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((d) => (
              <option key={d} value={d}>
                {d} jour{d > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <EvaluationChart evaluations={filteredEvaluations} />
        <WeeklySessionsChart sessions={filteredSessions} />
        <StatsSummary
          totalSessions={filteredSessions.length}
          maxSessions={maxSessions}
          evaluationAvg={evaluationAvg}
          totalDuration={filteredSessions.reduce((sum, s) => sum + s.duration, 0)}
        />
        <SessionHistory sessions={filteredSessions} />
      </main>
    </Layout>
  );
};

const styles = {
  mainContent: { padding: "20px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
  },
  profileBtn: { textDecoration: "none" },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#FF6F3C",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  card: {
    background: "#fff",
    padding: 28,
    borderRadius: 16,
    boxShadow: "0 8px 20px rgba(255, 111, 60, 0.12)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 28,
  },
  statBox: {
    background: "#FFF4EF",
    borderRadius: 14,
    padding: 20,
    boxShadow: "inset 2px 2px 8px rgba(255,111,60,0.25)",
  },
  statValue: {
    fontWeight: "700",
    fontSize: 24,
    color: "#FF6F3C",
  },
  tableTh: { padding: "10px", textAlign: "left" },
  tableTd: { padding: "10px" },
  exportBtn: {
    padding: "10px 16px",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
  },
};

export default Progress;
