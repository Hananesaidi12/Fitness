import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { 
  FaHome, FaTachometerAlt, FaDumbbell, FaAppleAlt, FaChartLine, FaUsers, FaCog, FaSignOutAlt, 
  FaUser, FaBirthdayCake, FaSignal, FaEnvelope 
} from 'react-icons/fa';
import Layout from "../components/Layout";


const profileFields = [
  { key: 'first_name', label: 'Prénom', icon: <FaUser /> },
  { key: 'last_name', label: 'Nom', icon: <FaUser /> },
  { key: 'email', label: 'Email', icon: <FaEnvelope /> },
  { key: 'age', label: 'Âge', icon: <FaBirthdayCake /> },
  { key: 'level', label: 'Niveau', icon: <FaSignal /> },
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  const [userInfo, setUserInfo] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [hoverBtn, setHoverBtn] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:8000/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserInfo(data);
          setFormData(data);
        })
        .catch((err) => console.error('Erreur fetch user:', err));
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const payload = {
      full_name: `${formData.first_name} ${formData.last_name}`,
      email: formData.email,
      age: formData.age,
      level: formData.level,
      // ajoute ici d’autres champs si ton formulaire les contient
    };

    fetch(`http://localhost:8000/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API " + res.status);
        return res.json();
      })
      .then((data) => {
        alert(data.message); // "Utilisateur mis à jour avec succès."
        setUserInfo(formData);
        setEditMode(false);
      })
      .catch((err) => {
        console.error("Erreur mise à jour :", err);
        alert("❌ Erreur lors de la mise à jour !");
      });
  };

  const handleCancel = () => { setFormData(userInfo); setEditMode(false); };

  const getInitials = () => {
    if (!userInfo.first_name && !userInfo.last_name) return '';
    return `${userInfo.first_name?.[0] || ''}${userInfo.last_name?.[0] || ''}`.toUpperCase();
  };

  const renderFields = (data, readOnly = false) => (
    <div style={styles.fieldsContainer}>
      {profileFields.map(({ key, label, icon }) => (
        <div key={key} style={readOnly ? styles.field : styles.inputGroup}>
          <div style={styles.fieldLabel}>
            {icon} <span style={{ marginLeft: 6 }}>{label}:</span>
          </div>
          {readOnly ? (
            <div style={styles.value}>{data[key] ?? '-'}</div>
          ) : (
            <input
              type={key === 'age' ? 'number' : 'text'}
              name={key}
              value={formData[key] ?? ''}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => (e.target.style.border = '1px solid #FF6F3C')}
              onBlur={(e) => (e.target.style.border = '1px solid #ddd')}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    
<Layout title="Profil utilisateur">
      <main style={styles.mainContent}>
        

        <section style={styles.card}>
          

          {!editMode ? (
            <>
              {renderFields(userInfo, true)}
              <button
                style={{ ...styles.editBtn, ...(hoverBtn === 'edit' ? styles.editBtnHover : {}) }}
                onClick={() => navigate("/settings")}
                onMouseEnter={() => setHoverBtn('edit')}
                onMouseLeave={() => setHoverBtn(null)}
              >
                Modifier le profil
              </button>
            </>
          ) : (
            <>
              {renderFields(formData, false)}
              <div style={{ marginTop: 20 }}>
                <button
                  style={{ ...styles.saveBtn, ...(hoverBtn === 'save' ? styles.saveBtnHover : {}) }}
                  onClick={handleSave}
                  onMouseEnter={() => setHoverBtn('save')}
                  onMouseLeave={() => setHoverBtn(null)}
                >Enregistrer</button>
                <button
                  style={{ ...styles.cancelBtn, ...(hoverBtn === 'cancel' ? styles.cancelBtnHover : {}) }}
                  onClick={handleCancel}
                  onMouseEnter={() => setHoverBtn('cancel')}
                  onMouseLeave={() => setHoverBtn(null)}
                >Annuler</button>
              </div>
            </>
          )}
        </section>
       </main>
    </Layout>
  );
};

const styles = {
   card: { background: '#fff', borderRadius: 15, padding: 30, boxShadow: '0 10px 20px rgba(255,111,60,0.15)', maxWidth: 700, margin: '0 auto', transition: 'transform 0.2s', hover: { transform: 'scale(1.02)' } },
  userHeader: { display: 'flex', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 60, height: 60, borderRadius: '50%', background: '#FF6F3C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: 24, marginRight: 15 },
  fieldsContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', padding: '10px 14px', background: '#FAFAFA', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  fieldLabel: { display: 'flex', alignItems: 'center', fontWeight: 600, marginBottom: 4 },
  value: { color: '#555', fontSize: 16 },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  input: { width: '100%', padding: '12px 14px', fontSize: 16, borderRadius: 10, border: '1px solid #ddd', transition: 'border 0.2s, box-shadow 0.2s' },
  editBtn: { marginTop: 20, backgroundColor: '#FF6F3C', color: '#fff', padding: '12px 30px', borderRadius: 25, fontWeight: '700', cursor: 'pointer', border: 'none', fontSize: 16, transition: 'background 0.3s, transform 0.2s' },
  editBtnHover: { backgroundColor: '#e65a2c', transform: 'scale(1.05)' },
  saveBtn: { backgroundColor: '#28a745', color: '#fff', padding: '12px 30px', borderRadius: 25, fontWeight: '700', cursor: 'pointer', border: 'none', fontSize: 16, marginRight: 10, transition: 'background 0.3s, transform 0.2s' },
  saveBtnHover: { backgroundColor: '#218838', transform: 'scale(1.05)' },
  cancelBtn: { backgroundColor: '#6c757d', color: '#fff', padding: '12px 30px', borderRadius: 25, fontWeight: '700', cursor: 'pointer', border: 'none', fontSize: 16, transition: 'background 0.3s, transform 0.2s' },
  cancelBtnHover: { backgroundColor: '#5a6268', transform: 'scale(1.05)' },
};

export default Profile;
