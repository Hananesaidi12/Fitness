import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaTachometerAlt,
  FaDumbbell,
  FaAppleAlt,
  FaChartLine,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaArrowLeft,
} from 'react-icons/fa';

const cardioExercises = [
  {
    id: 'Assault-air-bike',
    name: 'Assault-air-bike',
    description: 'Exercice complet sur vélo à air qui sollicite simultanément le haut et le bas du corps. Idéal pour le HIIT, il améliore l’endurance cardiovasculaire et brûle un maximum de calories en un temps réduit.',
    duration: 15,
    img: '/img/cardio/assault-air-bike-exercice-cardio-training-hiit.webp',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    description: 'Mouvement explosif combinant une pompe, une planche et un saut vertical. Excellent pour renforcer tout le corps, améliorer la coordination et augmenter rapidement la fréquence cardiaque.',
    duration: 15,
    img: '/img/cardio/burpee-exercice-musculation.webp',
  },
  {
    id: 'corde-a-sauter',
    name: 'Corde-a-sauter',
    description: 'Exercice cardio classique qui développe l’endurance, la coordination et la tonicité musculaire, tout en brûlant rapidement les graisses. Sollicite principalement les jambes et les mollets.',
    duration: 15,
    img: '/img/cardio/corde-a-sauter-exercice-cardio-mollets.webp',
  },
  {
    id: 'vergometre-de-ski',
    name: 'Ergometre-de-ski',
    description: 'Appareil reproduisant les mouvements du ski de fond. Il sollicite fortement le haut du corps (épaules, dos, bras) ainsi que le gainage, tout en travaillant le cardio de manière intense.',
    duration: 15,
    img: '/img/cardio/ergometre-de-ski-exercice-cardio.webp',
  },
  {
    id: 'jump-box',
    name: 'Jump-box',
    description: 'Sauts explosifs sur une box ou une plateforme. Améliore la puissance, la force des jambes et la condition cardiovasculaire. Exercice très efficace pour le développement de la tonicité musculaire.',
    duration: 15,
    img: '/img/cardio/jump-box-exercice-crossfit-jambes.webp',
  },
  {
    id: 'jumping-jack',
    name: 'Jumping-jack',
    description: 'Exercice simple et dynamique qui consiste à sauter en écartant les bras et les jambes. Idéal pour l’échauffement, il stimule la circulation sanguine et améliore l’endurance cardio.',
    duration: 15,
    img: '/img/cardio/jumping-jack-exercice-cardio-jambes.webp',
  },
  {
    id: 'marche-ours-bear-crawl',
    name: 'Marche-ours-bear-crawl',
    description: 'Déplacement quadrupède qui engage le haut du corps, les abdominaux et les jambes. Excellent pour la stabilité, le gainage et la dépense énergétique, tout en travaillant le cardio.',
    duration: 15,
    img: '/img/cardio/marche-ours-bear-crawl-exercice-cardiovasculaire-cardio-aerobie-abdominaux.webp',
  },
  {
    id: 'mountain-climber-abdominaux',
    name: 'Mountain-climber-abdominaux',
    description: 'Exercice dynamique au sol où l’on alterne des montées de genoux rapides en position de planche. Cible les abdominaux, améliore l’endurance et favorise la combustion des graisses.',
    duration: 15,
    img: '/img/cardio/mountain-climber-abdominaux.webp',
  },
  {
    id: 'skater-hops-cardio-training-hiit',
    name: 'Skater-hops-cardio-training-hiit',
    description: 'Sauts latéraux imitant le mouvement d’un patineur. Développe l’agilité, la coordination, la force des jambes et améliore la capacité cardio-respiratoire.',
    duration: 15,
    img: '/img/cardio/skater-hops-cardio-training-hiit.webp',
  },
  {
    id: 'wall-ball-squat',
    name: 'Wall-ball-squat',
    description: 'Exercice complet qui associe un squat et un lancer de médecine ball contre un mur. Renforce le bas du corps, les épaules et le gainage tout en sollicitant le système cardio.',
    duration: 15,
    img: '/img/cardio/wall-ball-squat-exercice-cardio-bruler-calories.webp',
  },
];


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

