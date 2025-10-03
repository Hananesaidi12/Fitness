import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from "../components/Layout";

// ✅ Ajout des imports manquants pour les icônes
import { 
  FaSpa, 
  FaWeightHanging, 
  FaRunning, 
  FaWind, 
  FaFire, 
  FaDumbbell, 
  FaWalking, 
  FaBrain 
} from "react-icons/fa";

// Ajout de la propriété "objectif" pour chaque catalogue
const workoutCatalogues = [
  { id: 'yoga', title: 'Yoga', description: 'Relax and strengthen your body and mind.', icon: FaSpa, objectif: 'relaxation' },
  { id: 'squats', title: 'Squats', description: 'Build strong legs and glutes.', icon: FaWeightHanging, objectif: 'perte de poids' },
  { id: 'cardio', title: 'Cardio', description: 'Improve heart health and stamina.', icon: FaRunning, objectif: 'perte de poids' },
  { id: 'Pompes', title: 'Pompes', description: 'Enhance core strength and flexibility.', icon: FaWind, objectif: 'flexibilité' },
  
  { id: 'strength', title: 'Strength Training', description: 'Build muscle and increase endurance.', icon: FaDumbbell, objectif: 'force' },
  { id: 'stretching', title: 'Stretching', description: 'Improve flexibility and reduce injury risk.', icon: FaWalking, objectif: 'flexibilité' },
  { id: 'meditation', title: 'Meditation', description: 'Calm your mind and reduce stress.', icon: FaBrain, objectif: 'relaxation' },
];

const Workouts = () => {
  const location = useLocation();
  const [userFullName, setUserFullName] = useState("Utilisateur");
  const [filter, setFilter] = useState(''); // État pour filtrer

  useEffect(() => {
    const name = localStorage.getItem("user_fullname");
    if (name) setUserFullName(name);
  }, []);

  const getInitials = (fullName) => {
    const parts = fullName.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : fullName[0].toUpperCase();
  };

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

// Filter the catalogues based on the selected goal
const filteredCatalogues = filter
  ? workoutCatalogues.filter(c => c.objectif === filter)
  : workoutCatalogues;

return (
  <Layout title="Your Fitness Catalog">
    <main style={styles.mainContent}>
      {/* Filter */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="filter-select" style={{ fontWeight: '600', marginRight: 10 }}>
          Filter by goal:
        </label>
        <select
          id="filter-select"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          <option value=''>-- All --</option>
          <option value='perte de poids'>Weight Loss</option>
          <option value='relaxation'>Relaxation</option>
          <option value='flexibilité'>Flexibility</option>
          <option value='force'>Strength</option>
        </select>
      </div>

      {/* Catalogues */}
      <div style={styles.cataloguesContainer}>
        {filteredCatalogues.map(({ id, title, description, icon: Icon }) => (
          <div
            key={id}
            style={styles.catalogueCard}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,111,60,0.4)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,111,60,0.15)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <Icon size={28} style={{ color: '#FF6F3C', marginRight: 12 }} />
              <h3 style={styles.catalogueTitle}>{title}</h3>
            </div>
            <p style={styles.catalogueDesc}><em>{description}</em></p>
            <Link
              to={
                id === 'squats'
                  ? '/workouts/squats/squat-basic'
                  : id === 'yoga'
                    ? '/workouts/yoga/kapalabhati'
                    : id === 'stretching'
                      ? '/workouts/stretching/arm-cross-stretch'
                      : id === 'meditation'
                        ? '/workouts/meditation/visualisation'
                        : id === 'cardio'
                          ? '/workouts/cardio/Assault-air-bike'
                          : id === 'Pompes'
                            ? '/workouts/Pompes/pompe-archer'
                            : id === 'strength'
                              ? '/workouts/strength/dumbbell-bent-over-row-Cookie'
                              : `/workouts/${id}`
              }
              style={styles.catalogueBtn}
            >
              View Exercises
            </Link>
          </div>
        ))}
      </div>
    </main>
  </Layout>
);
}

const styles = {
  cataloguesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  catalogueCard: {
    background: '#fff',
    borderRadius: 15,
    padding: 24,
    boxShadow: '0 10px 20px rgba(255,111,60,0.15)',
    transition: 'box-shadow 0.3s ease',
  },
  catalogueTitle: {
    margin: '0 0 10px',
    color: '#FF6F3C',
    fontWeight: '700',
    fontSize: 22,
  },
  catalogueDesc: {
    margin: '0 0 16px',
    color: '#555',
    fontSize: 16,
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
  catalogueBtn: {
    display: 'inline-block',
    backgroundColor: '#FF6F3C',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Workouts;
