import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
} from 'react-icons/fa';

const navItems = [
  { icon: FaHome, label: 'Home', to: '/' },
  { icon: FaTachometerAlt, label: 'Dashboard', to: '/dashbordLite' },
  { icon: FaDumbbell, label: 'Workouts', to: '/workouts' },
  { icon: FaAppleAlt, label: 'Nutrition', to: '/Nutrition' },
  { icon: FaChartLine, label: 'Progress', to: '/progress' },
  { icon: FaUsers, label: 'Community', to: '/community' },
  { icon: FaCog, label: 'Settings', to: '/settings' },
  { icon: FaSignOutAlt, label: 'Logout', to: '/logout' },
];

const exercises = [
  {
    id: 'body-scan',
    title: '🧘‍♂️ Body Scan',
    description: 'Bring awareness to each part of the body from head to toe.',
    img: '/img/meditation/Body-Scan.jpeg',
    duration: 30,
  },
  {
    id: 'Mindful-Breathing',
    title: '😮‍💨 Mindful Breathing',
    description: 'Focus your attention on your breath — inhale and exhale.',
    img: '/img/meditation/Mindful-Breathing.jpeg',
    duration: 30,
  },
  {
    id: 'Loving-Kindness Meditation',
    title: '🕉️ Loving-Kindness Meditation',
    description: 'Spread compassion towards yourself and others.',
    img: '/img/meditation/Loving-Kindness Meditation.jpeg',
    duration: 30,
  },
  {
    id: 'Walking-Meditation',
    title: '🌿 Walking Meditation',
    description: 'Walk slowly and mindfully, focusing on each step.',
    img: '/img/meditation/Walking Meditation.jpeg',
    duration: 30,
  },
  {
    id: 'Visualization-Meditation',
    title: '🎆 Visualization Meditation',
    description: 'Imagine a peaceful place or calming scene in your mind.',
    img: '/img/meditation/Visualization Meditation.jpeg',
    duration: 30,
  },
  {
    id: 'Zen',
    title: '🧘 Zen Meditation',
    description: 'Sit upright in silence, focusing on posture and breath.',
    img: '/img/meditation/Zen Meditation (Zazen).jpeg',
    duration: 30,
  },
];

const Meditation = () => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationDone, setEvaluationDone] = useState(false);
  const [sessionSent, setSessionSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  const handleNext = () => {
    if (currentExerciseIndex + 1 < exercises.length) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setShowEvaluation(true);
    }
  };

  const handlePrev = () => {
    if (currentExerciseIndex > 0) setCurrentExerciseIndex(currentExerciseIndex - 1);
  };

  const handleEvaluation = (score) => {
    setEvaluationDone(true);
    setTimeout(() => {
      navigate('/workouts');
    }, 2000);
  };

  // Fonction pour envoyer la session au backend
  const sendSessionToBackend = (evaluation = "Bien") => {
    if (!userId) {
      alert("Utilisateur non connecté !");
      return;
    }

    const nowISO = new Date().toISOString();
    const sessionPayload = {
      user_id: parseInt(userId, 10),
      session_type: "Meditation",
      start_time: nowISO,
      end_time: nowISO,
      duration: exercises.reduce((acc, e) => acc + e.duration, 0),
      evaluation: evaluation,
      exercises_done: exercises.map(e => e.title).join(", "),
    };

    fetch("http://localhost:8000/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionPayload),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Erreur création session : ${res.status}`);
        return res.json();
      })
      .then(() => {
        setSessionSent(true);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de la création de la session");
      });
  };

  useEffect(() => {
    if (showEvaluation && !sessionSent) {
      sendSessionToBackend();
    }
  }, [showEvaluation, sessionSent]);

  const currentExercise = exercises[currentExerciseIndex];

  if (showEvaluation) {
    return (
      <div style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={styles.logo}>              <h1
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
</h1></div>
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
            <button onClick={() => setShowEvaluation(false)} style={styles.backBtn}>
              <FaArrowLeft style={{ marginRight: 6 }} /> Retour aux exercices
            </button>
            <h2 style={{ margin: 0, color: '#FF6F3C' }}>Évaluation de la session Méditation</h2>
          </header>

          <div style={styles.card}>
            {!evaluationDone ? (
              <>
                <p>Comment évalues-tu cette session ?</p>
                <div style={{ marginTop: 20 }}>
                  <button onClick={() => handleEvaluation('Bien')} style={styles.evalBtn}>👍 Bien</button>
                  <button onClick={() => handleEvaluation('Moyen')} style={styles.evalBtn}>👌 Moyen</button>
                  <button onClick={() => handleEvaluation('Mal')} style={styles.evalBtn}>👎 Mal</button>
                </div>
              </>
            ) : (
              <p>Merci pour ton retour ! Tu vas être redirigé vers les Workouts...</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Core<span style={{ color: '#FF6F3C' }}>Flex</span></div>
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
          <h2 style={{ margin: 0, color: '#FF6F3C' }}>Méditation - {currentExercise.title}</h2>
        </header>

        <div style={styles.card}>
          <img src={currentExercise.img} alt={currentExercise.title} style={styles.image} />
          <p style={styles.description}><em>{currentExercise.description}</em></p>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              onClick={handlePrev}
              style={styles.nextBtn}
              disabled={currentExerciseIndex === 0}
            >
              Précédent
            </button>
            <button onClick={handleNext} style={styles.nextBtn}>
              {currentExerciseIndex === exercises.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
          <p style={{ marginTop: 10, fontStyle: 'italic', color: '#666' }}>
            Exercice {currentExerciseIndex + 1} sur {exercises.length}
          </p>
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
  logo: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 40,
    userSelect: 'none',
    color: '#fff',
  },
  nav: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  navLink: {
    color: '#AAB8C2',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: 16,
    padding: '12px 20px',
    marginBottom: 15,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.3s ease, color 0.3s ease',
  },
  navLinkActive: {
    background: '#FF6F3C',
    color: '#fff',
    fontWeight: '700',
    boxShadow: '0 5px 12px rgba(255,111,60,0.5)',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 40px',
    overflowY: 'auto',
  },
  header: {
    height: 60,
    marginBottom: 40,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    padding: '0 30px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
    borderRadius: 10,
  },
  backBtn: {
    background: '#FF6F3C',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 25,
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: 15,
    padding: 30,
    boxShadow: '0 10px 20px rgba(255,111,60,0.15)',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    maxWidth: 500,
    height: 250,
    objectFit: 'cover',
    borderRadius: 10,
    marginBottom: 15,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  nextBtn: {
    backgroundColor: '#FF6F3C',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 16,
    minWidth: 120,
  },
  evalBtn: {
    backgroundColor: '#FF6F3C',
    color: '#fff',
    padding: '10px 20px',
    margin: '0 10px',
    borderRadius: 10,
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    fontSize: 16,
  },
};

export default Meditation;
