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

const yogaExercises = [
  {
      id: 'kapalabhati',
    name: 'Kapalabhati - Skull Shining Breath',
    description: 'Kapalabhati is a cleansing breathing technique that energizes the body and sharpens focus.',
    duration: 30,
    img: '/img/Yoga/Kapalabhati-–-Skull-Shining-Breath.jpg',
  },
  {
    id: 'anulom-vilom',
    name: 'Anulom Vilom - Alternate Nostril Breathing',
    description: 'Improves lung function, reduces stress and balances the body\'s energy channels.',
    duration: 15,
    img: '/img/Yoga/Anulom-Vilom-Alternate-Nostril-Breathing.jpg',
  },
  {
    id: 'ardha-matsyendrasana',
    name: 'Ardha Matsyendrasana - Spinal Twist',
    description: 'Improves flexibility and detoxifies the internal organs.',
    duration: 15,
    img: '/img/Yoga/Ardha-Matsyendrasana-1-scaled-e1649682463540-1.jpg',
  },
  {
    id: 'trikonasana',
    name: 'Trikonasana - Triangle Pose',
    description: 'Enhances flexibility in the spine and legs and strengthens the core.',
    duration: 30,
    img: '/img/Yoga/Classical-Triangle-Pose-–-Trikonasana.jpg',
  },
  {
    id: 'bhujangasana',
    name: 'Cobra posture - Bhujangasana',
    description: 'Strengthens back muscles and stimulates digestion.',
    duration: 15,
    img: '/img/Yoga/Cobra-Pose-–-Bhujangasana-1.jpg',
  },
  {
    id: 'dhanurasana',
    name: 'Arc Posture - Dhanurasana',
    description: 'Improves spinal flexibility and strengthens body.',
    duration: 15,
    img: '/img/Yoga/Dhanurasana-Bow-Pose-1.jpg',
  },
  {
    id: 'sukha-gomukhasan',
    name: 'Easy Cow Head Pose - Sukha Gomukhasan',
    description: 'Improves shoulder flexibility and posture.',
    duration: 15,
    img: '/img/Yoga/Easy-Cow-Face-Sukha-Gomukhasana-2.jpg',
  },
  {
    id: 'sukha-gomukhasan2',
    name: 'Easy Crow Pose - Sukha Kakasana',
    description: 'Crow pose improves focus and balance and strengthens the wrists and arms.',
    duration: 15,
    img: '/img/Yoga/Easy-Crow-Pose-Sukha-Kakasana-1.jpg',
  },
  {
    id: 'Matsayasana',
    name: 'Fish Pose - Matsayasana',
    description: 'Fish pose stretches the neck and opens the chest. This counter-pose after the candle enhances the benefits of the previous poses. Deep yogic breathing is stimulated, and with each inhalation, the chest opens more and more.',
    duration: 15,
    img: '/img/Yoga/Fish-Pose-Matsayasana-2.jpg',
  },
  {
    id: 'Matsayasana2',
    name: 'Half-bridge pose - Ardha Setu Bandhasana',
    description: 'After compressing the chest in the shoulder stand and then in the plow stand, the bridge is a commonly used counter-pose to open the chest again. This yoga exercise stimulates the thyroid gland as well as the liver and spleen.',
    duration: 15,
    img: '/img/Yoga/Half-Bridge-Pose-Ardha-Setu-Bandhasana.jpg',
  },
  {
    id: 'Sirshasana',
    name: 'Headstand - Sirshasana',
    description: 'Headstand is one of the most intense and beneficial yoga poses due to its inverted posture. Sirshasana, also known as the "king of asanas," requires strength and balance, but above all, concentration and body control.',
    duration: 15,
    img: '/img/Yoga/Headstand-–-Shirshasana.jpg',
  },
  {
    id: 'Purvottanasana',
    name: 'Upward Plank - Purvottanasana',
    description: 'Upward plank is a very common yoga pose, used as a counter to the seated forward bend. This exercise opens the chest and strengthens the shoulders, arms, and wrists.',
    duration: 15,
    img: '/img/Yoga/Inclined-Plane-–-Purvottanasana.jpg',
  },
   {
    id: 'Purvottanasana2',
    name: 'Upward Plank - Purvottanasana',
    description: 'Upward plank is a very common yoga pose, used as a counter to the seated forward bend. This exercise opens the chest and strengthens the shoulders, arms, and wrists.',
    duration: 15,
    img: '/img/Yoga/Inclined-Plane-–-Purvottanasana.jpg',
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

const YogaPage = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId"); // récupérer l'userId stocké

  const currentIndex = yogaExercises.findIndex(e => e.id === exerciseId);
  const exercise = yogaExercises[currentIndex] || yogaExercises[0];

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
      if (currentIndex + 1 < yogaExercises.length) {
        navigate(`/workouts/yoga/${yogaExercises[currentIndex + 1].id}`);
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
      session_type: "Yoga",
      start_time: nowISO,
      end_time: nowISO,
      duration: yogaExercises.reduce((acc, e) => acc + e.duration, 0), // durée totale Yoga
      evaluation: evaluation,
      exercises_done: yogaExercises.map(e => e.name).join(", "),
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
            <h2 style={{ margin: 0, color: '#FF6F3C' }}>Évaluation de la session Yoga</h2>
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
          <h2 style={{ margin: 0, color: '#FF6F3C' }}>Yoga - {exercise.name}</h2>
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
            if (currentIndex + 1 < yogaExercises.length) {
              navigate(`/workouts/yoga/${yogaExercises[currentIndex + 1].id}`);
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

export default YogaPage;
