import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Suppression des données d'authentification (exemple token localStorage)
    localStorage.removeItem("authToken");

    // On peut aussi supprimer d'autres données liées à la session ici

    // Redirection après un court délai (ex: 1 seconde)
    setTimeout(() => {
      navigate("/"); // changer la route vers ta page login/accueil
    }, 1000);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h2>Déconnexion en cours...</h2>
      <p>Vous allez être redirigé vers la page de connexion.</p>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f5f7fa",
    color: "#333",
  },
};

export default Logout;
