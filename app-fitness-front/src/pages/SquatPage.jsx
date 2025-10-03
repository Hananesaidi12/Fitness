import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaDumbbell,
  FaAppleAlt,
  FaChartLine,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";

const squatsExercises = [
  { id: "Squat-Pulse", name: "Squat Pulse", description: "Small-but-deadly pulses fatigue your muscles fast.", video: "/img/squat/26-1545174046.mp4", duration: 30 },
  { id: "Squat-Walk", name: "Lateral Squat Walk", description: "Target your glute medius.", video: "/img/squat/27-1-1545173994.mp4", duration: 30 },
  { id: "Squat-To-Lunge", name: "Squat To Lunge", description: "Combine two moves to work your butt muscles.", video: "/img/squat/29-1545173874.mp4", duration: 30 },
  { id: "Plie-Squat", name: "Plie Squat", description: "Targets your inner thighs.", video: "/img/squat/30-1-1545173827.mp4", duration: 30 },
  { id: "Kang-Squat", name: "Kang Squat", description: "Combines a hinge and squat pattern.", video: "/img/squat/kang-squats-1-1561495557.mp4", duration: 30 },
  { id: "Split-Squatp", name: "Bulgarian Split Squat", description: "Improves balance and core strength.", video: "/img/squat/single-leg-bulgarian-split-squat-1560798588.mp4", duration: 30 },
  { id: "Spiderman-Lunge", name: "Spiderman Lunge and Squat", description: "Dynamic movement engaging multiple muscle groups.", video: "/img/squat/spiderman-lunge-1548194686.mp4", duration: 30 },
  { id: "Isometric-Squat", name: "Isometric Squat", description: "Isometric squats help build strength and endurance.", video: "/img/squat/squat-hold-1563814056 (1).mp4", duration: 30 },
  { id: "Squat-Reach", name: "Squat With Reach", description: "Great for getting your heart rate up.", video: "/img/squat/squat-with-reach-1551297264.mp4", duration: 30 },
  { id: "Wide-Leg-Sumo", name: "Wide-Leg Sumo Squat", description: "Targets inner thighs and glutes.", video: "/img/squat/sumo-squat-pulses-1548194365.mp4", duration: 30 },
  { id: "Single-Leg-Box", name: "Single-Leg Box Squat", description: "Build single-leg strength and balance.", video: "/img/squat/wh-fitness-banded-single-leg-box-squat-kehinde-1602002375.mp4", duration: 30 },
  { id: "Air-Squat", name: "Air Squat", description: "Foundational movement for squats.", video: "/img/squat/wh-fitness-bodyweight-squat-charlee-1609875780.mp4", duration: 30 },
  { id: "To-Heel-Raise", name: "Squat To Heel Raise", description: "Low-impact cardio move.", video: "/img/squat/wh-fitness-squat-with-heel-raise-1595428541.mp4", duration: 30 },
];

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