const Cardio = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId"); // récupérer l'userId stocké

  const currentIndex = cardioExercises.findIndex(e => e.id === exerciseId);
  const exercise = cardioExercises[currentIndex] || cardioExercises[0];

  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [timerActive, setTimerActive] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationDone, setEvaluationDone] = useState(false);
  const [sessionSent, setSessionSent] = useState(false);

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  // Reset timer et états quand l'exercice change
  useEffect(() => {
    setTimeLeft(exercise.duration);
    setTimerActive(false);
    setShowEvaluation(false);
    setEvaluationDone(false);
    setSessionSent(false);
  }, [exercise]);

  // Timer décrémente chaque seconde si actif
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft === 0) {
      setTimerActive(false);
      if (currentIndex + 1 < cardioExercises.length) {
        navigate(`/workouts/cardio/${cardioExercises[currentIndex + 1].id}`);
      } else {
        setShowEvaluation(true);
      }
      return;
    }

    const timerId = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, timerActive]);

  // Fonction pour envoyer la session au backend
  const sendSessionToBackend = (evaluation = "Bien") => {
    if (!userId) {
      alert("Utilisateur non connecté !");
      return;
    }

    const nowISO = new Date().toISOString();

    const sessionPayload = {
      user_id: parseInt(userId, 10),
      session_type: "Cardio",
      start_time: nowISO,
      end_time: nowISO,
      duration: cardioExercises.reduce((acc, e) => acc + e.duration, 0), // durée totale Yoga
      evaluation: evaluation,
      exercises_done: cardioExercises.map(e => e.name).join(", "),
    };

    fetch("http://localhost:8000/sessions/", {
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

  // Envoie automatique la session une fois l'évaluation affichée, une seule fois
  const handleEvaluation = (score) => {
  if (!sessionSent) { // éviter les doublons
    sendSessionToBackend(score);
    setSessionSent(true);
  }
  setEvaluationDone(true);

  setTimeout(() => {
    navigate('/workouts');
  }, 2000);
};

 
  if (showEvaluation) {
    return (
      <div style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={styles.logo}>
            Core<span style={{ color: '#FF6F3C' }}>Flex</span>
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
            <h2 style={{ margin: 0, color: '#FF6F3C' }}>Évaluation de la session Cardio</h2>
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
        <div style={styles.logo}>
          Core<span style={{ color: '#FF6F3C' }}>Flex</span>
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
          <h2 style={{ margin: 0, color: '#FF6F3C' }}>Cardio - {exercise.name}</h2>
        </header>

        <div style={styles.card}>
          <img src={exercise.img} alt={exercise.name} style={styles.image} />
          <p style={styles.description}><em>{exercise.description}</em></p>
          <p><strong>Durée :</strong> {exercise.duration} secondes</p>

          <div style={{ marginTop: 20 }}>
            {!timerActive ? (
              <button onClick={() => setTimerActive(true)} style={styles.timerBtn}>▶️ Démarrer</button>
            ) : (
              <button onClick={() => setTimerActive(false)} style={styles.timerBtn}>⏸️ Pause</button>
            )}
          </div>

          <h1 style={styles.timer}>{timeLeft}s</h1>

          <button onClick={() => {
            if (currentIndex + 1 < cardioExercises.length) {
              navigate(`/workouts/cardio/${cardioExercises[currentIndex + 1].id}`);
            } else {
              setShowEvaluation(true);
            }
          }} style={styles.nextBtn}>
            ⏭️ Suivant
          </button>
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
  profileBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#FF6F3C',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: 50,
    fontWeight: '700',
    fontSize: 14,
    textDecoration: 'none',
    boxShadow: '0 4px 10px rgba(255,111,60,0.4)',
    transition: 'background 0.3s ease',
    cursor: 'pointer',
    userSelect: 'none',
    gap: 10,
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
    maxWidth: 400,
    height: 300,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  timerBtn: {
    backgroundColor: '#FF6F3C',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 10,
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
  },
  timer: {
    fontSize: 48,
    color: '#FF6F3C',
    marginTop: 20,
  },
  nextBtn: {
    marginTop: 30,
    backgroundColor: '#444',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
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

export default Cardio;
