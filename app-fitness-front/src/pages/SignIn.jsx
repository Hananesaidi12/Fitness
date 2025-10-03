import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("⚠️ Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/sigin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        // Stockage dans localStorage
        localStorage.setItem("user_fullname", data.user_fullname);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashbord");
        }
      } else {
        setErrorMsg(data.detail || "Email ou mot de passe incorrect.");
      }
    } catch (error) {
      setErrorMsg("Erreur serveur : " + error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/img/hom.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: "40px",
          borderRadius: "15px",
          maxWidth: "420px",
          width: "100%",
          color: "white",
          boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo / Accroche */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
           <h1
  style={{
    fontSize: '40px',
    fontWeight: 'bold',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    background: 'linear-gradient(to right, #FF5733 0%, #FF5733 50%, #ffffff 50%, #ffffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
  }}
>
  CoreFlex
</h1>
       
        </div>

        <h2 className="mb-4 text-center">Sign In</h2>

        {errorMsg && (
          <div
            style={{
              background: "rgba(255, 87, 51, 0.2)",
              color: "#ff5c33",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                backgroundColor: "#222",
                color: "white",
                border: "1px solid #444",
                padding: "12px",
                borderRadius: "6px",
                width: "100%",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #FF5733")}
              onBlur={(e) => (e.target.style.border = "1px solid #444")}
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: "#222",
                color: "white",
                border: "1px solid #444",
                padding: "12px",
                borderRadius: "6px",
                width: "100%",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #FF5733")}
              onBlur={(e) => (e.target.style.border = "1px solid #444")}
            />
          </div>
          <button
            type="submit"
            style={{
              background: "#FF5733",
              border: "none",
              padding: "12px",
              borderRadius: "6px",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              width: "100%",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#e74c3c")}
            onMouseOut={(e) => (e.target.style.background = "#FF5733")}
          >
            Sign In
          </button>
        </form>

        <p className="mt-3 text-center" style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "#17d0cf", textDecoration: "underline" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
