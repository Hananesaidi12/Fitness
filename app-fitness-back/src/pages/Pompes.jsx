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

const pompesExercises = [
  {
    id: 'pompe-archer',
    name: 'Pompe Archer',
    description: 'Variante unilatérale où un bras reste tendu tandis que l’autre effectue la poussée. Elle cible intensément les pectoraux, les triceps et développe la force de stabilité.',
    duration: 30,
    img: '/img/pompes/pompe-archer.gif',
  },
  {
    id: 'pompe-avec-kettlebells',
    name: 'Pompe avec Kettlebells',
    description: 'Pompes réalisées avec les mains sur kettlebells pour augmenter l’amplitude du mouvement, sollicitant davantage la poitrine, les épaules et les triceps.',
    duration: 30,
    img: '/img/pompes/pompe-avec-kettlebells.gif',
  },
  {
    id: 'pompe-contre-elastique',
    name: 'Pompe contre Élastique',
    description: 'Variante avec un élastique de résistance placé dans le dos, qui augmente la difficulté et renforce les pectoraux, triceps et deltoïdes.',
    duration: 30,
    img: '/img/pompes/pompe-contre-elastique.gif',
  },
  {
    id: 'pompe-declinee',
    name: 'Pompe Déclinée',
    description: 'Pompes avec les pieds surélevés, mettant plus de charge sur la partie haute des pectoraux et les épaules.',
    duration: 30,
    img: '/img/pompes/pompe-declinee.gif',
  },
  {
    id: 'pompe-gilet-leste',
    name: 'Pompe avec Gilet Lesté',
    description: 'Pompes classiques effectuées avec un gilet lesté pour augmenter l’intensité et développer la force et l’hypertrophie musculaire.',
    duration: 30,
    img: '/img/pompes/pompe-gilet-leste.gif',
  },
  {
    id: 'pompe-mains-serrees',
    name: 'Pompe Mains Serrées',
    description: 'Pompes avec les mains rapprochées, mettant l’accent sur les triceps et la partie interne des pectoraux.',
    duration: 30,
    img: '/img/pompes/pompe-mains-serrees.gif',
  },
  {
    id: 'pompe-sur-ballon-de-gym',
    name: 'Pompe sur Ballon de Gym',
    description: 'Variante instable effectuée sur un ballon de gym, sollicitant les pectoraux, triceps et épaules tout en renforçant la stabilité du tronc.',
    duration: 30,
    img: '/img/pompes/pompe-sur-ballon-de-gym.gif',
  },
  {
    id: 'pompe-sur-un-bras',
    name: 'Pompe sur un Bras',
    description: 'Variante avancée sollicitant un seul bras à la fois. Elle renforce les pectoraux, triceps, épaules et améliore considérablement l’équilibre et la stabilité.',
    duration: 30,
    img: '/img/pompes/pompe-sur-un-bras.gif',
  },
  {
    id: 'pompe-tape-pectoraux-unilateral',
    name: 'Pompe avec Tape Pectoraux Unilatéral',
    description: 'Pompe explosive où l’on tape une main sur la poitrine, travaillant la puissance, la coordination et l’explosivité du haut du corps.',
    duration: 30,
    img: '/img/pompes/pompe-tape-pectoraux-unilateral.gif',
  },
  {
    id: 'pompes-sur-les-doigts',
    name: 'Pompes sur les Doigts',
    description: 'Variante exigeante réalisée sur les doigts, renforçant les avant-bras, les poignets et la poigne en plus des muscles du haut du corps.',
    duration: 30,
    img: '/img/pompes/pompes-sur-les-doigts.gif',
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

const Pompes = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId"); // récupérer l'userId stocké

  const currentIndex = pompesExercises.findIndex(e => e.id === exerciseId);
  const exercise = pompesExercises[currentIndex] || pompesExercises[0];

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
      if (currentIndex + 1 < pompesExercises.length) {
        navigate(`/workouts/Pompes/${pompesExercises[currentIndex + 1].id}`);
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
      session_type: "Pompes",
      start_time: nowISO,
      end_time: nowISO,
      duration: pompesExercises.reduce((acc, e) => acc + e.duration, 0), // durée totale Yoga
      evaluation: evaluation,
      exercises_done: pompesExercises.map(e => e.name).join(", "),
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
            <h2 style={{ margin: 0, color: '#FF6F3C' }}>Évaluation de la session Pompes</h2>
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
          <h2 style={{ margin: 0, color: '#FF6F3C' }}>Pompes - {exercise.name}</h2>
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
            if (currentIndex + 1 <pompesExercises.length) {
              navigate(`/workouts/Pompes/${pompesExercises[currentIndex + 1].id}`);
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

export default Pompes;
