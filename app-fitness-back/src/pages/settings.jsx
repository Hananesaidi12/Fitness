
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { FaExclamationTriangle, FaUser, FaEnvelope, FaBirthdayCake, FaSignal } from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Charger les données utilisateur
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8000/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les données utilisateur");
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
        setFormData(data);
      })
      .catch((err) => setErrorMessage(err.message));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  };

  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8000/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        age: formData.age,
        level: formData.level,
        two_factor_enabled: formData.two_factor_enabled,
        dark_mode: formData.dark_mode,
        email_notifications: formData.email_notifications,
        auto_save_settings: formData.auto_save_settings,
        language: formData.language,
        timezone: formData.timezone,
        profile_visibility: formData.profile_visibility,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserInfo(formData);
        setEditMode(false);
        setSaveMessage(data.message || "Paramètres mis à jour avec succès !");
      })
      .catch(() => setErrorMessage("Erreur lors de la mise à jour"));
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) return;
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`http://localhost:8000/user/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression compte");
      localStorage.removeItem("userId");
      navigate("/");
      alert("Compte supprimé avec succès.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout title="Paramètres utilisateur">
      <main style={styles.main}>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {saveMessage && <p style={styles.success}>{saveMessage}</p>}

        <section style={styles.card}>
          <h2 style={styles.title}> Profil</h2>
          <div style={styles.fields}>
            {renderField("Prénom", "first_name", userInfo.first_name, formData.first_name, editMode, handleChange, <FaUser />)}
            {renderField("Nom", "last_name", userInfo.last_name, formData.last_name, editMode, handleChange, <FaUser />)}
            {renderField("Email", "email", userInfo.email, formData.email, editMode, handleChange, <FaEnvelope />)}
            {renderField("Âge", "age", userInfo.age, formData.age, editMode, handleChange, <FaBirthdayCake />, "number")}
            {renderField("Niveau", "level", userInfo.level, formData.level, editMode, handleChange, <FaSignal />)}
          </div>

          <h2 style={styles.title}>Avancé</h2>
          <div style={styles.fields}>
            {["two_factor_enabled", "dark_mode", "email_notifications", "auto_save_settings"].map((key) => (
              <div key={key} style={styles.checkboxField}>
                <label>
                  <input type="checkbox" name={key} checked={formData[key] || false} onChange={handleChange} disabled={!editMode} />
                  {key.replace(/_/g, " ")}
                </label>
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            {!editMode ? (
              <button style={styles.editBtn} onClick={() => setEditMode(true)}> Modifier</button>
            ) : (
              <>
                <button style={styles.saveBtn} onClick={handleSave}> Enregistrer</button>
                <button style={styles.cancelBtn} onClick={() => { setFormData(userInfo); setEditMode(false); }}> Annuler</button>
              </>
            )}
          </div>

          <div style={styles.deleteSection}>
            <button style={styles.deleteBtn} onClick={handleDeleteAccount}>
              <FaExclamationTriangle /> Supprimer mon compte
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

// 🔹 Composant helper pour éviter la répétition des champs
const renderField = (label, name, userValue, formValue, editMode, handleChange, icon, type = "text") => (
  <div style={styles.field}>
    <label style={styles.label}>
      {icon} {label} :
    </label>
    {editMode ? (
      <input type={type} name={name} value={formValue || ""} onChange={handleChange} style={styles.input} />
    ) : (
      <span style={styles.value}>{userValue}</span>
    )}
  </div>
);

const styles = {
  main: { padding: 30, background: "#f9fafb", minHeight: "100vh" },
  card: { background: "#fff", padding: 40, borderRadius: 20, maxWidth: 800, margin: "0 auto", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transition: "0.3s" },
  title: { fontSize: 20, marginBottom: 20, borderBottom: "2px solid #FF6F3C", paddingBottom: 5, color: "#333" },
  fields: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 10 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontWeight: "bold", color: "#444", fontSize: 14 },
  input: { padding: "10px 15px", borderRadius: 10, border: "1px solid #ddd", outline: "none", transition: "0.2s", fontSize: 14 },
  value: { padding: "10px 15px", background: "#f4f4f4", borderRadius: 10, fontSize: 14, color: "#555" },
  checkboxField: { display: "flex", alignItems: "center", gap: 8, fontSize: 14 },
  actions: { marginTop: 30, display: "flex", gap: 15, flexWrap: "wrap" },
  editBtn: { padding: "10px 25px", backgroundColor: "#FF6F3C", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", transition: "0.3s", fontSize: 14 },
  saveBtn: { padding: "10px 25px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", transition: "0.3s", fontSize: 14 },
  cancelBtn: { padding: "10px 25px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", transition: "0.3s", fontSize: 14 },
  deleteSection: { marginTop: 40, textAlign: "center" },
  deleteBtn: { padding: "12px 30px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", fontWeight: "bold", transition: "0.3s" },
  error: { color: "#dc3545", marginBottom: 15 },
  success: { color: "#28a745", marginBottom: 15 },
};

export default Settings;
