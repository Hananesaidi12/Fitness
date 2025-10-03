import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [level, setLevel] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!firstName || !lastName || !age || !email || !password || !gender || !level) {
      alert('Please fill all fields.');
      return;
    }

    if (isNaN(age) || age < 10 || age > 120) {
      alert('Please enter a valid age between 10 and 120.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          age: Number(age),
          email,
          password,
          gender,
          level,
        }),
      });

      if (response.ok) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        navigate('/sigin');  // correction du chemin de la page connexion
      } else {
        const data = await response.json();
        alert('Erreur : ' + (data.detail || 'Impossible de s\'inscrire.'));
      }
    } catch (error) {
      alert('Erreur réseau : ' + error.message);
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
          backgroundColor: 'rgba(0,0,0,0.75)',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          color: 'white',
          boxShadow: '0 0 15px rgba(0,0,0,0.7)',
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
        <h2 className="mb-4 text-center">Sign Up</h2>
        </div>
       
        <form onSubmit={handleSignup}>
          <div className="form-group mb-3">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              className="form-control"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="form-control"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              className="form-control"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min={10}
              max={120}
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            />
          </div>

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
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            >
              <option value="" disabled>
                Choose your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              className="form-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            >
              <option value="" disabled>
                Select your fitness level
              </option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
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
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ backgroundColor: '#333', color: 'white', border: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Sign Up
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{' '}
          <Link to="/sigin" style={{ color: '#17d0cf', textDecoration: 'underline' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
