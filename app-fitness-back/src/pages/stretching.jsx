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

const StretchingExercises = [
  {
    id: 'arm-cross-stretch',
    name: ' Arm-cross-stretch ',
    description: 'Stretch your arm across your chest to loosen shoulder and arm muscles.',
    duration: 30,
    img: '/img/stretching/Etirement-biceps-2048x1583.jpg',
  },
  {
    id: 'cobra-stretch',
    name: 'Cobra Stretch',
    description: 'This stretch helps to lengthen and open up the abdominal muscles while improving spine flexibility.',
    duration: 30,
    img: '/img/stretching/étirement-des-vertèbres-1200x2046.jpg',
  },
  {
     id: 'shoulder-stretch',
  name: 'Shoulder Stretch',
  description: 'This stretch helps to relax and loosen the shoulder muscles, improving mobility and reducing tension.',
    duration: 30,
    img: '/img/stretching/posture-de-larc-1200x700.jpg',
  },
   {
    
  id: 'back-stretch',
  name: 'Back Stretch',
  description: 'This stretch helps to relieve tension in the back muscles and improve spinal flexibility.',
    duration: 30,
    img: '/img/stretching/posture-de-lenfant-heureux-2048x1689.jpg',
  },
  {
    id: 'chest-stretch',
  name: 'Chest Stretch',
  description: 'This stretch helps to open up the chest muscles, improving posture and relieving tension.',
    duration: 30,
    img: '/img/stretching/posture-du-cobra-1200x733.jpg',
  },
   {
      id: 'hip-stretch',
  name: 'Hip Stretch',
  description: 'This stretch helps to increase flexibility in the hip muscles and relieve tension in the lower back.',
    duration: 30,
    img: '/img/stretching/posture-du-pigeon-2-2048x1128.jpg',
  },
  {
      id: 'leg-stretch',
  name: 'Leg Stretch',
  description: 'This stretch helps to improve flexibility and relieve tension in the leg muscles, including hamstrings and calves.',
    duration: 30,
    img: '/img/stretching/Stretching-quadriceps-2048x1247.jpg',
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

const Stretching = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const currentIndex = StretchingExercises.findIndex(e => e.id === exerciseId);
  const exercise = currentIndex >= 0 ? StretchingExercises[currentIndex] : StretchingExercises[0];

  useEffect(() => {
    // Si exerciseId invalide, redirige vers la liste des workouts
    if (!exercise) {
      navigate('/workouts');
    }
  }, [exercise, navigate]);

  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [timerActive, setTimerActive] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationDone, setEvaluationDone] = useState(false);
  const [sessionSent, setSessionSent] = useState(false);

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  useEffect(() => {
    // Reset timer et états à chaque changement d'exercice
    setTimeLeft(exercise.duration);
    setTimerActive(false);
    setShowEvaluation(false);
    setEvaluationDone(false);
  }, [exercise]);

  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft === 0) {
      setTimerActive(false);
      if (currentIndex + 1 < StretchingExercises.length) {
        navigate(`/workouts/stretching/${StretchingExercises[currentIndex + 1].id}`);
      } else {
        setShowEvaluation(true);
      }
      return;
    }

    const timerId = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, timerActive, currentIndex, navigate]);
  const handleNextClick = () => {
  if (currentIndex + 1 < StretchingExercises.length) {
    navigate(`/workouts/stretching/${StretchingExercises[currentIndex + 1].id}`);
  } else {
    // Si dernier exercice, afficher l'évaluation
    setShowEvaluation(true);
  }
};

  const sendSessionToBackend = (evaluation = "Bien") => {
  if (!userId) {
    alert("Utilisateur non connecté !");
    return;
  }

  const nowISO = new Date().toISOString();
  
  const sessionPayload = {
    user_id: parseInt(userId, 10),
    session_type: "Stretching",
    start_time: nowISO,
    end_time: nowISO,
    duration: StretchingExercises.reduce((acc, e) => acc + e.duration, 0),
    evaluation,  // <-- Utilise la valeur passée ici
    exercises_done: StretchingExercises.map(e => e.name).join(", "),
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
    .then(() => setSessionSent(true))
    .catch(err => {
      console.error(err);
      alert("Erreur lors de la création de la session");
    });
};

   

 const handleEvaluation = (score) => {
  sendSessionToBackend(score); // envoie la bonne valeur
  setEvaluationDone(true);
  setTimeout(() => navigate('/workouts'), 2000);
};


  if (showEvaluation) {
    return (
      <div style={styles.page}>
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
            <h2 style={{ margin: 0, color: '#FF6F3C' }}>Évaluation de la session Stretching</h2>
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
          <h2 style={{ margin: 0, color: '#FF6F3C' }}>Stretching - {exercise.name}</h2>
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

          <button onClick={handleNextClick} style={styles.nextBtn}>
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

export default Stretching;