const SquatPage = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  // Trouver l'exercice en cours
  const currentIndex = squatsExercises.findIndex((e) => e.id === exerciseId);
  const exercise = currentIndex >= 0 ? squatsExercises[currentIndex] : squatsExercises[0];

  const [timeLeft, setTimeLeft] = useState(exercise.duration || 30);
  const [timerActive, setTimerActive] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationDone, setEvaluationDone] = useState(false);
  const [sessionSent, setSessionSent] = useState(false);

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  // Reset quand on change d'exercice
  useEffect(() => {
    setTimeLeft(exercise.duration || 30);
    setTimerActive(false);
    setShowEvaluation(false);
    setEvaluationDone(false);
    setSessionSent(false);
  }, [exercise]);

  // Timer automatique
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      setTimerActive(false);
      handleNextClick();
      return;
    }

    const timerId = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, timerActive]);

  // Sauvegarde session dans backend
  const sendSessionToBackend = (evaluation = "Bien") => {
    if (!userId) {
      alert("Utilisateur non connecté !");
      return;
    }

    const nowISO = new Date().toISOString();

    const sessionPayload = {
      user_id: parseInt(userId, 10),
      session_type: "Squats",
      start_time: nowISO,
      end_time: nowISO,
      duration: squatsExercises.reduce((acc, e) => acc + (e.duration || 0), 0),
      evaluation,
      exercises_done: squatsExercises.map((e) => e.name).join(", "),
    };

    fetch("http://localhost:8000/sessions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur création session : ${res.status}`);
        return res.json();
      })
      .then(() => setSessionSent(true))
      .catch((err) => {
        console.error(err);
        alert("Erreur lors de la création de la session");
      });
  };

  // Auto-envoi session à la fin
 

  const handleEvaluation = (score) => {
    if (!sessionSent) {
    sendSessionToBackend(score); // envoi unique
    setSessionSent(true);        // on marque comme envoyé
  }
  setEvaluationDone(true);
  setTimeout(() => navigate("/workouts"), 2000);
  };

  const handleNextClick = () => {
    if (currentIndex + 1 < squatsExercises.length) {
      navigate(`/workouts/squats/${squatsExercises[currentIndex + 1].id}`);
    } else {
      setShowEvaluation(true);
    }
  };

  // Page d'évaluation
  if (showEvaluation) {
    return (
      <div style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={styles.logo}>
            Core<span style={{ color: "#FF6F3C" }}>Flex</span>
          </div>
          <nav style={styles.nav}>
            {navItems.map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
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
        <main style={styles.mainContent}>
          <header style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <FaArrowLeft style={{ marginRight: 6 }} /> Retour
            </button>
            <h2 style={{ margin: 0, color: "#FF6F3C" }}>
              Évaluation de la session Squat
            </h2>
          </header>
          <div style={styles.card}>
            {!evaluationDone ? (
              <>
                <p>Comment évalues-tu cette session ?</p>
                <div style={{ marginTop: 20 }}>
                  <button
                    onClick={() => handleEvaluation("Bien")}
                    style={styles.evalBtn}
                  >
                    👍 Bien
                  </button>
                  <button
                    onClick={() => handleEvaluation("Moyen")}
                    style={styles.evalBtn}
                  >
                    👌 Moyen
                  </button>
                  <button
                    onClick={() => handleEvaluation("Mal")}
                    style={styles.evalBtn}
                  >
                    👎 Mal
                  </button>
                </div>
              </>
            ) : (
              <p>
                Merci pour ton retour ! Tu vas être redirigé vers les Workouts...
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Page exercice
  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          Core<span style={{ color: "#FF6F3C" }}>Flex</span>
        </div>
        <nav style={styles.nav}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
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
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <FaArrowLeft style={{ marginRight: 6 }} /> Retour
          </button>
          <h2 style={{ margin: 0, color: "#FF6F3C" }}>
            Squat - {exercise.name}
          </h2>
        </header>
        <div style={styles.card}>
          <video
            src={exercise.video}
            style={styles.video}
            controls
            preload="metadata"
          />
          <p style={styles.description}>
            <em>{exercise.description}</em>
          </p>
          <p style={{ fontWeight: "600", marginBottom: 10 }}>
            Temps restant : {timeLeft}s
          </p>
          <div>
            {!timerActive ? (
              <button
                onClick={() => setTimerActive(true)}
                style={styles.nextBtn}
              >
                ▶️ Démarrer
              </button>
            ) : (
              <button
                onClick={() => setTimerActive(false)}
                style={styles.nextBtn}
              >
                ⏸️ Pause
              </button>
            )}
            <button onClick={handleNextClick} style={styles.nextBtn}>
              ⏭️ Suivant
            </button>
          </div>
        </div>
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
  logo: { fontSize: 28, fontWeight: "900", marginBottom: 40, userSelect: "none", color: "#fff" },
  nav: { flexGrow: 1, display: "flex", flexDirection: "column" },
  navLink: { color: "#AAB8C2", textDecoration: "none", fontWeight: "600", fontSize: 16, padding: "12px 20px", marginBottom: 15, borderRadius: 10, display: "flex", alignItems: "center", transition: "background 0.3s ease, color 0.3s ease" },
  navLinkActive: { background: "#FF6F3C", color: "#fff", fontWeight: "700", boxShadow: "0 5px 12px rgba(255,111,60,0.5)" },
  mainContent: { flexGrow: 1, display: "flex", flexDirection: "column", padding: "30px 40px", overflowY: "auto" },
  header: { height: 60, marginBottom: 40, display: "flex", justifyContent: "flex-start", alignItems: "center", background: "#fff", padding: "0 30px", boxShadow: "0 1px 8px rgba(0,0,0,0.1)", borderRadius: 10, gap: 20 },
  backBtn: { background: "#FF6F3C", color: "#fff", padding: "8px 14px", borderRadius: 25, border: "none", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center" },
  card: { background: "#fff", borderRadius: 15, padding: 30, boxShadow: "0 10px 20px rgba(255,111,60,0.15)", textAlign: "center" },
  video: { width: "100%", maxWidth: 500, height: 300, borderRadius: 12, marginBottom: 20, boxShadow: "0 6px 12px rgba(0,0,0,0.1)" },
  description: { fontSize: 16, color: "#555", marginBottom: 12, fontStyle: "italic" },
  nextBtn: { marginTop: 15, marginRight: 10, backgroundColor: "#444", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 16, fontWeight: "600", cursor: "pointer", border: "none" },
  evalBtn: { backgroundColor: "#FF6F3C", color: "#fff", padding: "10px 20px", margin: "0 10px", borderRadius: 10, fontWeight: "600", cursor: "pointer", border: "none", fontSize: 16 },
};

export default SquatPage;
